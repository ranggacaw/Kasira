<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (Product $product): void {
            $product->outlet_id ??= Outlet::query()->where('is_primary', true)->value('id')
                ?? Outlet::query()->value('id');
            $product->stock_quantity ??= 100;
            $product->minimum_stock ??= 0;
            $product->cost_price ??= 0;
            $product->is_active ??= true;
        });
    }

    protected $fillable = [
        'outlet_id',
        'category_id',
        'name',
        'sku',
        'barcode',
        'selling_price',
        'cost_price',
        'stock_quantity',
        'minimum_stock',
        'image_path',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'selling_price' => 'decimal:2',
            'cost_price' => 'decimal:2',
            'stock_quantity' => 'integer',
            'minimum_stock' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function transactionItems(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }
}
