<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    public const METHOD_CASH = 'Cash';
    public const METHOD_QRIS = 'QRIS';
    public const METHOD_BANK_TRANSFER = 'Bank Transfer';

    public static function methods(): array
    {
        return [
            self::METHOD_CASH,
            self::METHOD_QRIS,
            self::METHOD_BANK_TRANSFER,
        ];
    }

    protected $fillable = [
        'transaction_id',
        'method',
        'amount',
        'reference',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}