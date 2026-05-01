<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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

    public function test_inventory_search_filters_movements_by_product_name(): void
    {
        $admin = $this->createUserWithRole(Role::ADMIN);
        $outlet = Outlet::query()->firstOrFail();

        $match = Product::query()->create([
            'outlet_id' => $outlet->id,
            'name' => 'Cappuccino',
            'sku' => 'CAP001',
            'barcode' => '100001',
            'selling_price' => 30000,
            'cost_price' => 12000,
            'stock_quantity' => 10,
            'minimum_stock' => 2,
            'is_active' => true,
            'track_stock' => true,
        ]);

        $other = Product::query()->create([
            'outlet_id' => $outlet->id,
            'name' => 'Latte',
            'sku' => 'LAT001',
            'barcode' => '100002',
            'selling_price' => 28000,
            'cost_price' => 11000,
            'stock_quantity' => 8,
            'minimum_stock' => 2,
            'is_active' => true,
            'track_stock' => true,
        ]);

        StockMovement::query()->create([
            'product_id' => $match->id,
            'outlet_id' => $outlet->id,
            'user_id' => $admin->id,
            'type' => 'stock_in',
            'quantity' => 2,
            'balance_after' => 12,
            'notes' => 'Inventory refill',
        ]);

        StockMovement::query()->create([
            'product_id' => $other->id,
            'outlet_id' => $outlet->id,
            'user_id' => $admin->id,
            'type' => 'stock_in',
            'quantity' => 2,
            'balance_after' => 10,
            'notes' => 'Inventory refill',
        ]);

        $this->actingAs($admin)
            ->get('/inventory?outlet='.$outlet->id.'&search=Cappu')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Inventory/Index')
                ->where('filters.search', 'Cappu')
                ->where('movements.total', 1)
                ->where('movements.data.0.product.name', 'Cappuccino'));
    }

    private function createUserWithRole(string $roleName): User
    {
        $role = Role::query()->firstOrCreate(['name' => $roleName]);

        return User::factory()->create([
            'role_id' => $role->id,
        ]);
    }
}
