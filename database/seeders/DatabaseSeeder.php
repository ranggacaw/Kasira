<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Outlet;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(StaffAccountsSeeder::class);

        $outlet = Outlet::query()->where('code', 'MAIN')->firstOrFail();

        $categories = collect([
            ['name' => 'Coffee'],
            ['name' => 'Tea'],
            ['name' => 'Pastry'],
        ])->mapWithKeys(fn (array $category) => [
            $category['name'] => Category::query()->firstOrCreate(['name' => $category['name']], $category),
        ]);

        $products = [
            ['name' => 'Espresso', 'sku' => 'ESP001', 'selling_price' => 15000, 'cost_price' => 7000, 'stock_quantity' => 40, 'minimum_stock' => 8, 'category_id' => $categories['Coffee']->id],
            ['name' => 'Americano', 'sku' => 'AME001', 'selling_price' => 20000, 'cost_price' => 9000, 'stock_quantity' => 35, 'minimum_stock' => 8, 'category_id' => $categories['Coffee']->id],
            ['name' => 'Cappuccino', 'sku' => 'CAP001', 'selling_price' => 25000, 'cost_price' => 11000, 'stock_quantity' => 28, 'minimum_stock' => 6, 'category_id' => $categories['Coffee']->id],
            ['name' => 'Latte', 'sku' => 'LAT001', 'selling_price' => 25000, 'cost_price' => 11000, 'stock_quantity' => 26, 'minimum_stock' => 6, 'category_id' => $categories['Coffee']->id],
            ['name' => 'Mocha', 'sku' => 'MOC001', 'selling_price' => 28000, 'cost_price' => 13000, 'stock_quantity' => 18, 'minimum_stock' => 5, 'category_id' => $categories['Coffee']->id],
            ['name' => 'Ice Tea', 'sku' => 'TEA001', 'selling_price' => 18000, 'cost_price' => 7000, 'stock_quantity' => 30, 'minimum_stock' => 8, 'category_id' => $categories['Tea']->id],
            ['name' => 'Lemonade', 'sku' => 'LEM001', 'selling_price' => 20000, 'cost_price' => 8500, 'stock_quantity' => 24, 'minimum_stock' => 6, 'category_id' => $categories['Tea']->id],
            ['name' => 'Croissant', 'sku' => 'CRO001', 'selling_price' => 22000, 'cost_price' => 10000, 'stock_quantity' => 20, 'minimum_stock' => 5, 'category_id' => $categories['Pastry']->id],
            ['name' => 'Blueberry Muffin', 'sku' => 'MUF001', 'selling_price' => 18000, 'cost_price' => 8000, 'stock_quantity' => 22, 'minimum_stock' => 5, 'category_id' => $categories['Pastry']->id],
            ['name' => 'Chocolate Cake Slice', 'sku' => 'CAK001', 'selling_price' => 25000, 'cost_price' => 12000, 'stock_quantity' => 16, 'minimum_stock' => 4, 'category_id' => $categories['Pastry']->id],
        ];

        foreach ($products as $product) {
            Product::query()->updateOrCreate(
                ['sku' => $product['sku']],
                $product + ['outlet_id' => $outlet->id, 'is_active' => true]
            );
        }
    }
}
