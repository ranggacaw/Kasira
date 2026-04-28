<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_checkout(): void
    {
        $this->get('/pos/checkout')
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_see_checkout_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/pos/checkout')
            ->assertOk();
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

        $response = $this->actingAs($user)->get('/pos/checkout');

        $response->assertOk();
        $response->assertSee('Espresso');
        $response->assertDontSee('Inactive Product');
    }

    public function test_checkout_requires_at_least_one_item(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/pos/checkout', [
            'items' => [],
            'subtotal' => 0,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'service_fee_amount' => 0,
            'total' => 0,
            'payment_method' => 'Cash',
        ]);

        $response->assertSessionHasErrors('items');
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
                    'unit_price' => 15000,
                    'subtotal' => 15000,
                ],
            ],
            'subtotal' => 15000,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'service_fee_amount' => 0,
            'total' => 15000,
            'payment_method' => 'InvalidMethod',
        ]);

        $response->assertSessionHasErrors('payment_method');
    }

    public function test_valid_checkout_creates_transaction(): void
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
                    'quantity' => 2,
                    'unit_price' => 15000,
                    'subtotal' => 30000,
                ],
            ],
            'subtotal' => 30000,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'service_fee_amount' => 0,
            'total' => 30000,
            'payment_method' => 'Cash',
        ]);

        $response->assertRedirect(route('pos.checkout'));
        $response->assertSessionHas('success');

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
                    'unit_price' => 10000,
                    'subtotal' => 10000,
                ],
            ],
            'subtotal' => 10000,
            'discount_amount' => 1000,
            'tax_amount' => 900,
            'service_fee_amount' => 0,
            'total' => 9900,
            'payment_method' => 'QRIS',
        ]);

        $this->assertDatabaseHas('transactions', [
            'subtotal' => 10000,
            'discount_amount' => 1000,
            'tax_amount' => 900,
            'total' => 9900,
        ]);
    }
}