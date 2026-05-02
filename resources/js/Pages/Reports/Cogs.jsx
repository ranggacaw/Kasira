import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectInput from '@/Components/SelectInput';
import { Head, Link, router } from '@inertiajs/react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

const formatPercentage = (value) => `${Number(value || 0).toFixed(2)}%`;

export default function CogsReport({
    filters,
    outlets,
    cashiers,
    categories,
    products,
    paymentMethods,
    summary,
    productProfitability,
}) {
    const applyFilters = (overrides = {}) => {
        const next = {
            outlet: overrides.outlet ?? filters.outlet ?? '',
            date_from: overrides.date_from ?? filters.date_from ?? '',
            date_to: overrides.date_to ?? filters.date_to ?? '',
            cashier_id: overrides.cashier_id ?? filters.cashier_id ?? '',
            category_id: overrides.category_id ?? filters.category_id ?? '',
            product_id: overrides.product_id ?? filters.product_id ?? '',
            payment_method: overrides.payment_method ?? filters.payment_method ?? '',
            sort: overrides.sort ?? filters.sort ?? 'highest_revenue',
        };

        router.get(
            route('reports.cogs'),
            Object.fromEntries(Object.entries(next).filter(([, value]) => value !== '' && value !== null)),
            { preserveState: true, replace: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-headline-md text-on-surface">COGS / HPP Report</h2>
                        <p className="mt-1 text-body-md text-on-surface-variant">
                            Snapshot-based profitability for completed sales.
                        </p>
                    </div>
                    <Link
                        href={route('reports.index')}
                        className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant"
                    >
                        Open overview
                    </Link>
                </div>
            }
        >
            <Head title="COGS / HPP Report" />

            <div className="space-y-6 pb-24">
                <div className="grid gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm ring-1 ring-outline-variant md:grid-cols-2 xl:grid-cols-4">
                    <SelectInput
                        value={filters.outlet || ''}
                        onChange={(event) => applyFilters({ outlet: event.target.value })}
                        className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
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
                        onChange={(event) => applyFilters({ date_from: event.target.value })}
                        className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                    />
                    <input
                        type="date"
                        value={filters.date_to || ''}
                        onChange={(event) => applyFilters({ date_to: event.target.value })}
                        className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                    />
                    <SelectInput
                        value={filters.sort || 'highest_revenue'}
                        onChange={(event) => applyFilters({ sort: event.target.value })}
                        className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                    >
                        <option value="highest_revenue">Highest revenue</option>
                        <option value="highest_profit">Highest profit</option>
                        <option value="lowest_profit">Lowest profit</option>
                        <option value="highest_margin">Highest margin</option>
                        <option value="lowest_margin">Lowest margin</option>
                        <option value="most_sold">Most sold</option>
                        <option value="least_sold">Least sold</option>
                    </SelectInput>
                    <SelectInput
                        value={filters.cashier_id || ''}
                        onChange={(event) => applyFilters({ cashier_id: event.target.value })}
                        className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                    >
                        <option value="">All cashiers</option>
                        {cashiers.map((cashier) => (
                            <option key={cashier.id} value={cashier.id}>
                                {cashier.name}
                            </option>
                        ))}
                    </SelectInput>
                    <SelectInput
                        value={filters.category_id || ''}
                        onChange={(event) => applyFilters({ category_id: event.target.value, product_id: '' })}
                        className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                    >
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </SelectInput>
                    <SelectInput
                        value={filters.product_id || ''}
                        onChange={(event) => applyFilters({ product_id: event.target.value })}
                        className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                    >
                        <option value="">All products</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </SelectInput>
                    <SelectInput
                        value={filters.payment_method || ''}
                        onChange={(event) => applyFilters({ payment_method: event.target.value })}
                        className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                    >
                        <option value="">All payment methods</option>
                        {paymentMethods.map((method) => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
                    </SelectInput>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[
                        ['Revenue', formatCurrency(summary.revenue)],
                        ['COGS', formatCurrency(summary.cogs)],
                        ['Gross Profit', formatCurrency(summary.gross_profit)],
                        ['Gross Margin', formatPercentage(summary.gross_margin)],
                        ['Transactions', summary.transaction_count],
                        ['Average Transaction Value', formatCurrency(summary.average_transaction_value)],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="rounded-xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant"
                        >
                            <p className="text-xs uppercase tracking-wide text-outline">{label}</p>
                            <p className="mt-2 text-lg font-semibold text-on-surface">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-6 py-4">
                        <div>
                            <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">
                                Product Profitability
                            </h3>
                            <p className="mt-1 text-body-md text-on-surface-variant">
                                Calculated from immutable transaction item snapshots.
                            </p>
                        </div>
                        <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                            {productProfitability.length} rows
                        </span>
                    </div>

                    {productProfitability.length === 0 ? (
                        <div className="px-6 py-12 text-center text-on-surface-variant">
                            No matching transactions were found for the current filters.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-outline-variant text-sm">
                                <thead className="bg-surface-container-low text-left text-outline">
                                    <tr>
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-6 py-3 text-right">Qty Sold</th>
                                        <th className="px-6 py-3 text-right">Revenue</th>
                                        <th className="px-6 py-3 text-right">COGS</th>
                                        <th className="px-6 py-3 text-right">Gross Profit</th>
                                        <th className="px-6 py-3 text-right">Gross Margin</th>
                                        <th className="px-6 py-3 text-right">Avg Sell</th>
                                        <th className="px-6 py-3 text-right">Avg Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant text-on-surface-variant">
                                    {productProfitability.map((product) => (
                                        <tr key={`${product.product_id}-${product.product_name}`}>
                                            <td className="px-6 py-4 font-medium text-on-surface">{product.product_name}</td>
                                            <td className="px-6 py-4 text-right">{product.quantity_sold}</td>
                                            <td className="px-6 py-4 text-right">{formatCurrency(product.revenue)}</td>
                                            <td className="px-6 py-4 text-right">{formatCurrency(product.cogs)}</td>
                                            <td className="px-6 py-4 text-right">{formatCurrency(product.gross_profit)}</td>
                                            <td className="px-6 py-4 text-right">{formatPercentage(product.gross_margin)}</td>
                                            <td className="px-6 py-4 text-right">{formatCurrency(product.average_selling_price)}</td>
                                            <td className="px-6 py-4 text-right">{formatCurrency(product.average_cost_price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
