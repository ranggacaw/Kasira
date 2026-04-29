<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReceiptDelivery extends Model
{
    use HasFactory;

    public const CHANNEL_PRINT = 'print';
    public const CHANNEL_EMAIL = 'email';
    public const CHANNEL_WHATSAPP = 'whatsapp';

    protected $fillable = [
        'transaction_id',
        'channel',
        'recipient',
        'status',
        'delivered_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'delivered_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public static function channels(): array
    {
        return [
            self::CHANNEL_PRINT,
            self::CHANNEL_EMAIL,
            self::CHANNEL_WHATSAPP,
        ];
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
