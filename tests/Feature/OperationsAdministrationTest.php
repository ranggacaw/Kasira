<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OperationsAdministrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_manage_outlets_and_staff_accounts(): void
    {
        $owner = $this->createUserWithRole(Role::OWNER);
        $subscription = Subscription::current();
        $subscription->fill(Subscription::defaultsFor(Subscription::PLAN_PRO))->save();

        $this->actingAs($owner)->post('/operations/outlets', [
            'name' => 'Second Outlet',
            'code' => 'OUT2',
            'address' => 'Jl. Outlet Dua',
            'is_active' => true,
            'is_primary' => false,
        ])->assertRedirect();

        $this->actingAs($owner)->post('/operations/users', [
            'name' => 'Branch Manager',
            'email' => 'branch.manager@example.test',
            'password' => 'password123',
            'role_id' => Role::query()->firstOrCreate(['name' => Role::MANAGER])->id,
            'outlet_id' => User::query()->first()->outlet_id,
            'is_active' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('outlets', ['code' => 'OUT2']);
        $this->assertDatabaseHas('users', ['email' => 'branch.manager@example.test']);
    }

    public function test_cashier_is_blocked_from_administrative_modules(): void
    {
        $cashier = $this->createUserWithRole(Role::CASHIER);

        $this->actingAs($cashier)
            ->post('/operations/users', [
                'name' => 'Blocked User',
                'email' => 'blocked@example.test',
                'password' => 'password123',
                'role_id' => Role::query()->where('name', Role::CASHIER)->firstOrFail()->id,
                'outlet_id' => $cashier->outlet_id,
                'is_active' => true,
            ])
            ->assertForbidden();
    }

    public function test_staff_can_create_customers_and_associate_them_to_sales(): void
    {
        $cashier = $this->createUserWithRole(Role::CASHIER);
        $product = Product::query()->create([
            'name' => 'Sandwich',
            'sku' => 'SND001',
            'selling_price' => 30000,
            'cost_price' => 15000,
            'stock_quantity' => 12,
            'outlet_id' => $cashier->outlet_id,
        ]);

        $this->actingAs($cashier)->post('/operations/customers', [
            'name' => 'Maya Customer',
            'email' => 'maya@example.test',
            'phone' => '08123456789',
            'membership_number' => 'MEM-001',
            'membership_tier' => 'Silver',
            'membership_discount_rate' => 0,
            'is_active' => true,
        ])->assertRedirect();

        $customer = Customer::query()->where('email', 'maya@example.test')->firstOrFail();

        $this->actingAs($cashier)->post('/pos/checkout', [
            'outlet_id' => $cashier->outlet_id,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ],
            ],
            'customer_id' => $customer->id,
            'discount_type' => 'fixed',
            'discount_value' => 0,
            'tax_rate' => 0,
            'service_fee_rate' => 0,
            'payment_method' => 'Cash',
        ])->assertRedirect();

        $this->assertDatabaseHas('transactions', [
            'customer_id' => $customer->id,
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
