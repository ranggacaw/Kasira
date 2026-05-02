<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'product_id',
        'product_name_snapshot',
        'quantity',
        'unit_price',
        'unit_cost',
        'subtotal',
        'selling_price_snapshot',
        'cost_price_snapshot',
        'subtotal_revenue_snapshot',
        'subtotal_cost_snapshot',
        'gross_profit_snapshot',
        'gross_margin_snapshot',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'unit_cost' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'selling_price_snapshot' => 'decimal:2',
            'cost_price_snapshot' => 'decimal:2',
            'subtotal_revenue_snapshot' => 'decimal:2',
            'subtotal_cost_snapshot' => 'decimal:2',
            'gross_profit_snapshot' => 'decimal:2',
            'gross_margin_snapshot' => 'decimal:2',
        ];
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
