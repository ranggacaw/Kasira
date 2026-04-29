<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\ResolvesOutletContext;
use App\Models\AppSetting;
use App\Models\CashierShift;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\PosDraftOrder;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\ReceiptDelivery;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    use ResolvesOutletContext;

    public function index(Request $request): Response
    {
        abort_unless($request->user()->canUseCheckout(), 403);

        $subscription = Subscription::current();
        $canSendDigitalReceipts = $subscription->allowsFeature('connected_receipts');
        $settings = AppSetting::current();
        $outlets = $this->availableOutletsFor($request->user());
        $currentOutlet = $this->resolveCurrentOutlet($request);

        $products = Product::query()
            ->with(['category:id,name,color', 'unit:id,name,short_name'])
            ->where('is_active', true)
            ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
            ->orderBy('name')
            ->get();

        $currentShift = $subscription->allowsFeature('cashier_shifts')
            ? CashierShift::query()
                ->where('user_id', $request->user()->id)
                ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
                ->where('status', 'open')
                ->latest('opened_at')
                ->first()
            : null;

        return Inertia::render('Pos/Checkout', [
            'products' => $products,
            'paymentMethods' => Payment::methods($settings),
            'outlets' => $outlets,
            'selectedOutletId' => $currentOutlet?->id,
            'categories' => $products
                ->pluck('category')
                ->filter()
                ->unique('id')
                ->sortBy('name')
                ->values(),
            'customers' => Customer::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'membership_tier', 'membership_discount_rate']),
            'promotions' => $subscription->allowsFeature('promotions')
                ? Promotion::query()
                    ->where('is_active', true)
                    ->when($currentOutlet, fn ($query) => $query->where(fn ($nested) => $nested->whereNull('outlet_id')->orWhere('outlet_id', $currentOutlet->id)))
                    ->orderBy('name')
                    ->get(['id', 'name', 'type', 'value', 'minimum_spend'])
                : [],
            'receiptChannels' => collect(ReceiptDelivery::channels())
                ->filter(fn (string $channel) => $channel === ReceiptDelivery::CHANNEL_PRINT || $canSendDigitalReceipts)
                ->values()
                ->all(),
            'features' => [
                'promotions' => $subscription->allowsFeature('promotions'),
                'vouchers' => $subscription->allowsFeature('vouchers'),
                'memberships' => $subscription->allowsFeature('memberships'),
                'connectedReceipts' => $subscription->allowsFeature('connected_receipts'),
                'cashierShifts' => $subscription->allowsFeature('cashier_shifts'),
                'splitPayment' => $subscription->allowsFeature('split_payments'),
                'qrisIntegration' => $subscription->allowsFeature('qris_integration'),
                'offlineMode' => $subscription->allowsFeature('offline_mode'),
                'offlineDraftSync' => $subscription->allowsFeature('offline_draft_sync'),
                'thermalPrinting' => $subscription->allowsFeature('thermal_printing'),
            ],
            'currentShift' => $currentShift,
            'draftOrders' => PosDraftOrder::query()
                ->with('customer:id,name')
                ->where('user_id', $request->user()->id)
                ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
                ->latest()
                ->get(),
            'receiptSettings' => [
                'header' => $settings->receipt_header,
                'footer' => $settings->receipt_footer,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'outlet_id' => 'nullable|integer|exists:outlets,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'customer_id' => 'nullable|integer|exists:customers,id',
            'promotion_id' => 'nullable|integer|exists:promotions,id',
            'voucher_code' => 'nullable|string|max:100',
            'discount_type' => ['required', Rule::in(['percentage', 'fixed'])],
            'discount_value' => 'required|numeric|min:0',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'service_fee_rate' => 'required|numeric|min:0|max:100',
            'payment_method' => ['required', Rule::in(Payment::methods())],
            'payment_reference' => 'nullable|string|max:255',
            'paid_amount' => 'nullable|numeric|min:0',
            'receipt_channel' => ['nullable', Rule::in(ReceiptDelivery::channels())],
            'receipt_recipient' => 'nullable|string|max:255',
            'draft_order_id' => 'nullable|integer|exists:pos_draft_orders,id',
        ]);

        $subscription = Subscription::current();
        $settings = AppSetting::current();

        $validated['payment_method'] = (string) $validated['payment_method'];

        if (! in_array($validated['payment_method'], Payment::methods($settings), true)) {
            throw ValidationException::withMessages([
                'payment_method' => 'The selected payment method is not enabled in settings.',
            ]);
        }

        if ($validated['discount_type'] === 'percentage' && $validated['discount_value'] > 100) {
            throw ValidationException::withMessages([
                'discount_value' => 'Percentage discounts may not exceed 100%.',
            ]);
        }

        $validated['outlet_id'] = (int) ($validated['outlet_id']
            ?? $request->user()->outlet_id
            ?? $this->resolveCurrentOutlet($request)?->id);

        if (! $validated['outlet_id']) {
            throw ValidationException::withMessages([
                'outlet_id' => 'An outlet is required before checkout can continue.',
            ]);
        }

        if (
            in_array($validated['receipt_channel'] ?? null, [ReceiptDelivery::CHANNEL_EMAIL, ReceiptDelivery::CHANNEL_WHATSAPP], true)
            && blank($validated['receipt_recipient'] ?? null)
        ) {
            throw ValidationException::withMessages([
                'receipt_recipient' => 'A recipient is required for digital receipts.',
            ]);
        }

        if (
            in_array($validated['receipt_channel'] ?? null, [ReceiptDelivery::CHANNEL_EMAIL, ReceiptDelivery::CHANNEL_WHATSAPP], true)
            && ! $subscription->allowsFeature('connected_receipts')
        ) {
            abort(403, 'Connected receipt delivery requires the Business plan.');
        }

        $products = Product::query()
            ->where('is_active', true)
            ->where('outlet_id', $validated['outlet_id'])
            ->whereIn('id', collect($validated['items'])->pluck('product_id'))
            ->get()
            ->keyBy('id');

        $items = collect($validated['items'])->map(function (array $item) use ($products): array {
            $product = $products->get($item['product_id']);

            if (! $product) {
                throw ValidationException::withMessages([
                    'items' => 'One or more selected products are unavailable.',
                ]);
            }

            if ($product->track_stock && $item['quantity'] > $product->stock_quantity) {
                throw ValidationException::withMessages([
                    'items' => "Insufficient stock for {$product->name}.",
                ]);
            }

            $unitPrice = round((float) $product->selling_price, 2);
            $subtotal = round($unitPrice * $item['quantity'], 2);

            return [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'unit_cost' => round((float) $product->cost_price, 2),
                'subtotal' => $subtotal,
            ];
        });

        $subtotal = round($items->sum('subtotal'), 2);
        $manualDiscountAmount = $validated['discount_type'] === 'percentage'
            ? round($subtotal * ($validated['discount_value'] / 100), 2)
            : round(min($validated['discount_value'], $subtotal), 2);

        $discountedSubtotal = max($subtotal - $manualDiscountAmount, 0);
        $customer = isset($validated['customer_id'])
            ? Customer::query()->where('is_active', true)->find($validated['customer_id'])
            : null;

        $promotion = null;
        $promotionDiscountAmount = 0;

        if (! empty($validated['promotion_id'])) {
            abort_unless($subscription->allowsFeature('promotions'), 403);

            $promotion = Promotion::query()
                ->whereKey($validated['promotion_id'])
                ->where('is_active', true)
                ->where(fn ($query) => $query->whereNull('outlet_id')->orWhere('outlet_id', $validated['outlet_id']))
                ->first();

            if (! $promotion || ($promotion->starts_at && $promotion->starts_at->isFuture()) || ($promotion->ends_at && $promotion->ends_at->isPast())) {
                throw ValidationException::withMessages([
                    'promotion_id' => 'The selected promotion is not currently available.',
                ]);
            }

            if ($discountedSubtotal < (float) $promotion->minimum_spend) {
                throw ValidationException::withMessages([
                    'promotion_id' => 'The selected promotion requires a higher subtotal.',
                ]);
            }

            $promotionDiscountAmount = $this->resolveReductionAmount($discountedSubtotal, $promotion->type, (float) $promotion->value);
            $discountedSubtotal = max($discountedSubtotal - $promotionDiscountAmount, 0);
        }

        $voucher = null;
        $voucherDiscountAmount = 0;

        if (! empty($validated['voucher_code'])) {
            abort_unless($subscription->allowsFeature('vouchers'), 403);

            $voucher = Voucher::query()
                ->where('code', $validated['voucher_code'])
                ->where('is_active', true)
                ->where(fn ($query) => $query->whereNull('outlet_id')->orWhere('outlet_id', $validated['outlet_id']))
                ->first();

            if (
                ! $voucher
                || ($voucher->starts_at && $voucher->starts_at->isFuture())
                || ($voucher->ends_at && $voucher->ends_at->isPast())
                || ($voucher->max_uses !== null && $voucher->used_count >= $voucher->max_uses)
            ) {
                throw ValidationException::withMessages([
                    'voucher_code' => 'The voucher code is not available.',
                ]);
            }

            if ($discountedSubtotal < (float) $voucher->minimum_spend) {
                throw ValidationException::withMessages([
                    'voucher_code' => 'The voucher requires a higher subtotal.',
                ]);
            }

            $voucherDiscountAmount = $this->resolveReductionAmount($discountedSubtotal, $voucher->type, (float) $voucher->value);
            $discountedSubtotal = max($discountedSubtotal - $voucherDiscountAmount, 0);
        }

        $membershipDiscountAmount = 0;

        if ($customer && $subscription->allowsFeature('memberships') && (float) $customer->membership_discount_rate > 0) {
            $membershipDiscountAmount = round($discountedSubtotal * ((float) $customer->membership_discount_rate / 100), 2);
            $discountedSubtotal = max($discountedSubtotal - $membershipDiscountAmount, 0);
        }

        $discountAmount = round(
            $manualDiscountAmount + $promotionDiscountAmount + $voucherDiscountAmount + $membershipDiscountAmount,
            2,
        );
        $taxAmount = round($discountedSubtotal * ($validated['tax_rate'] / 100), 2);
        $serviceFeeAmount = round($discountedSubtotal * ($validated['service_fee_rate'] / 100), 2);
        $total = round($discountedSubtotal + $taxAmount + $serviceFeeAmount, 2);
        $paidAmount = $validated['paid_amount'] ?? $total;

        if ($validated['payment_method'] === Payment::METHOD_CASH && $paidAmount < $total) {
            throw ValidationException::withMessages([
                'paid_amount' => 'Cash payments must cover the full total.',
            ]);
        }

        $cashierShift = $subscription->allowsFeature('cashier_shifts')
            ? CashierShift::query()
                ->where('user_id', $request->user()->id)
                ->where('outlet_id', $validated['outlet_id'])
                ->where('status', 'open')
                ->latest('opened_at')
                ->first()
            : null;

        $transaction = DB::transaction(function () use (
            $request,
            $items,
            $subtotal,
            $discountAmount,
            $taxAmount,
            $serviceFeeAmount,
            $total,
            $paidAmount,
            $validated,
            $customer,
            $promotion,
            $voucher,
            $cashierShift,
            $products,
        ) {
            $transaction = Transaction::create([
                'invoice_number' => Transaction::generateInvoiceNumber(),
                'cashier_id' => $request->user()->id,
                'outlet_id' => $validated['outlet_id'],
                'customer_id' => $customer?->id,
                'promotion_id' => $promotion?->id,
                'voucher_id' => $voucher?->id,
                'cashier_shift_id' => $cashierShift?->id,
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'tax_amount' => $taxAmount,
                'service_fee_amount' => $serviceFeeAmount,
                'total' => $total,
                'status' => Transaction::STATUS_COMPLETED,
                'paid_amount' => $paidAmount,
                'paid_at' => now(),
            ]);

            foreach ($items as $item) {
                $transaction->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'unit_cost' => $item['unit_cost'],
                    'subtotal' => $item['subtotal'],
                ]);

                $product = $products->get($item['product_id']);
                $remainingStock = $product->stock_quantity - $item['quantity'];

                $product->update([
                    'stock_quantity' => $product->track_stock ? $remainingStock : $product->stock_quantity,
                ]);

                if ($product->track_stock) {
                    $product->stockMovements()->create([
                        'outlet_id' => $product->outlet_id,
                        'user_id' => $request->user()->id,
                        'type' => 'sale',
                        'quantity' => $item['quantity'],
                        'balance_after' => $remainingStock,
                        'notes' => "Sold via {$transaction->invoice_number}.",
                    ]);
                }
            }

            $transaction->payments()->create([
                'method' => $validated['payment_method'],
                'amount' => $paidAmount,
                'reference' => $validated['payment_reference'] ?? null,
            ]);

            if ($voucher) {
                $voucher->increment('used_count');
            }

            if (! empty($validated['receipt_channel'])) {
                $transaction->receiptDeliveries()->create([
                    'channel' => $validated['receipt_channel'],
                    'recipient' => $validated['receipt_recipient'] ?? null,
                    'status' => $validated['receipt_channel'] === ReceiptDelivery::CHANNEL_PRINT ? 'logged' : 'queued',
                    'delivered_at' => $validated['receipt_channel'] === ReceiptDelivery::CHANNEL_PRINT ? now() : null,
                    'metadata' => [
                        'source' => 'checkout',
                    ],
                ]);
            }

            if (! empty($validated['draft_order_id'])) {
                PosDraftOrder::query()
                    ->whereKey($validated['draft_order_id'])
                    ->where('user_id', $request->user()->id)
                    ->delete();
            }

            return $transaction;
        });

        return redirect()->route('pos.success', $transaction);
    }

    public function success(Request $request, Transaction $transaction): Response
    {
        abort_unless($request->user()->canUseCheckout(), 403);

        $subscription = Subscription::current();

        $transaction->load([
            'cashier:id,name',
            'outlet:id,name,address',
            'items.product:id,name',
            'payments',
            'receiptDeliveries',
        ]);

        return Inertia::render('Pos/Success', [
            'transaction' => $transaction,
            'receiptChannels' => collect(ReceiptDelivery::channels())
                ->filter(fn (string $channel) => $channel === ReceiptDelivery::CHANNEL_PRINT || $subscription->allowsFeature('connected_receipts'))
                ->values()
                ->all(),
            'receiptSettings' => [
                'header' => AppSetting::current()->receipt_header,
                'footer' => AppSetting::current()->receipt_footer,
            ],
            'canSendDigitalReceipts' => $subscription->allowsFeature('connected_receipts'),
            'canUseThermalPrinting' => $subscription->allowsFeature('thermal_printing'),
        ]);
    }

    public function storeDraft(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canUseCheckout(), 403);

        $validated = $request->validate([
            'outlet_id' => ['required', 'exists:outlets,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'name' => ['required', 'string', 'max:255'],
            'cart' => ['required', 'array', 'min:1'],
            'adjustments' => ['nullable', 'array'],
        ]);

        PosDraftOrder::query()->create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Draft order saved.');
    }

    public function destroyDraft(Request $request, PosDraftOrder $draftOrder): RedirectResponse
    {
        abort_unless($request->user()->canUseCheckout(), 403);
        abort_unless($draftOrder->user_id === $request->user()->id, 403);

        $draftOrder->delete();

        return back()->with('success', 'Draft order removed.');
    }

    protected function resolveReductionAmount(float $amount, string $type, float $value): float
    {
        $reduction = $type === 'percentage'
            ? round($amount * ($value / 100), 2)
            : round($value, 2);

        return round(min($reduction, $amount), 2);
    }
}
