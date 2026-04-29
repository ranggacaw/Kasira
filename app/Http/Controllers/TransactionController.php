<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesOutletContext;
use App\Models\AppSetting;
use App\Models\Payment;
use App\Models\PosDraftOrder;
use App\Models\ReceiptDelivery;
use App\Models\StockMovement;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response as ResponseFactory;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    use ResolvesOutletContext;

    public function index(Request $request): Response
    {
        abort_unless($request->user()->canViewTransactions(), 403);

        $filters = $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
            'cashier_id' => ['nullable', 'exists:users,id'],
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'payment_method' => ['nullable', Rule::in(Payment::methods())],
            'status' => ['nullable', Rule::in([Transaction::STATUS_COMPLETED, Transaction::STATUS_REFUNDED])],
        ]);

        $currentOutlet = $this->resolveCurrentOutlet($request);

        $filters['outlet_id'] ??= $currentOutlet?->id;

        $transactions = Transaction::query()
            ->with(['cashier:id,name', 'outlet:id,name', 'customer:id,name', 'payments:id,transaction_id,method,amount'])
            ->when($filters['date_from'] ?? null, fn ($query, $value) => $query->whereDate('paid_at', '>=', $value))
            ->when($filters['date_to'] ?? null, fn ($query, $value) => $query->whereDate('paid_at', '<=', $value))
            ->when($filters['cashier_id'] ?? null, fn ($query, $value) => $query->where('cashier_id', $value))
            ->when($filters['outlet_id'] ?? null, fn ($query, $value) => $query->where('outlet_id', $value))
            ->when($filters['payment_method'] ?? null, fn ($query, $value) => $query->whereHas('payments', fn ($paymentQuery) => $paymentQuery->where('method', $value)))
            ->when($filters['status'] ?? null, fn ($query, $value) => $query->where('status', $value))
            ->latest('paid_at')
            ->limit(50)
            ->get();

        return Inertia::render('Transactions/Index', [
            'filters' => $filters,
            'transactions' => $transactions,
            'outlets' => $this->availableOutletsFor($request->user()),
            'cashiers' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'paymentMethods' => Payment::methods(),
            'draftOrders' => PosDraftOrder::query()
                ->with(['outlet:id,name', 'customer:id,name'])
                ->when($filters['outlet_id'] ?? null, fn ($query, $value) => $query->where('outlet_id', $value))
                ->latest()
                ->limit(12)
                ->get(),
        ]);
    }

    public function show(Request $request, Transaction $transaction): Response
    {
        abort_unless($request->user()->canViewTransactions(), 403);

        $subscription = Subscription::current();

        $transaction->load([
            'cashier:id,name',
            'outlet:id,name',
            'customer:id,name,email,phone,membership_tier',
            'promotion:id,name',
            'voucher:id,code',
            'items.product:id,name,sku',
            'payments',
            'receiptDeliveries',
        ]);

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
            'canSendDigitalReceipts' => $subscription->allowsFeature('connected_receipts'),
            'receiptChannels' => collect(ReceiptDelivery::channels())
                ->filter(fn (string $channel) => $channel === ReceiptDelivery::CHANNEL_PRINT || $subscription->allowsFeature('connected_receipts'))
                ->values()
                ->all(),
            'receiptSettings' => AppSetting::current(),
            'canRefund' => $transaction->status !== Transaction::STATUS_REFUNDED,
            'canUseThermalPrinting' => $subscription->allowsFeature('thermal_printing'),
        ]);
    }

    public function queueReceipt(Request $request, Transaction $transaction): RedirectResponse
    {
        abort_unless($request->user()->canViewTransactions(), 403);

        $validated = $request->validate([
            'channel' => ['required', Rule::in(ReceiptDelivery::channels())],
            'recipient' => ['nullable', 'string', 'max:255'],
        ]);

        $subscription = Subscription::current();

        if ($validated['channel'] !== ReceiptDelivery::CHANNEL_PRINT && ! $subscription->allowsFeature('connected_receipts')) {
            abort(403, 'Connected receipt delivery requires the Business plan.');
        }

        ReceiptDelivery::query()->create([
            'transaction_id' => $transaction->id,
            'channel' => $validated['channel'],
            'recipient' => $validated['recipient'] ?? null,
            'status' => $validated['channel'] === ReceiptDelivery::CHANNEL_PRINT ? 'logged' : 'queued',
            'delivered_at' => $validated['channel'] === ReceiptDelivery::CHANNEL_PRINT ? now() : null,
            'metadata' => [
                'queued_by' => $request->user()->id,
            ],
        ]);

        return back()->with('success', 'Receipt action logged.');
    }

    public function downloadReceipt(Request $request, Transaction $transaction)
    {
        abort_unless($request->user()->canViewTransactions(), 403);

        $transaction->load(['cashier:id,name', 'outlet:id,name,address', 'items.product:id,name', 'payments']);
        $settings = AppSetting::current();

        $content = view('receipts.download', [
            'transaction' => $transaction,
            'settings' => $settings,
        ])->render();

        return ResponseFactory::make($content, 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$transaction->invoice_number.'.html"',
        ]);
    }

    public function refund(Request $request, Transaction $transaction): RedirectResponse
    {
        abort_unless($request->user()->canViewTransactions(), 403);

        if ($transaction->status === Transaction::STATUS_REFUNDED) {
            return back()->with('success', 'Transaction already refunded.');
        }

        $transaction->load('items.product');

        DB::transaction(function () use ($request, $transaction): void {
            foreach ($transaction->items as $item) {
                $product = $item->product;

                if (! $product || ! $product->track_stock) {
                    continue;
                }

                $balanceAfter = $product->stock_quantity + $item->quantity;

                $product->update([
                    'stock_quantity' => $balanceAfter,
                ]);

                $product->stockMovements()->create([
                    'outlet_id' => $transaction->outlet_id,
                    'user_id' => $request->user()->id,
                    'type' => StockMovement::TYPE_REFUND,
                    'quantity' => $item->quantity,
                    'balance_after' => $balanceAfter,
                    'notes' => "Refunded from {$transaction->invoice_number}.",
                ]);
            }

            $transaction->update([
                'status' => Transaction::STATUS_REFUNDED,
                'refunded_at' => now(),
            ]);
        });

        return back()->with('success', 'Refund workflow completed.');
    }
}
