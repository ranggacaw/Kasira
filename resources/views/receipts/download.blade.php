<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $transaction->invoice_number }}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f8fafc;
                color: #0f172a;
                margin: 0;
                padding: 32px;
            }

            .receipt {
                max-width: 720px;
                margin: 0 auto;
                background: #fff;
                border-radius: 24px;
                padding: 32px;
                box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
            }

            .row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }

            .muted {
                color: #64748b;
            }

            .item {
                border: 1px solid #e2e8f0;
                border-radius: 18px;
                padding: 16px;
                margin-top: 12px;
            }
        </style>
    </head>
    <body>
        <main class="receipt">
            <p class="muted">{{ $settings->business_name }}</p>
            <h1>{{ $transaction->invoice_number }}</h1>
            @if($settings->receipt_header)
                <p>{{ $settings->receipt_header }}</p>
            @endif

            <div class="row muted">
                <span>{{ $transaction->outlet?->name }}</span>
                <span>{{ optional($transaction->paid_at)->toDateTimeString() }}</span>
            </div>
            <div class="row muted">
                <span>Cashier</span>
                <span>{{ $transaction->cashier?->name }}</span>
            </div>

            @foreach($transaction->items as $item)
                <div class="item">
                    <div class="row">
                        <strong>{{ $item->product_name_snapshot ?: $item->product?->name }}</strong>
                        <strong>{{ number_format($item->subtotal_revenue_snapshot ?: $item->subtotal, 0, ',', '.') }}</strong>
                    </div>
                    <div class="row muted">
                        <span>{{ $item->quantity }} x {{ number_format($item->selling_price_snapshot ?: $item->unit_price, 0, ',', '.') }}</span>
                        <span></span>
                    </div>
                </div>
            @endforeach

            <div style="margin-top: 24px;">
                <div class="row"><span>Subtotal</span><span>{{ number_format($transaction->subtotal, 0, ',', '.') }}</span></div>
                <div class="row"><span>Discount</span><span>-{{ number_format($transaction->discount_amount, 0, ',', '.') }}</span></div>
                <div class="row"><span>Tax</span><span>{{ number_format($transaction->tax_amount, 0, ',', '.') }}</span></div>
                <div class="row"><span>Service fee</span><span>{{ number_format($transaction->service_fee_amount, 0, ',', '.') }}</span></div>
                <div class="row"><strong>Total</strong><strong>{{ number_format($transaction->total, 0, ',', '.') }}</strong></div>
                <div class="row muted"><span>Payment</span><span>{{ $transaction->payments->first()?->method }}</span></div>
            </div>

            @if($settings->receipt_footer)
                <p style="margin-top: 24px; text-align: center;" class="muted">{{ $settings->receipt_footer }}</p>
            @endif
        </main>
    </body>
</html>
