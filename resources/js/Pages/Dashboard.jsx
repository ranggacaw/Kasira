import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

export default function Dashboard({
    outlets,
    selectedOutletId,
    filters,
    metrics,
    salesTrend,
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const role = user.role?.name ?? 'Unassigned';

    const updateFilters = (nextFilters) => {
        router.get(
            route('dashboard'),
            {
                outlet: nextFilters.outlet ?? selectedOutletId ?? undefined,
                date_from: nextFilters.date_from ?? filters.date_from,
                date_to: nextFilters.date_to ?? filters.date_to,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold leading-tight text-slate-900">
                            Mobile operations dashboard
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Outlet-level performance, payment mix, best sellers,
                            and stock alerts for the selected trading period.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={selectedOutletId || ''}
                            onChange={(event) =>
                                updateFilters({ outlet: event.target.value || undefined })
                            }
                            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                        >
                            {outlets.map((outlet) => (
                                <option key={outlet.id} value={outlet.id}>
                                {outlet.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={filters.date_from || ''}
                            onChange={(event) =>
                                updateFilters({ date_from: event.target.value })
                            }
                            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                        />
                        <input
                            type="date"
                            value={filters.date_to || ''}
                            onChange={(event) =>
                                updateFilters({ date_to: event.target.value })
                            }
                            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                        />
                        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            {role}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                        <div className="space-y-6">
                            <div className="overflow-hidden rounded-2xl bg-slate-900 p-8 text-white shadow-sm">
                                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">
                                    Welcome back
                                </p>
                                <h3 className="mt-4 text-3xl font-semibold">
                                    {user.name}
                                </h3>
                                <p className="mt-3 max-w-2xl text-sm text-slate-300">
                                    You are signed in as {role}. Revenue, sales
                                    volume, best sellers, and replenishment alerts
                                    are now served from recorded business data.
                                </p>
                                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    {[
                                        [
                                            'Daily Revenue',
                                            formatCurrency(metrics.dailyRevenue),
                                        ],
                                         [
                                             'Transactions Today',
                                             metrics.dailyTransactions,
                                         ],
                                         [
                                             'Average Order',
                                             formatCurrency(metrics.averageOrderValue),
                                         ],
                                         [
                                             'Top Products',
                                             metrics.topProducts.length,
                                         ],
                                     ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                                        >
                                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                                {label}
                                            </p>
                                            <p className="mt-2 text-lg font-semibold text-white">
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                            Sales trend
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Revenue and transaction volume for the last seven days.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {salesTrend.length > 0 ? (
                                        salesTrend.map((point) => (
                                            <div
                                                key={point.date}
                                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <p className="text-xs uppercase tracking-wide text-slate-400">
                                                    {point.date}
                                                </p>
                                                <p className="mt-2 text-lg font-semibold text-slate-900">
                                                    {formatCurrency(point.revenue)}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {point.transactions} transactions
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">
                                            No sales trend data is available yet.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Payment summary
                                </h3>
                                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {metrics.paymentSummary.length > 0 ? (
                                        metrics.paymentSummary.map((entry) => (
                                            <div
                                                key={entry.method}
                                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <p className="text-sm font-medium text-slate-900">
                                                    {entry.method}
                                                </p>
                                                <p className="mt-2 text-lg font-semibold text-emerald-700">
                                                    {formatCurrency(entry.total_amount)}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {entry.payment_count} payments
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">
                                            No payment activity is available for this period.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Top-selling products
                                </h3>
                                <div className="mt-4 space-y-3 text-sm text-slate-600">
                                    {metrics.topProducts.length > 0 ? (
                                        metrics.topProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="rounded-2xl border border-slate-200 p-4"
                                            >
                                                <p className="font-medium text-slate-900">
                                                    {product.name}
                                                </p>
                                                <p className="mt-1 text-slate-500">
                                                    {product.quantity_sold} sold
                                                </p>
                                                <p className="mt-2 text-xs uppercase tracking-wide text-emerald-600">
                                                    {formatCurrency(product.revenue)}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">
                                            No sales have been recorded yet.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Low-stock alerts
                                </h3>
                                <div className="mt-4 space-y-3 text-sm text-slate-600">
                                    {metrics.lowStockAlerts.length > 0 ? (
                                        metrics.lowStockAlerts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
                                            >
                                                <p className="font-medium text-slate-900">
                                                    {product.name}
                                                </p>
                                                <p className="mt-1 text-slate-600">
                                                    Stock {product.stock_quantity} / minimum {product.minimum_stock}
                                                </p>
                                                <p className="mt-1 text-xs uppercase tracking-wide text-amber-700">
                                                    {product.outlet?.name}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">
                                            All tracked products are above their minimum threshold.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
