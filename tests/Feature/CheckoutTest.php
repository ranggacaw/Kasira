<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_checkout(): void
    {
        $this->get('/pos')
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_see_checkout_page_with_starter_plan_pos_flags(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/pos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Pos/Checkout')
                ->where('receiptChannels', ['print'])
                ->where('features.promotions', false)
                ->where('features.vouchers', false)
                ->where('features.cashierShifts', false)
                ->where('features.splitPayment', false)
                ->where('features.qrisIntegration', false)
                ->where('features.offlineDraftSync', false)
                ->where('features.thermalPrinting', false)
                ->where('auth.user.abilities.checkout', true));
    }

    public function test_business_plan_exposes_premium_pos_flags_and_receipt_channels(): void
    {
        $user = User::factory()->create();

        Subscription::current()
            ->fill(Subscription::defaultsFor(Subscription::PLAN_BUSINESS))
            ->save();

        $this->actingAs($user)
            ->get('/pos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Pos/Checkout')
                ->where('receiptChannels', ['print', 'email', 'whatsapp'])
                ->where('features.promotions', true)
                ->where('features.vouchers', true)
                ->where('features.cashierShifts', true)
                ->where('features.splitPayment', true)
                ->where('features.qrisIntegration', true)
                ->where('features.offlineDraftSync', true)
                ->where('features.thermalPrinting', true));
    }

    public function test_checkout_shows_active_products(): void
    {
        $user = User::factory()->create();
        Product::query()->create([
            'name' => 'Espresso',
            'sku' => 'ESP001',
            'selling_price' => 15000,
            'is_active' => true,
        ]);
        Product::query()->create([
            'name' => 'Inactive Product',
            'sku' => 'INA001',
            'selling_price' => 10000,
            'is_active' => false,
        ]);

        $response = $this->actingAs($user)->get('/pos');

        $response->assertOk();
        $response->assertSee('Espresso');
        $response->assertDontSee('Inactive Product');
    }

    public function test_checkout_payload_excludes_product_cost_fields(): void
    {
        $user = User::factory()->create();

        Product::query()->create([
            'name' => 'Espresso',
            'sku' => 'ESP001',
            'selling_price' => 15000,
            'cost_price' => 7000,
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->get('/pos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Pos/Checkout')
                ->has('products', 1)
                ->missing('products.0.cost_price')
                ->missing('products.0.minimum_margin'));
    }

    public function test_checkout_requires_at_least_one_item(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/pos/checkout', [
            'items' => [],
            'discount_type' => 'fixed',
            'discount_value' => 0,
            'tax_rate' => 0,
            'service_fee_rate' => 0,
            'payment_method' => 'Cash',
        ]);

        $response->assertSessionHasErrors('items');
        $this->assertDatabaseCount('transactions', 0);
    }

    public function test_checkout_requires_valid_payment_method(): void
    {
        $user = User::factory()->create();
        $product = Product::query()->create([
            'name' => 'Espresso',
            'sku' => 'ESP001',
            'selling_price' => 15000,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->post('/pos/checkout', [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ],
            ],
            'discount_type' => 'fixed',
            'discount_value' => 0,
            'tax_rate' => 0,
            'service_fee_rate' => 0,
            'payment_method' => 'InvalidMethod',
        ]);

        $response->assertSessionHasErrors('payment_method');
        $this->assertDatabaseCount('transactions', 0);
    }

    public function test_valid_checkout_creates_transaction(): void
    {
        $user = User::factory()->create();
        $product = Product::query()->create([
            'name' => 'Espresso',
            'sku' => 'ESP001',
            'selling_price' => 15000,
            'cost_price' => 8000,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->post('/pos/checkout', [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                ],
            ],
            'discount_type' => 'fixed',
            'discount_value' => 0,
            'tax_rate' => 0,
            'service_fee_rate' => 0,
            'payment_method' => 'Cash',
        ]);

        $transaction = Transaction::query()->firstOrFail();

        $response->assertRedirect(route('pos.success', $transaction));

        $this->assertDatabaseHas('transactions', [
            'cashier_id' => $user->id,
            'subtotal' => 30000,
            'total' => 30000,
        ]);

        $this->assertDatabaseHas('transaction_items', [
            'product_id' => $product->id,
            'quantity' => 2,
            'subtotal' => 30000,
        ]);

        $this->assertDatabaseHas('payments', [
            'method' => 'Cash',
            'amount' => 30000,
        ]);
    }

    public function test_checkout_persists_immutable_profitability_snapshots(): void
    {
        $user = User::factory()->create();
        $product = Product::query()->create([
            'name' => 'Latte',
            'sku' => 'LAT001',
            'selling_price' => 20000,
            'cost_price' => 9000,
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $this->actingAs($user)->post('/pos/checkout', [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                ],
            ],
            'discount_type' => 'fixed',
            'discount_value' => 0,
            'tax_rate' => 0,
            'service_fee_rate' => 0,
            'payment_method' => 'Cash',
        ])->assertRedirect();

        $this->assertDatabaseHas('transaction_items', [
            'product_id' => $product->id,
            'product_name_snapshot' => 'Latte',
            'selling_price_snapshot' => 20000,
            'cost_price_snapshot' => 9000,
            'subtotal_revenue_snapshot' => 40000,
            'subtotal_cost_snapshot' => 18000,
            'gross_profit_snapshot' => 22000,
            'gross_margin_snapshot' => 55,
        ]);

        $product->update([
            'name' => 'Iced Latte',
            'selling_price' => 24000,
            'cost_price' => 12000,
        ]);

        $this->assertDatabaseHas('transaction_items', [
            'product_id' => $product->id,
            'product_name_snapshot' => 'Latte',
            'selling_price_snapshot' => 20000,
            'cost_price_snapshot' => 9000,
            'gross_profit_snapshot' => 22000,
        ]);
    }

    public function test_checkout_with_discount_and_tax(): void
    {
        $user = User::factory()->create();
        $product = Product::query()->create([
            'name' => 'Espresso',
            'sku' => 'ESP001',
            'selling_price' => 10000,
            'is_active' => true,
        ]);

        $this->actingAs($user)->post('/pos/checkout', [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ],
            ],
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'tax_rate' => 10,
            'service_fee_rate' => 0,
            'payment_method' => 'QRIS',
        ]);

        $this->assertDatabaseHas('transactions', [
            'subtotal' => 10000,
            'discount_amount' => 1000,
            'tax_amount' => 900,
            'total' => 9900,
        ]);
    }

    public function test_checkout_recalculates_authoritative_totals_server_side(): void
    {
        $user = User::factory()->create();
        $product = Product::query()->create([
            'name' => 'Latte',
            'sku' => 'LAT001',
            'selling_price' => 25000,
            'is_active' => true,
        ]);

        $this->actingAs($user)->post('/pos/checkout', [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                ],
            ],
            'discount_type' => 'fixed',
            'discount_value' => 5000,
            'tax_rate' => 10,
            'service_fee_rate' => 5,
            'payment_method' => 'Bank Transfer',
        ]);

        $this->assertDatabaseHas('transactions', [
            'cashier_id' => $user->id,
            'subtotal' => 50000,
            'discount_amount' => 5000,
            'tax_amount' => 4500,
            'service_fee_amount' => 2250,
            'total' => 51750,
        ]);

        $this->assertDatabaseHas('payments', [
            'method' => 'Bank Transfer',
            'amount' => 51750,
        ]);
    }
}
