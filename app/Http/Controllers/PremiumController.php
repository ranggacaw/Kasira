<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesOutletContext;
use App\Models\CashierShift;
use App\Models\Product;
use App\Models\Outlet;
use App\Models\Payment;
use App\Models\Promotion;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response as ResponseFactory;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PremiumController extends Controller
{
    use ResolvesOutletContext;

    public function index(Request $request): Response
    {
        abort_unless($request->user()->canViewReports(), 403);

        $subscription = Subscription::current();
        $currentOutlet = $this->resolveCurrentOutlet($request);
        $dateFrom = $request->date('date_from') ?? now()->subDays(29)->startOfDay();
        $dateTo = $request->date('date_to') ?? now()->endOfDay();

        $transactionQuery = Transaction::query()
            ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
            ->whereBetween('paid_at', [$dateFrom, $dateTo]);

        $revenue = (clone $transactionQuery)->sum('total');

        $cogs = TransactionItem::query()
            ->join('transactions', 'transactions.id', '=', 'transaction_items.transaction_id')
            ->when($currentOutlet, fn ($query) => $query->where('transactions.outlet_id', $currentOutlet->id))
            ->whereBetween('transactions.paid_at', [$dateFrom, $dateTo])
            ->selectRaw('COALESCE(SUM(transaction_items.quantity * transaction_items.unit_cost), 0) as total_cogs')
            ->value('total_cogs');

        return Inertia::render('Premium/Index', [
            'subscription' => $subscription,
            'features' => $subscription->features(),
            'usage' => [
                'activeUsers' => User::query()->where('is_active', true)->count(),
                'activeOutlets' => Outlet::query()->where('is_active', true)->count(),
            ],
            'outlets' => $this->availableOutletsFor($request->user()),
            'selectedOutletId' => $currentOutlet?->id,
            'filters' => [
                'date_from' => $dateFrom->toDateString(),
                'date_to' => $dateTo->toDateString(),
            ],
            'profitability' => [
                'revenue' => (float) $revenue,
                'cogs' => (float) $cogs,
                'profit' => (float) $revenue - (float) $cogs,
            ],
            'paymentBreakdown' => Payment::query()
                ->selectRaw('method, SUM(amount) as total_amount, COUNT(*) as transaction_count')
                ->join('transactions', 'transactions.id', '=', 'payments.transaction_id')
                ->when($currentOutlet, fn ($query) => $query->where('transactions.outlet_id', $currentOutlet->id))
                ->whereBetween('transactions.paid_at', [$dateFrom, $dateTo])
                ->groupBy('method')
                ->orderByDesc('total_amount')
                ->get(),
            'cashierPerformance' => Transaction::query()
                ->selectRaw('users.id, users.name, COUNT(transactions.id) as transaction_count, SUM(transactions.total) as revenue')
                ->join('users', 'users.id', '=', 'transactions.cashier_id')
                ->when($currentOutlet, fn ($query) => $query->where('transactions.outlet_id', $currentOutlet->id))
                ->whereBetween('transactions.paid_at', [$dateFrom, $dateTo])
                ->groupBy('users.id', 'users.name')
                ->orderByDesc('revenue')
                ->limit(5)
                ->get(),
            'topProducts' => TransactionItem::query()
                ->selectRaw('products.id, products.name, SUM(transaction_items.quantity) as quantity_sold, SUM(transaction_items.subtotal) as revenue')
                ->join('transactions', 'transactions.id', '=', 'transaction_items.transaction_id')
                ->join('products', 'products.id', '=', 'transaction_items.product_id')
                ->when($currentOutlet, fn ($query) => $query->where('transactions.outlet_id', $currentOutlet->id))
                ->whereBetween('transactions.paid_at', [$dateFrom, $dateTo])
                ->groupBy('products.id', 'products.name')
                ->orderByDesc('revenue')
                ->limit(5)
                ->get(),
            'lowStockAlerts' => Product::query()
                ->with(['outlet:id,name'])
                ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
                ->where('track_stock', true)
                ->where('minimum_stock', '>', 0)
                ->whereColumn('stock_quantity', '<', 'minimum_stock')
                ->orderBy('stock_quantity')
                ->limit(5)
                ->get(),
            'recentPromotions' => Promotion::query()->with('outlet:id,name')->latest()->limit(5)->get(),
            'recentVouchers' => Voucher::query()->with('outlet:id,name')->latest()->limit(5)->get(),
            'recentShifts' => CashierShift::query()->with(['user:id,name', 'outlet:id,name'])->latest('opened_at')->limit(5)->get(),
            'canManagePremium' => $request->user()->canManagePremium(),
        ]);
    }

    public function exportReport(Request $request)
    {
        abort_unless($request->user()->canViewReports(), 403);
        abort_unless(Subscription::current()->allowsFeature('exports'), 403);

        $currentOutlet = $this->resolveCurrentOutlet($request);

        $transactions = Transaction::query()
            ->with(['cashier:id,name', 'outlet:id,name', 'payments:id,transaction_id,method'])
            ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
            ->latest('paid_at')
            ->get();

        $rows = [
            ['Invoice', 'Paid At', 'Outlet', 'Cashier', 'Payment Method', 'Subtotal', 'Discount', 'Tax', 'Service Fee', 'Total'],
        ];

        foreach ($transactions as $transaction) {
            $rows[] = [
                $transaction->invoice_number,
                optional($transaction->paid_at)->toDateTimeString(),
                $transaction->outlet?->name,
                $transaction->cashier?->name,
                $transaction->payments->first()?->method,
                $transaction->subtotal,
                $transaction->discount_amount,
                $transaction->tax_amount,
                $transaction->service_fee_amount,
                $transaction->total,
            ];
        }

        $csv = collect($rows)
            ->map(fn (array $row) => collect($row)
                ->map(fn ($value) => '"'.str_replace('"', '""', (string) $value).'"')
                ->implode(','))
            ->implode("\n");

        return ResponseFactory::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="kasira-report.csv"',
        ]);
    }

    public function storePromotion(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManagePremium(), 403);
        abort_unless(Subscription::current()->allowsFeature('promotions'), 403);

        $validated = $request->validate([
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['percentage', 'fixed'])],
            'value' => ['required', 'numeric', 'min:0'],
            'minimum_spend' => ['required', 'numeric', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['required', 'boolean'],
        ]);

        Promotion::query()->create($validated);

        return back()->with('success', 'Promotion created.');
    }

    public function storeVoucher(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManagePremium(), 403);
        abort_unless(Subscription::current()->allowsFeature('vouchers'), 403);

        $validated = $request->validate([
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'code' => ['required', 'string', 'max:100', 'unique:vouchers,code'],
            'type' => ['required', Rule::in(['percentage', 'fixed'])],
            'value' => ['required', 'numeric', 'min:0'],
            'minimum_spend' => ['required', 'numeric', 'min:0'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['required', 'boolean'],
        ]);

        Voucher::query()->create($validated);

        return back()->with('success', 'Voucher created.');
    }

    public function openShift(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canUseCheckout(), 403);
        abort_unless(Subscription::current()->allowsFeature('cashier_shifts'), 403);

        $validated = $request->validate([
            'outlet_id' => ['required', 'exists:outlets,id'],
            'opening_balance' => ['required', 'numeric', 'min:0'],
        ]);

        $existingShift = CashierShift::query()
            ->where('user_id', $request->user()->id)
            ->where('outlet_id', $validated['outlet_id'])
            ->where('status', 'open')
            ->first();

        if ($existingShift) {
            return back()->with('success', 'A shift is already open for this outlet.');
        }

        CashierShift::query()->create([
            'outlet_id' => $validated['outlet_id'],
            'user_id' => $request->user()->id,
            'opening_balance' => $validated['opening_balance'],
            'opened_at' => now(),
            'status' => 'open',
        ]);

        return back()->with('success', 'Cashier shift opened.');
    }

    public function closeShift(Request $request, CashierShift $shift): RedirectResponse
    {
        abort_unless($request->user()->canUseCheckout(), 403);
        abort_unless(Subscription::current()->allowsFeature('cashier_shifts'), 403);
        abort_unless($shift->user_id === $request->user()->id || $request->user()->canManagePremium(), 403);

        $validated = $request->validate([
            'closing_balance' => ['required', 'numeric', 'min:0'],
        ]);

        if ($shift->status === 'closed') {
            return back()->with('success', 'Shift already closed.');
        }

        $shift->update([
            'closing_balance' => $validated['closing_balance'],
            'closed_at' => now(),
            'status' => 'closed',
        ]);

        return back()->with('success', 'Cashier shift closed.');
    }

    public function updateSubscription(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManagePremium(), 403);

        $validated = $request->validate([
            'plan' => ['required', Rule::in(Subscription::planOptions())],
            'status' => ['required', 'string', 'max:50'],
            'billing_email' => ['nullable', 'email', 'max:255'],
            'auto_renews' => ['required', 'boolean'],
        ]);

        $subscription = Subscription::current();
        $defaults = Subscription::defaultsFor($validated['plan']);

        if (Outlet::query()->where('is_active', true)->count() > $defaults['outlet_limit']) {
            abort(422, 'The selected plan does not support the current number of active outlets.');
        }

        if (User::query()->where('is_active', true)->count() > $defaults['user_limit']) {
            abort(422, 'The selected plan does not support the current number of active users.');
        }

        $subscription->syncPlanDefaults($validated['plan']);
        $subscription->fill([
            'status' => $validated['status'],
            'billing_email' => $validated['billing_email'] ?? null,
            'auto_renews' => $validated['auto_renews'],
        ])->save();

        return back()->with('success', 'Subscription updated.');
    }
}
