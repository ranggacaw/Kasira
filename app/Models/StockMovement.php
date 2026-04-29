<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    use HasFactory;

    public const TYPE_IN = 'stock_in';
    public const TYPE_OUT = 'stock_out';
    public const TYPE_ADJUSTMENT = 'adjustment';
    public const TYPE_SALE = 'sale';
    public const TYPE_REFUND = 'refund';

    protected $fillable = [
        'product_id',
        'outlet_id',
        'user_id',
        'type',
        'quantity',
        'balance_after',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'balance_after' => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
