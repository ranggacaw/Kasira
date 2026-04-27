<?php

namespace Tests\Feature;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_creates_roles_and_demo_users(): void
    {
        $this->seed();

        foreach (Role::names() as $role) {
            $this->assertDatabaseHas('roles', ['name' => $role]);
        }

        $this->assertDatabaseHas('users', ['email' => 'owner@kasira.test']);
        $this->assertDatabaseHas('users', ['email' => 'admin@kasira.test']);
        $this->assertDatabaseHas('users', ['email' => 'cashier@kasira.test']);
    }
}
