import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectInput from '@/Components/SelectInput';
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
                        <h2 className="text-headline-md leading-tight text-on-surface">
                            Mobile operations dashboard
                        </h2>
                        <p className="mt-1 text-body-md text-on-surface-variant">
                            Outlet-level performance, payment mix, best sellers,
                            and stock alerts for the selected trading period.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <SelectInput
                            value={selectedOutletId || ''}
                            onChange={(event) =>
                                updateFilters({ outlet: event.target.value || undefined })
                            }
                            className="rounded-full border border-outline px-4 py-2 text-body-md text-on-surface-variant"
                        >
                            {outlets.map((outlet) => (
                                <option key={outlet.id} value={outlet.id}>
                                {outlet.name}
                                </option>
                            ))}
                        </SelectInput>
                        <input
                            type="date"
                            value={filters.date_from || ''}
                            onChange={(event) =>
                                updateFilters({ date_from: event.target.value })
                            }
                            className="rounded-full border border-outline px-4 py-2 text-body-md text-on-surface-variant"
                        />
                        <input
                            type="date"
                            value={filters.date_to || ''}
                            onChange={(event) =>
                                updateFilters({ date_to: event.target.value })
                            }
                            className="rounded-full border border-outline px-4 py-2 text-body-md text-on-surface-variant"
                        />
                        <div className="rounded-full bg-tertiary-container px-3 py-1 text-body-md font-semibold uppercase tracking-wide text-tertiary-container">
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
                            <div className="overflow-hidden rounded-xl bg-primary p-8 text-white shadow-sm">
                                <p className="text-body-md uppercase tracking-[0.24em] text-on-surface-variant">
                                    Welcome back
                                </p>
                                <h3 className="mt-4 text-3xl font-semibold">
                                    {user.name}
                                </h3>
                                <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">
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
                                            className="rounded-xl border border-white/10 bg-surface-container-lowest/5 p-4"
                                        >
                                            <p className="text-body-md uppercase tracking-wide text-outline">
                                                {label}
                                            </p>
                                            <p className="mt-2 text-lg font-semibold text-white">
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-body-md font-semibold uppercase tracking-wide text-on-surface-variant">
                                            Sales trend
                                        </h3>
                                        <p className="mt-1 text-body-md text-on-surface-variant">
                                            Revenue and transaction volume for the last seven days.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {salesTrend.length > 0 ? (
                                        salesTrend.map((point) => (
                                            <div
                                                key={point.date}
                                                className="rounded-xl border border-outline-variant bg-surface-container-low p-4"
                                            >
                                                <p className="text-body-md uppercase tracking-wide text-outline">
                                                    {point.date}
                                                </p>
                                                <p className="mt-2 text-lg font-semibold text-on-surface">
                                                    {formatCurrency(point.revenue)}
                                                </p>
                                                <p className="mt-1 text-body-md text-on-surface-variant">
                                                    {point.transactions} transactions
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-body-md text-on-surface-variant">
                                            No sales trend data is available yet.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                <h3 className="text-body-md font-semibold uppercase tracking-wide text-on-surface-variant">
                                    Payment summary
                                </h3>
                                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {metrics.paymentSummary.length > 0 ? (
                                        metrics.paymentSummary.map((entry) => (
                                            <div
                                                key={entry.method}
                                                className="rounded-xl border border-outline-variant bg-surface-container-low p-4"
                                            >
                                                <p className="text-body-md font-medium text-on-surface">
                                                    {entry.method}
                                                </p>
                                                <p className="mt-2 text-lg font-semibold text-tertiary-container">
                                                    {formatCurrency(entry.total_amount)}
                                                </p>
                                                <p className="mt-1 text-body-md text-on-surface-variant">
                                                    {entry.payment_count} payments
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-body-md text-on-surface-variant">
                                            No payment activity is available for this period.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                <h3 className="text-body-md font-semibold uppercase tracking-wide text-on-surface-variant">
                                    Top-selling products
                                </h3>
                                <div className="mt-4 space-y-3 text-body-md text-on-surface-variant">
                                    {metrics.topProducts.length > 0 ? (
                                        metrics.topProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="rounded-xl border border-outline-variant p-4"
                                            >
                                                <p className="font-medium text-on-surface">
                                                    {product.name}
                                                </p>
                                                <p className="mt-1 text-on-surface-variant">
                                                    {product.quantity_sold} sold
                                                </p>
                                                <p className="mt-2 text-body-md uppercase tracking-wide text-tertiary">
                                                    {formatCurrency(product.revenue)}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-body-md text-on-surface-variant">
                                            No sales have been recorded yet.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                <h3 className="text-body-md font-semibold uppercase tracking-wide text-on-surface-variant">
                                    Low-stock alerts
                                </h3>
                                <div className="mt-4 space-y-3 text-body-md text-on-surface-variant">
                                    {metrics.lowStockAlerts.length > 0 ? (
                                        metrics.lowStockAlerts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="rounded-xl border border-secondary-fixed-dim bg-secondary-container p-4"
                                            >
                                                <p className="font-medium text-on-surface">
                                                    {product.name}
                                                </p>
                                                <p className="mt-1 text-on-surface-variant">
                                                    Stock {product.stock_quantity} / minimum {product.minimum_stock}
                                                </p>
                                                <p className="mt-1 text-body-md uppercase tracking-wide text-on-secondary-container">
                                                    {product.outlet?.name}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-body-md text-on-surface-variant">
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
