<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_name',
        'business_phone',
        'business_address',
        'logo_path',
        'currency',
        'timezone',
        'receipt_header',
        'receipt_footer',
        'show_cashier_on_receipt',
        'show_tax_breakdown_on_receipt',
        'enabled_payment_methods',
        'default_minimum_product_margin',
        'pwa_name',
        'pwa_short_name',
        'pwa_theme_color',
        'pwa_description',
    ];

    protected function casts(): array
    {
        return [
            'show_cashier_on_receipt' => 'boolean',
            'show_tax_breakdown_on_receipt' => 'boolean',
            'enabled_payment_methods' => 'array',
            'default_minimum_product_margin' => 'decimal:2',
        ];
    }

    public static function current(): self
    {
        return self::query()->firstOrCreate([], [
            'business_name' => 'Kasira POS',
            'currency' => 'IDR',
            'timezone' => 'Asia/Jakarta',
            'enabled_payment_methods' => [
                Payment::METHOD_CASH,
                Payment::METHOD_QRIS,
                Payment::METHOD_BANK_TRANSFER,
                Payment::METHOD_DEBIT_CARD,
                Payment::METHOD_CREDIT_CARD,
                Payment::METHOD_E_WALLET,
            ],
            'default_minimum_product_margin' => 20,
            'pwa_name' => 'Kasira POS',
            'pwa_short_name' => 'Kasira',
            'pwa_theme_color' => '#0f172a',
            'pwa_description' => 'Kasira business operations and POS workspace.',
        ]);
    }
}
