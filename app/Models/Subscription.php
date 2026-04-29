<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    public const PLAN_STARTER = 'Starter';
    public const PLAN_PRO = 'Pro';
    public const PLAN_BUSINESS = 'Business';

    protected $fillable = [
        'plan',
        'status',
        'outlet_limit',
        'user_limit',
        'billing_email',
        'starts_at',
        'ends_at',
        'auto_renews',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'auto_renews' => 'boolean',
            'outlet_limit' => 'integer',
            'user_limit' => 'integer',
        ];
    }

    public static function current(): self
    {
        return self::query()->firstOrCreate(
            [],
            self::defaultsFor(self::PLAN_STARTER) + [
                'status' => 'active',
                'starts_at' => now(),
                'auto_renews' => true,
            ],
        );
    }

    public static function planOptions(): array
    {
        return [
            self::PLAN_STARTER,
            self::PLAN_PRO,
            self::PLAN_BUSINESS,
        ];
    }

    public static function defaultsFor(string $plan): array
    {
        return match ($plan) {
            self::PLAN_PRO => [
                'plan' => self::PLAN_PRO,
                'outlet_limit' => 3,
                'user_limit' => 15,
            ],
            self::PLAN_BUSINESS => [
                'plan' => self::PLAN_BUSINESS,
                'outlet_limit' => 10,
                'user_limit' => 50,
            ],
            default => [
                'plan' => self::PLAN_STARTER,
                'outlet_limit' => 1,
                'user_limit' => 5,
            ],
        };
    }

    public function syncPlanDefaults(string $plan): void
    {
        $this->fill(self::defaultsFor($plan));
    }

    public function allowsFeature(string $feature): bool
    {
        return in_array($feature, $this->features(), true);
    }

    public function features(): array
    {
        return match ($this->plan) {
            self::PLAN_PRO => [
                'exports',
                'cogs',
                'promotions',
                'vouchers',
                'cashier_shifts',
                'split_payments',
                'qris_integration',
                'thermal_printing',
            ],
            self::PLAN_BUSINESS => [
                'exports',
                'cogs',
                'profit_and_loss',
                'promotions',
                'vouchers',
                'cashier_shifts',
                'split_payments',
                'qris_integration',
                'thermal_printing',
                'connected_receipts',
                'offline_mode',
                'offline_draft_sync',
                'memberships',
            ],
            default => [],
        };
    }
}
