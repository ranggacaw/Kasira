<?php

namespace Database\Seeders;

use App\Models\Outlet;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StaffAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $roles = collect(Role::names())
            ->mapWithKeys(fn (string $name) => [
                $name => Role::query()->firstOrCreate(['name' => $name]),
            ]);

        $outlet = Outlet::query()->firstOrCreate(
            ['code' => 'MAIN'],
            [
                'name' => 'Main Outlet',
                'is_active' => true,
                'is_primary' => true,
            ],
        );

        $subscription = Subscription::current();
        $subscription->billing_email = 'owner@kasira.test';
        $subscription->save();

        $users = [
            [
                'email' => 'owner@kasira.test',
                'name' => 'Kasira Owner',
                'role' => Role::OWNER,
            ],
            [
                'email' => 'admin@kasira.test',
                'name' => 'Kasira Admin',
                'role' => Role::ADMIN,
            ],
            [
                'email' => 'manager@kasira.test',
                'name' => 'Kasira Manager',
                'role' => Role::MANAGER,
            ],
            [
                'email' => 'cashier@kasira.test',
                'name' => 'Kasira Cashier',
                'role' => Role::CASHIER,
            ],
        ];

        foreach ($users as $user) {
            User::query()->updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'is_active' => true,
                    'role_id' => $roles[$user['role']]->id,
                    'outlet_id' => $outlet->id,
                ],
            );
        }
    }
}
