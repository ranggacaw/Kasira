<?php

namespace Database\Seeders;

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
    }
}
