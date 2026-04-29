<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesOutletContext;
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

        $outlets = $this->availableOutletsFor($request->user());
        $currentOutlet = $this->resolveCurrentOutlet($request);
        $startDate = now()->subDays(6)->startOfDay();
        $endDate = now()->endOfDay();

        $transactionQuery = Transaction::query()->when(
            $currentOutlet,
            fn ($query) => $query->where('outlet_id', $currentOutlet->id),
        );

        $todayRevenue = (clone $transactionQuery)
            ->whereDate('paid_at', today())
            ->sum('total');

        $todayTransactionCount = (clone $transactionQuery)
            ->whereDate('paid_at', today())
            ->count();

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

        return Inertia::render('Dashboard', [
            'outlets' => $outlets,
            'selectedOutletId' => $currentOutlet?->id,
            'metrics' => [
                'dailyRevenue' => (float) $todayRevenue,
                'dailyTransactions' => $todayTransactionCount,
                'topProducts' => $topProducts,
                'lowStockAlerts' => $lowStockAlerts,
            ],
            'salesTrend' => $salesTrend,
        ]);
    }
}
