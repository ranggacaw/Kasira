<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Role;
use App\Models\Subscription;
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

    private function createUserWithRole(string $roleName): User
    {
        $role = Role::query()->firstOrCreate(['name' => $roleName]);

        return User::factory()->create([
            'role_id' => $role->id,
        ]);
    }
}
