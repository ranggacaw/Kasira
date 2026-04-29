<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesOutletContext;
use App\Models\Payment;
use App\Models\ReceiptDelivery;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        ]);

        $transactions = Transaction::query()
            ->with(['cashier:id,name', 'outlet:id,name', 'customer:id,name', 'payments:id,transaction_id,method,amount'])
            ->when($filters['date_from'] ?? null, fn ($query, $value) => $query->whereDate('paid_at', '>=', $value))
            ->when($filters['date_to'] ?? null, fn ($query, $value) => $query->whereDate('paid_at', '<=', $value))
            ->when($filters['cashier_id'] ?? null, fn ($query, $value) => $query->where('cashier_id', $value))
            ->when($filters['outlet_id'] ?? null, fn ($query, $value) => $query->where('outlet_id', $value))
            ->when($filters['payment_method'] ?? null, fn ($query, $value) => $query->whereHas('payments', fn ($paymentQuery) => $paymentQuery->where('method', $value)))
            ->latest('paid_at')
            ->limit(50)
            ->get();

        return Inertia::render('Transactions/Index', [
            'filters' => $filters,
            'transactions' => $transactions,
            'outlets' => $this->availableOutletsFor($request->user()),
            'cashiers' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'paymentMethods' => Payment::methods(),
        ]);
    }

    public function show(Request $request, Transaction $transaction): Response
    {
        abort_unless($request->user()->canViewTransactions(), 403);

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
            'canSendDigitalReceipts' => Subscription::current()->allowsFeature('connected_receipts'),
            'receiptChannels' => ReceiptDelivery::channels(),
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
}
