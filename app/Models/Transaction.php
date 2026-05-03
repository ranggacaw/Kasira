<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory;

    public const STATUS_COMPLETED = 'completed';
    public const STATUS_REFUNDED = 'refunded';
    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'invoice_number',
        'cashier_id',
        'outlet_id',
        'customer_id',
        'promotion_id',
        'voucher_id',
        'cashier_shift_id',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'service_fee_amount',
        'total',
        'status',
        'paid_amount',
        'paid_at',
        'refunded_at',
        'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'service_fee_amount' => 'decimal:2',
            'total' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'refunded_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class);
    }

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class);
    }

    public function cashierShift(): BelongsTo
    {
        return $this->belongsTo(CashierShift::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function receiptDeliveries(): HasMany
    {
        return $this->hasMany(ReceiptDelivery::class);
    }

    public static function generateInvoiceNumber(): string
    {
        $date = now()->format('Ymd');
        $lastTransaction = self::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastTransaction ? (int) substr($lastTransaction->invoice_number, -4) + 1 : 1;

        return sprintf('INV-%s-%04d', $date, $sequence);
    }
}
