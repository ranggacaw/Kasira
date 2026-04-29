<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Product;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_surfaces_revenue_top_sellers_and_low_stock_alerts(): void
    {
        $manager = $this->createUserWithRole(Role::MANAGER);

        $topSeller = Product::query()->create([
            'name' => 'Matcha Latte',
            'sku' => 'MAT001',
            'selling_price' => 32000,
            'cost_price' => 15000,
            'stock_quantity' => 15,
            'minimum_stock' => 5,
            'outlet_id' => $manager->outlet_id,
        ]);

        $lowStock = Product::query()->create([
            'name' => 'Cheesecake Slice',
            'sku' => 'CAKE02',
            'selling_price' => 30000,
            'cost_price' => 14000,
            'stock_quantity' => 2,
            'minimum_stock' => 4,
            'outlet_id' => $manager->outlet_id,
        ]);

        $transaction = Transaction::query()->create([
            'invoice_number' => Transaction::generateInvoiceNumber(),
            'cashier_id' => $manager->id,
            'outlet_id' => $manager->outlet_id,
            'subtotal' => 64000,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'service_fee_amount' => 0,
            'total' => 64000,
            'paid_at' => now(),
        ]);

        $transaction->items()->create([
            'product_id' => $topSeller->id,
            'quantity' => 2,
            'unit_price' => 32000,
            'unit_cost' => 15000,
            'subtotal' => 64000,
        ]);

        $transaction->payments()->create([
            'method' => Payment::METHOD_CASH,
            'amount' => 64000,
        ]);

        $this->actingAs($manager)
            ->get('/dashboard')
            ->assertOk()
            ->assertSee('Matcha Latte')
            ->assertSee('Cheesecake Slice');
    }

    private function createUserWithRole(string $roleName): User
    {
        $role = Role::query()->firstOrCreate(['name' => $roleName]);

        return User::factory()->create([
            'role_id' => $role->id,
        ]);
    }
}
