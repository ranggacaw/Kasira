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
    public const METHOD_DEBIT_CARD = 'Debit Card';
    public const METHOD_CREDIT_CARD = 'Credit Card';
    public const METHOD_E_WALLET = 'E-Wallet';

    public static function methods(?AppSetting $settings = null): array
    {
        $available = [
            self::METHOD_CASH,
            self::METHOD_QRIS,
            self::METHOD_BANK_TRANSFER,
            self::METHOD_DEBIT_CARD,
            self::METHOD_CREDIT_CARD,
            self::METHOD_E_WALLET,
        ];

        if (! $settings?->enabled_payment_methods) {
            return $available;
        }

        return array_values(array_intersect($available, $settings->enabled_payment_methods));
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
