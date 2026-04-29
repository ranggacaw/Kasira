<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesOutletContext;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    use ResolvesOutletContext;

    public function __invoke(Request $request): Response
    {
        abort_unless($request->user()->canViewDashboard(), 403);

        $filters = $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
        ]);

        $outlets = $this->availableOutletsFor($request->user());
        $currentOutlet = $this->resolveCurrentOutlet($request);
        $startDate = $request->date('date_from')?->startOfDay() ?? now()->subDays(6)->startOfDay();
        $endDate = $request->date('date_to')?->endOfDay() ?? now()->endOfDay();

        $transactionQuery = Transaction::query()->when(
            $currentOutlet,
            fn ($query) => $query->where('outlet_id', $currentOutlet->id),
        );

        $periodQuery = (clone $transactionQuery)
            ->whereBetween('paid_at', [$startDate, $endDate]);

        $todayRevenue = (clone $periodQuery)
            ->sum('total');

        $todayTransactionCount = (clone $periodQuery)
            ->count();

        $averageOrderValue = $todayTransactionCount > 0
            ? round($todayRevenue / $todayTransactionCount, 2)
            : 0;

        $topProducts = TransactionItem::query()
            ->selectRaw('products.id, products.name, SUM(transaction_items.quantity) as quantity_sold, SUM(transaction_items.subtotal) as revenue')
            ->join('transactions', 'transactions.id', '=', 'transaction_items.transaction_id')
            ->join('products', 'products.id', '=', 'transaction_items.product_id')
            ->when($currentOutlet, fn ($query) => $query->where('transactions.outlet_id', $currentOutlet->id))
            ->whereBetween('transactions.paid_at', [$startDate, $endDate])
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('quantity_sold')
            ->limit(5)
            ->get();

        $lowStockAlerts = Product::query()
            ->with(['category:id,name', 'outlet:id,name'])
            ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
            ->where('minimum_stock', '>', 0)
            ->whereColumn('stock_quantity', '<', 'minimum_stock')
            ->orderBy('stock_quantity')
            ->get();

        $salesTrend = Transaction::query()
            ->selectRaw('DATE(paid_at) as sale_date, SUM(total) as total_revenue, COUNT(*) as transaction_count')
            ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
            ->whereBetween('paid_at', [$startDate, $endDate])
            ->groupBy('sale_date')
            ->orderBy('sale_date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->sale_date,
                'revenue' => (float) $row->total_revenue,
                'transactions' => (int) $row->transaction_count,
            ]);

        $paymentSummary = Payment::query()
            ->selectRaw('payments.method, SUM(payments.amount) as total_amount, COUNT(payments.id) as payment_count')
            ->join('transactions', 'transactions.id', '=', 'payments.transaction_id')
            ->when($currentOutlet, fn ($query) => $query->where('transactions.outlet_id', $currentOutlet->id))
            ->whereBetween('transactions.paid_at', [$startDate, $endDate])
            ->groupBy('payments.method')
            ->orderByDesc('total_amount')
            ->get();

        return Inertia::render('Dashboard', [
            'outlets' => $outlets,
            'selectedOutletId' => $currentOutlet?->id,
            'filters' => [
                'date_from' => $startDate->toDateString(),
                'date_to' => $endDate->toDateString(),
            ],
            'metrics' => [
                'dailyRevenue' => (float) $todayRevenue,
                'dailyTransactions' => $todayTransactionCount,
                'averageOrderValue' => (float) $averageOrderValue,
                'topProducts' => $topProducts,
                'lowStockAlerts' => $lowStockAlerts,
                'paymentSummary' => $paymentSummary,
            ],
            'salesTrend' => $salesTrend,
        ]);
    }
}
