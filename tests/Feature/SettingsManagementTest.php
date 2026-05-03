<?php

namespace Tests\Feature;

use App\Models\AppSetting;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SettingsManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_settings_tax_default_prefills_new_pos_sales(): void
    {
        $owner = $this->createUserWithRole(Role::OWNER);
        $cashier = $this->createUserWithRole(Role::CASHIER);

        $this->actingAs($owner)
            ->patch('/settings/checkout-defaults', [
                'default_checkout_tax_rate' => 10.5,
            ])
            ->assertRedirect();

        $this->assertSame('10.50', AppSetting::current()->default_checkout_tax_rate);

        $this->actingAs($cashier)
            ->get('/pos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Pos/Checkout')
                ->where('defaultTaxRate', 10.5));
    }

    private function createUserWithRole(string $roleName): User
    {
        $role = Role::query()->firstOrCreate(['name' => $roleName]);

        return User::factory()->create([
            'role_id' => $role->id,
        ]);
    }
}
