<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
        'role_id',
        'outlet_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function hasRole(string|array $roles): bool
    {
        $roles = is_array($roles) ? $roles : [$roles];

        return in_array($this->role?->name, $roles, true);
    }

    public function canManageCatalog(): bool
    {
        return $this->is_active && $this->hasRole([Role::OWNER, Role::ADMIN, Role::MANAGER]);
    }

    public function canUseCheckout(): bool
    {
        return $this->is_active && $this->hasRole(Role::names());
    }

    public function canViewDashboard(): bool
    {
        return $this->is_active && $this->hasRole(Role::names());
    }

    public function canViewTransactions(): bool
    {
        return $this->is_active && $this->hasRole(Role::names());
    }

    public function canManageOperations(): bool
    {
        return $this->is_active && $this->hasRole([Role::OWNER, Role::ADMIN]);
    }

    public function canManageCustomers(): bool
    {
        return $this->is_active && $this->hasRole([Role::OWNER, Role::ADMIN, Role::MANAGER]);
    }

    public function canViewReports(): bool
    {
        return $this->is_active && $this->hasRole([Role::OWNER, Role::ADMIN, Role::MANAGER]);
    }

    public function canManagePremium(): bool
    {
        return $this->is_active && $this->hasRole([Role::OWNER, Role::ADMIN]);
    }

    public function canManageSettings(): bool
    {
        return $this->is_active && $this->hasRole([Role::OWNER, Role::ADMIN]);
    }
}
