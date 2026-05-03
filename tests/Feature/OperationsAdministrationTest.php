<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Payment;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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

    public function test_admin_can_manage_branches_and_cashier_accounts_from_operations(): void
    {
        $admin = $this->createUserWithRole(Role::ADMIN);
        $cashier = $this->createUserWithRole(Role::CASHIER);
        $this->createUserWithRole(Role::MANAGER);

        Subscription::current()->fill(Subscription::defaultsFor(Subscription::PLAN_PRO))->save();

        $this->actingAs($admin)
            ->get('/operations')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Operations/Index')
                ->has('roles', 1)
                ->where('roles.0.name', Role::CASHIER)
                ->has('staffUsers', 1)
                ->where('staffUsers.0.id', $cashier->id));

        $this->actingAs($admin)->post('/operations/outlets', [
            'name' => 'East Branch',
            'code' => 'BR02',
            'address' => 'Jl. Cabang Timur',
            'is_active' => true,
            'is_primary' => false,
        ])->assertRedirect();

        $branch = Outlet::query()->where('code', 'BR02')->firstOrFail();

        $this->actingAs($admin)->patch('/operations/outlets/'.$branch->id, [
            'name' => 'East Branch',
            'code' => 'BR02',
            'address' => 'Jl. Cabang Timur Baru',
            'is_active' => false,
            'is_primary' => false,
        ])->assertRedirect();

        $this->assertDatabaseHas('outlets', [
            'id' => $branch->id,
            'address' => 'Jl. Cabang Timur Baru',
            'is_active' => false,
        ]);

        $this->actingAs($admin)->patch('/operations/outlets/'.$branch->id, [
            'name' => 'East Branch HQ',
            'code' => 'BR02',
            'address' => 'Jl. Cabang Timur Baru',
            'is_active' => true,
            'is_primary' => true,
        ])->assertRedirect();

        $cashierRoleId = Role::query()->where('name', Role::CASHIER)->firstOrFail()->id;

        $this->actingAs($admin)->post('/operations/users', [
            'name' => 'Night Cashier',
            'email' => 'night.cashier@example.test',
            'password' => 'password123',
            'role_id' => $cashierRoleId,
            'outlet_id' => $branch->id,
            'is_active' => true,
        ])->assertRedirect();

        $managedCashier = User::query()->where('email', 'night.cashier@example.test')->firstOrFail();

        $this->actingAs($admin)->patch('/operations/users/'.$managedCashier->id, [
            'name' => 'Night Cashier Lead',
            'email' => 'night.cashier@example.test',
            'password' => '',
            'role_id' => $cashierRoleId,
            'outlet_id' => $branch->id,
            'is_active' => false,
        ])->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $managedCashier->id,
            'name' => 'Night Cashier Lead',
            'is_active' => false,
        ]);

        $this->actingAs($admin)->patch('/operations/users/'.$managedCashier->id, [
            'name' => 'Night Cashier Lead',
            'email' => 'night.cashier@example.test',
            'password' => '',
            'role_id' => $cashierRoleId,
            'outlet_id' => $branch->id,
            'is_active' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('outlets', [
            'id' => $branch->id,
            'name' => 'East Branch HQ',
            'is_active' => true,
            'is_primary' => true,
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $managedCashier->id,
            'is_active' => true,
        ]);
    }

    public function test_admin_cannot_create_or_update_non_cashier_staff_accounts(): void
    {
        $admin = $this->createUserWithRole(Role::ADMIN);
        $manager = $this->createUserWithRole(Role::MANAGER);
        $managerRoleId = Role::query()->where('name', Role::MANAGER)->firstOrFail()->id;

        $this->actingAs($admin)
            ->post('/operations/users', [
                'name' => 'Blocked Manager',
                'email' => 'blocked.manager@example.test',
                'password' => 'password123',
                'role_id' => $managerRoleId,
                'outlet_id' => $admin->outlet_id,
                'is_active' => true,
            ])
            ->assertInvalid(['role_id']);

        $this->actingAs($admin)
            ->patch('/operations/users/'.$manager->id, [
                'name' => $manager->name,
                'email' => $manager->email,
                'password' => '',
                'role_id' => $managerRoleId,
                'outlet_id' => $manager->outlet_id,
                'is_active' => $manager->is_active,
            ])
            ->assertForbidden();
    }

    public function test_admin_cannot_exceed_active_user_capacity_when_creating_or_reactivating_cashiers(): void
    {
        $admin = $this->createUserWithRole(Role::ADMIN);
        $cashierRoleId = Role::query()->where('name', Role::CASHIER)->firstOrFail()->id;

        Subscription::current()->fill(Subscription::defaultsFor(Subscription::PLAN_STARTER))->save();

        User::factory()->count(4)->create([
            'role_id' => $cashierRoleId,
        ]);

        $inactiveCashier = User::factory()->create([
            'role_id' => $cashierRoleId,
            'is_active' => false,
        ]);

        $this->actingAs($admin)
            ->post('/operations/users', [
                'name' => 'Extra Cashier',
                'email' => 'extra.cashier@example.test',
                'password' => 'password123',
                'role_id' => $cashierRoleId,
                'outlet_id' => $admin->outlet_id,
                'is_active' => true,
            ])
            ->assertInvalid(['is_active']);

        $this->actingAs($admin)
            ->patch('/operations/users/'.$inactiveCashier->id, [
                'name' => $inactiveCashier->name,
                'email' => $inactiveCashier->email,
                'password' => '',
                'role_id' => $cashierRoleId,
                'outlet_id' => $inactiveCashier->outlet_id,
                'is_active' => true,
            ])
            ->assertInvalid(['is_active']);
    }

    public function test_admin_cannot_exceed_active_outlet_capacity_when_creating_or_reactivating_branches(): void
    {
        $admin = $this->createUserWithRole(Role::ADMIN);

        Subscription::current()->fill(Subscription::defaultsFor(Subscription::PLAN_STARTER))->save();

        $inactiveBranch = Outlet::query()->create([
            'name' => 'Dormant Branch',
            'code' => 'DRM',
            'address' => 'Jl. Dormant',
            'is_active' => false,
            'is_primary' => false,
        ]);

        $this->actingAs($admin)
            ->post('/operations/outlets', [
                'name' => 'Overflow Branch',
                'code' => 'OVR',
                'address' => 'Jl. Overflow',
                'is_active' => true,
                'is_primary' => false,
            ])
            ->assertInvalid(['is_active']);

        $this->actingAs($admin)
            ->patch('/operations/outlets/'.$inactiveBranch->id, [
                'name' => $inactiveBranch->name,
                'code' => $inactiveBranch->code,
                'address' => $inactiveBranch->address,
                'is_active' => true,
                'is_primary' => false,
            ])
            ->assertInvalid(['is_active']);
    }

    public function test_cashier_is_blocked_from_staff_and_branch_administration_routes(): void
    {
        $cashier = $this->createUserWithRole(Role::CASHIER);
        $managedUser = User::factory()->create();
        $outlet = Outlet::query()->firstOrFail();

        $this->actingAs($cashier)->get('/operations')->assertForbidden();

        $this->actingAs($cashier)
            ->post('/operations/outlets', [
                'name' => 'Blocked Branch',
                'code' => 'BLK',
                'address' => 'Jl. Blocked',
                'is_active' => true,
                'is_primary' => false,
            ])
            ->assertForbidden();

        $this->actingAs($cashier)
            ->patch('/operations/outlets/'.$outlet->id, [
                'name' => $outlet->name,
                'code' => $outlet->code,
                'address' => $outlet->address,
                'is_active' => $outlet->is_active,
                'is_primary' => $outlet->is_primary,
            ])
            ->assertForbidden();

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

        $this->actingAs($cashier)
            ->patch('/operations/users/'.$managedUser->id, [
                'name' => $managedUser->name,
                'email' => $managedUser->email,
                'password' => '',
                'role_id' => $managedUser->role_id,
                'outlet_id' => $managedUser->outlet_id,
                'is_active' => $managedUser->is_active,
            ])
            ->assertForbidden();
    }

    public function test_managers_can_create_customers_and_cashiers_can_associate_them_to_sales(): void
    {
        $cashier = $this->createUserWithRole(Role::CASHIER);
        $manager = $this->createUserWithRole(Role::MANAGER);
        $product = Product::query()->create([
            'name' => 'Sandwich',
            'sku' => 'SND001',
            'selling_price' => 30000,
            'cost_price' => 15000,
            'stock_quantity' => 12,
            'outlet_id' => $cashier->outlet_id,
        ]);

        $this->actingAs($manager)->post('/operations/customers', [
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

    public function test_customer_workflow_shows_recent_purchase_history_with_transaction_links(): void
    {
        $manager = $this->createUserWithRole(Role::MANAGER);
        $cashier = $this->createUserWithRole(Role::CASHIER);
        $customer = Customer::query()->create([
            'name' => 'Maya Customer',
            'email' => 'maya@example.test',
            'membership_discount_rate' => 0,
            'is_active' => true,
        ]);
        $product = Product::query()->create([
            'name' => 'Brownie',
            'sku' => 'BRN001',
            'selling_price' => 18000,
            'cost_price' => 7000,
            'stock_quantity' => 15,
            'outlet_id' => $cashier->outlet_id,
        ]);

        $transaction = Transaction::query()->create([
            'invoice_number' => Transaction::generateInvoiceNumber(),
            'cashier_id' => $cashier->id,
            'outlet_id' => $cashier->outlet_id,
            'customer_id' => $customer->id,
            'subtotal' => 18000,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'service_fee_amount' => 0,
            'total' => 18000,
            'status' => Transaction::STATUS_COMPLETED,
            'paid_amount' => 18000,
            'paid_at' => now(),
        ]);

        $transaction->items()->create([
            'product_id' => $product->id,
            'product_name_snapshot' => $product->name,
            'quantity' => 1,
            'unit_price' => 18000,
            'unit_cost' => 7000,
            'subtotal' => 18000,
            'selling_price_snapshot' => 18000,
            'cost_price_snapshot' => 7000,
            'subtotal_revenue_snapshot' => 18000,
            'subtotal_cost_snapshot' => 7000,
            'gross_profit_snapshot' => 11000,
            'gross_margin_snapshot' => 61.11,
        ]);

        $transaction->payments()->create([
            'method' => Payment::METHOD_CASH,
            'amount' => 18000,
        ]);

        $this->actingAs($manager)
            ->get('/operations?section=customers')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Operations/Index')
                ->where('customers.0.name', 'Maya Customer')
                ->where('customers.0.recent_transactions.0.id', $transaction->id)
                ->where('customers.0.recent_transactions.0.invoice_number', $transaction->invoice_number)
                ->where('customers.0.recent_transactions.0.status', Transaction::STATUS_COMPLETED));
    }

    private function createUserWithRole(string $roleName): User
    {
        $role = Role::query()->firstOrCreate(['name' => $roleName]);

        return User::factory()->create([
            'role_id' => $role->id,
        ]);
    }
}
