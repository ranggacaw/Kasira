<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CashierShift extends Model
{
    use HasFactory;

    protected $fillable = [
        'outlet_id',
        'user_id',
        'opening_balance',
        'closing_balance',
        'expected_cash',
        'cash_difference',
        'sales_summary',
        'opened_at',
        'closed_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'opening_balance' => 'decimal:2',
            'closing_balance' => 'decimal:2',
            'expected_cash' => 'decimal:2',
            'cash_difference' => 'decimal:2',
            'sales_summary' => 'array',
            'opened_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
