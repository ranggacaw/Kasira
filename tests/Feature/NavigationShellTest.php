<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NavigationShellTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_sees_grouped_back_office_navigation(): void
    {
        $owner = $this->createUserWithRole(Role::OWNER);

        $this->actingAs($owner)
            ->get('/settings')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Settings/Index')
                ->has('auth.user.navigationGroups', 8)
                ->where('auth.user.navigationGroups.0.label', 'Dashboard')
                ->where('auth.user.navigationGroups.2.items.1.label', 'Categories')
                ->where('auth.user.navigationGroups.5.items.0.label', 'Outlets & Staff')
                ->where('auth.user.navigationGroups.7.items.1.label', 'Checkout Defaults'));
    }

    public function test_cashier_only_sees_permitted_navigation_groups(): void
    {
        $cashier = $this->createUserWithRole(Role::CASHIER);

        $this->actingAs($cashier)
            ->get('/transactions')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Transactions/Index')
                ->has('auth.user.navigationGroups', 3)
                ->where('auth.user.navigationGroups.0.label', 'Dashboard')
                ->where('auth.user.navigationGroups.1.label', 'POS')
                ->where('auth.user.navigationGroups.2.label', 'Sales')
                ->where('auth.user.navigationGroups.2.items.0.label', 'Transactions'));
    }

    private function createUserWithRole(string $roleName): User
    {
        $role = Role::query()->firstOrCreate(['name' => $roleName]);

        return User::factory()->create([
            'role_id' => $role->id,
        ]);
    }
}
