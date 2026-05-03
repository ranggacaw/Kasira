import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectInput from '@/Components/SelectInput';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

export default function TransactionsIndex({
    filters,
    transactions,
    outlets,
    cashiers,
    paymentMethods,
    draftOrders,
}) {
    const flash = usePage().props.flash || {};
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterOutlet, setFilterOutlet] = useState(filters.outlet_id || '');
    const [filterCashier, setFilterCashier] = useState(filters.cashier_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const applyFilters = () => {
        router.get(route('transactions.index'), {
            search: searchQuery || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            outlet_id: filterOutlet || undefined,
            cashier_id: filterCashier || undefined,
            status: filterStatus || undefined,
        }, { preserveState: true, replace: true });
    };

    const activeFilters = dateFrom || dateTo || filterCashier || filterOutlet || filterStatus;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-headline-md leading-tight text-on-surface">
                        Transactions
                    </h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        View completed sales and manage draft orders.
                    </p>
                </div>
            }
        >
            <Head title="Transactions" />

            <div className="space-y-6 pb-24">
                {flash.success && (
                    <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-fixed-dim px-4 py-3 text-body-md text-on-tertiary-fixed">
                        {flash.success}
                    </div>
                )}

                {/* Search + Filter Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-64">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0 1 14 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search invoice, customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full border border-outline bg-surface-container-lowest py-2 pl-12 pr-4 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant"
                    />
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant"
                    />
                    <SelectInput
                        value={filterOutlet}
                        onChange={(e) => {
                            setFilterOutlet(e.target.value);
                            applyFilters();
                        }}
                        className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant"
                    >
                        <option value="">All outlets</option>
                        {outlets.map((outlet) => (
                            <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                        ))}
                    </SelectInput>
                    <SelectInput
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            applyFilters();
                        }}
                        className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant"
                    >
                        <option value="">All status</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                    </SelectInput>
                    {activeFilters && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setDateFrom('');
                                setDateTo('');
                                setFilterOutlet('');
                                setFilterStatus('');
                                router.get(route('transactions.index'), {}, { preserveState: true, replace: true });
                            }}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Two Column Layout */}
                <div className="grid gap-6 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1.5fr]">
                    {/* Draft Orders */}
                    <div className="space-y-4">
                        {draftOrders.length > 0 ? (
                            <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">
                                        Draft Orders
                                    </h3>
                                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">
                                        {draftOrders.length}
                                    </span>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {draftOrders.map((draft) => (
                                        <Link
                                            key={draft.id}
                                            href={route('pos.create', { draft_id: draft.id })}
                                            className="group rounded-xl border border-outline-variant p-4 transition-all hover:border-primary hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between">
                                                <p className="font-semibold text-on-surface">
                                                    {draft.name}
                                                </p>
                                                <span className="text-xs text-outline">
                                                    {draft.created_at_relative || '—'}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm text-on-surface-variant">
                                                {draft.outlet?.name || 'Outlet'} · {draft.customer?.name || 'Walk-in'}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between border-t border-outline-variant pt-3">
                                                <span className="font-semibold text-on-surface">
                                                    {formatCurrency(draft.estimated_total)}
                                                </span>
                                                <span className="text-sm font-semibold text-primary">
                                                    Resume →
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-outline-variant p-8 text-center">
                                <svg className="w-12 h-12 mx-auto text-outline mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-on-surface font-medium">No draft orders</p>
                                <p className="mt-1 text-sm text-outline">All orders have been completed.</p>
                            </div>
                        )}
                    </div>

                    {/* Transactions Table */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">
                                Transaction history
                            </h3>
                            <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                                {transactions.length} results
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant">
                            {/* Table Header */}
                            <div className="hidden gap-4 border-b border-outline-variant bg-surface-container-low px-4 py-3 text-xs font-semibold uppercase tracking-wide text-outline lg:grid lg:grid-cols-12">
                                <div className="col-span-3">Invoice</div>
                                <div className="col-span-2">Date</div>
                                <div className="col-span-2">Outlet</div>
                                <div className="col-span-2">Customer</div>
                                <div className="col-span-1">Status</div>
                                <div className="col-span-1 text-right">Total</div>
                                <div className="col-span-1 text-right"></div>
                            </div>

                            {/* Table Rows */}
                            {transactions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <svg className="w-12 h-12 text-outline mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    <p className="text-on-surface-variant font-medium">No transactions found</p>
                                    <p className="mt-1 text-sm text-outline">Try adjusting your filters.</p>
                                </div>
                            ) : (
                                transactions.map((transaction, index) => (
                                    <div
                                        key={transaction.id}
                                        className={`grid grid-cols-1 items-center gap-4 border-b border-outline-variant px-4 py-4 transition hover:bg-surface-container-low lg:grid lg:grid-cols-12 ${
                                            index === transactions.length - 1 ? 'border-b-0' : ''
                                        }`}
                                    >
                                        <div className="col-span-3 font-semibold text-on-surface">
                                            {transaction.invoice_number}
                                        </div>
                                        <div className="col-span-2 text-on-surface-variant">
                                            {transaction.paid_at || '—'}
                                        </div>
                                        <div className="col-span-2 text-on-surface-variant">
                                            {transaction.outlet?.name || '—'}
                                        </div>
                                        <div className="col-span-2 text-on-surface-variant">
                                            {transaction.customer?.name || 'Walk-in'}
                                        </div>
                                        <div className="col-span-1">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                transaction.status === 'cancelled'
                                                    ? 'bg-secondary-container text-on-secondary-container'
                                                    : transaction.status === 'refunded'
                                                    ? 'bg-error-container text-on-error-container'
                                                    : 'bg-tertiary-fixed-dim text-on-tertiary-fixed'
                                            }`}>
                                                {transaction.status}
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-right font-semibold text-on-surface">
                                            {formatCurrency(transaction.total)}
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <Link
                                                href={route('transactions.show', transaction.id)}
                                                className="text-xs font-semibold text-primary hover:underline"
                                            >
                                                Receipt
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
