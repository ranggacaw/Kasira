<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\CashierShift;
use App\Models\Payment;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PremiumExtensionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_starter_plan_blocks_premium_reporting_and_promotions(): void
    {
        $owner = $this->createUserWithRole(Role::OWNER);

        $this->actingAs($owner)->get('/premium/reports/export')->assertForbidden();

        $this->actingAs($owner)->post('/premium/promotions', [
            'name' => 'Weekend Promo',
            'type' => 'percentage',
            'value' => 10,
            'minimum_spend' => 0,
            'is_active' => true,
        ])->assertForbidden();
    }

    public function test_business_plan_supports_exports_commerce_extensions_and_shift_workflows(): void
    {
        $owner = $this->createUserWithRole(Role::OWNER);
        $cashier = $this->createUserWithRole(Role::CASHIER);
        $subscription = Subscription::current();
        $subscription->fill(Subscription::defaultsFor(Subscription::PLAN_BUSINESS))->save();

        $product = Product::query()->create([
            'name' => 'Premium Beans',
            'sku' => 'BEAN-01',
            'selling_price' => 120000,
            'cost_price' => 70000,
            'stock_quantity' => 10,
            'outlet_id' => $cashier->outlet_id,
        ]);

        $this->actingAs($cashier)->post('/pos/checkout', [
            'outlet_id' => $cashier->outlet_id,
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
            'payment_method' => 'Cash',
        ])->assertRedirect();

        $this->actingAs($owner)->get('/premium/reports/export')
            ->assertOk()
            ->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

        $this->actingAs($owner)->post('/premium/promotions', [
            'name' => 'Weekend Promo',
            'type' => 'percentage',
            'value' => 10,
            'minimum_spend' => 50000,
            'is_active' => true,
        ])->assertRedirect();

        $this->actingAs($owner)->post('/premium/vouchers', [
            'code' => 'SAVE10',
            'type' => 'fixed',
            'value' => 10000,
            'minimum_spend' => 50000,
            'is_active' => true,
        ])->assertRedirect();

        $this->actingAs($cashier)->post('/premium/shifts/open', [
            'outlet_id' => $cashier->outlet_id,
            'opening_balance' => 50000,
        ])->assertRedirect();

        $this->assertDatabaseHas('promotions', ['name' => 'Weekend Promo']);
        $this->assertDatabaseHas('vouchers', ['code' => 'SAVE10']);
        $this->assertDatabaseHas('cashier_shifts', [
            'user_id' => $cashier->id,
            'status' => 'open',
        ]);
    }

    public function test_business_shift_closure_stores_expected_cash_difference_and_sales_summary(): void
    {
        $cashier = $this->createUserWithRole(Role::CASHIER);

        Subscription::current()->fill(Subscription::defaultsFor(Subscription::PLAN_BUSINESS))->save();

        $cashProduct = Product::query()->create([
            'name' => 'Cash Sale Item',
            'sku' => 'CSH-01',
            'selling_price' => 12000,
            'cost_price' => 6000,
            'stock_quantity' => 10,
            'outlet_id' => $cashier->outlet_id,
        ]);

        $nonCashProduct = Product::query()->create([
            'name' => 'QRIS Sale Item',
            'sku' => 'QRS-01',
            'selling_price' => 8000,
            'cost_price' => 3000,
            'stock_quantity' => 10,
            'outlet_id' => $cashier->outlet_id,
        ]);

        $this->actingAs($cashier)->post('/premium/shifts/open', [
            'outlet_id' => $cashier->outlet_id,
            'opening_balance' => 10000,
        ])->assertRedirect();

        $this->actingAs($cashier)->post('/pos/checkout', [
            'outlet_id' => $cashier->outlet_id,
            'items' => [
                [
                    'product_id' => $cashProduct->id,
                    'quantity' => 1,
                ],
            ],
            'discount_type' => 'fixed',
            'discount_value' => 0,
            'tax_rate' => 0,
            'service_fee_rate' => 0,
            'payment_method' => Payment::METHOD_CASH,
        ])->assertRedirect();

        $this->actingAs($cashier)->post('/pos/checkout', [
            'outlet_id' => $cashier->outlet_id,
            'items' => [
                [
                    'product_id' => $nonCashProduct->id,
                    'quantity' => 1,
                ],
            ],
            'discount_type' => 'fixed',
            'discount_value' => 0,
            'tax_rate' => 0,
            'service_fee_rate' => 0,
            'payment_method' => Payment::METHOD_QRIS,
        ])->assertRedirect();

        $shift = CashierShift::query()->where('user_id', $cashier->id)->latest('opened_at')->firstOrFail();

        $this->assertSame(2, Transaction::query()->where('cashier_shift_id', $shift->id)->count());

        $this->actingAs($cashier)->patch('/premium/shifts/'.$shift->id.'/close', [
            'closing_balance' => 23000,
        ])->assertRedirect();

        $shift->refresh();

        $this->assertSame('closed', $shift->status);
        $this->assertSame('22000.00', $shift->expected_cash);
        $this->assertSame('1000.00', $shift->cash_difference);
        $this->assertSame(2, $shift->sales_summary['transaction_count']);
        $this->assertSame(20000, $shift->sales_summary['total_sales']);
        $this->assertSame(12000, $shift->sales_summary['cash_sales']);
        $this->assertSame(8000, $shift->sales_summary['non_cash_sales']);
    }

    private function createUserWithRole(string $roleName): User
    {
        $role = Role::query()->firstOrCreate(['name' => $roleName]);

        return User::factory()->create([
            'role_id' => $role->id,
        ]);
    }
}
