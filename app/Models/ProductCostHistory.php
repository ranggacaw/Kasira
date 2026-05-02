<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductCostHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'changed_by',
        'previous_cost_price',
        'new_cost_price',
        'change_reason',
    ];

    protected function casts(): array
    {
        return [
            'previous_cost_price' => 'decimal:2',
            'new_cost_price' => 'decimal:2',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
