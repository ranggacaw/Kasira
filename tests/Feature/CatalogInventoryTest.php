<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogInventoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_admin_and_manager_can_access_product_management(): void
    {
        $owner = $this->createUserWithRole(Role::OWNER);
        $admin = $this->createUserWithRole(Role::ADMIN);
        $manager = $this->createUserWithRole(Role::MANAGER);
        $cashier = $this->createUserWithRole(Role::CASHIER);

        $this->actingAs($owner)->get('/products')->assertOk();
        $this->actingAs($admin)->get('/products')->assertOk();
        $this->actingAs($manager)->get('/products')->assertOk();
        $this->actingAs($cashier)->get('/products')->assertForbidden();
    }

    public function test_admin_can_create_catalog_records_and_record_stock_movements(): void
    {
        $admin = $this->createUserWithRole(Role::ADMIN);
        $outlet = Outlet::query()->first();

        $this->actingAs($admin)->post('/categories', [
            'name' => 'Beverages',
            'description' => 'Drink menu',
            'color' => '#0f766e',
            'sort_order' => 1,
            'is_active' => true,
        ])->assertRedirect();

        $categoryId = (int) Category::query()->value('id');

        $this->actingAs($admin)->post('/products', [
            'outlet_id' => $outlet->id,
            'category_id' => $categoryId,
            'name' => 'Cold Brew',
            'sku' => 'CB001',
            'barcode' => '89900001',
            'selling_price' => 28000,
            'cost_price' => 12000,
            'stock_quantity' => 5,
            'minimum_stock' => 4,
            'image_path' => 'https://example.test/cold-brew.png',
            'is_active' => true,
            'track_stock' => true,
        ])->assertRedirect();

        $product = Product::query()->where('sku', 'CB001')->firstOrFail();

        $this->actingAs($admin)->post('/inventory/movements', [
            'product_id' => $product->id,
            'type' => 'stock_out',
            'quantity' => 2,
            'notes' => 'Damaged cups',
        ])->assertRedirect();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 3,
        ]);

        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'type' => 'stock_out',
            'quantity' => 2,
            'balance_after' => 3,
        ]);

        $this->actingAs($admin)
            ->get('/dashboard')
            ->assertOk()
            ->assertSee('Cold Brew');
    }

    private function createUserWithRole(string $roleName): User
    {
        $role = Role::query()->firstOrCreate(['name' => $roleName]);

        return User::factory()->create([
            'role_id' => $role->id,
        ]);
    }
}
