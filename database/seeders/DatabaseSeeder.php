<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = collect(Role::names())
            ->mapWithKeys(fn (string $name) => [
                $name => Role::query()->firstOrCreate(['name' => $name]),
            ]);

        User::query()->updateOrCreate(
            ['email' => 'owner@kasira.test'],
            [
                'name' => 'Kasira Owner',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role_id' => $roles[Role::OWNER]->id,
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'admin@kasira.test'],
            [
                'name' => 'Kasira Admin',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role_id' => $roles[Role::ADMIN]->id,
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'cashier@kasira.test'],
            [
                'name' => 'Kasira Cashier',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role_id' => $roles[Role::CASHIER]->id,
            ],
        );

        $products = [
            ['name' => 'Espresso', 'sku' => 'ESP001', 'selling_price' => 15000],
            ['name' => 'Americano', 'sku' => 'AME001', 'selling_price' => 20000],
            ['name' => 'Cappuccino', 'sku' => 'CAP001', 'selling_price' => 25000],
            ['name' => 'Latte', 'sku' => 'LAT001', 'selling_price' => 25000],
            ['name' => 'Mocha', 'sku' => 'MOC001', 'selling_price' => 28000],
            ['name' => 'Ice Tea', 'sku' => 'TEA001', 'selling_price' => 18000],
            ['name' => 'Lemonade', 'sku' => 'LEM001', 'selling_price' => 20000],
            ['name' => 'Croissant', 'sku' => 'CRO001', 'selling_price' => 22000],
            ['name' => 'Blueberry Muffin', 'sku' => 'MUF001', 'selling_price' => 18000],
            ['name' => 'Chocolate Cake Slice', 'sku' => 'CAK001', 'selling_price' => 25000],
        ];

        foreach ($products as $product) {
            Product::query()->updateOrCreate(
                ['sku' => $product['sku']],
                $product
            );
        }
    }
}
