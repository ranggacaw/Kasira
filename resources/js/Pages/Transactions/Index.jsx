import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectInput from '@/Components/SelectInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

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
    const filterForm = useForm({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        cashier_id: filters.cashier_id || '',
        outlet_id: filters.outlet_id || '',
        payment_method: filters.payment_method || '',
        status: filters.status || '',
    });

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-on-surface">
                        Transaction history
                    </h2>
                    <p className="mt-1 text-sm text-outline">
                        Search completed sales by date, cashier, outlet, and payment method.
                    </p>
                </div>
            }
        >
            <Head title="Transactions" />

            <div className="space-y-6 py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-container px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                        <form
                            className="grid gap-3 md:grid-cols-5"
                            onSubmit={(event) => {
                                event.preventDefault();
                                filterForm.get(route('transactions.index'));
                            }}
                        >
                            <input
                                type="date"
                                value={filterForm.data.date_from}
                                onChange={(event) =>
                                    filterForm.setData('date_from', event.target.value)
                                }
                                className="rounded-xl border border-outline px-3 py-2 text-sm cursor-pointer"
                            />
                            <input
                                type="date"
                                value={filterForm.data.date_to}
                                onChange={(event) =>
                                    filterForm.setData('date_to', event.target.value)
                                }
                                className="rounded-xl border border-outline px-3 py-2 text-sm cursor-pointer"
                            />
                            <SelectInput
                                value={filterForm.data.cashier_id}
                                onChange={(event) =>
                                    filterForm.setData('cashier_id', event.target.value)
                                }
                                className="rounded-xl border border-outline px-3 py-2 text-sm cursor-pointer"
                            >
                                <option value="">All cashiers</option>
                                {cashiers.map((cashier) => (
                                    <option key={cashier.id} value={cashier.id}>
                                        {cashier.name}
                                    </option>
                                ))}
                            </SelectInput>
                            <SelectInput
                                value={filterForm.data.outlet_id}
                                onChange={(event) =>
                                    filterForm.setData('outlet_id', event.target.value)
                                }
                                className="rounded-xl border border-outline px-3 py-2 text-sm cursor-pointer"
                            >
                                <option value="">All outlets</option>
                                {outlets.map((outlet) => (
                                    <option key={outlet.id} value={outlet.id}>
                                        {outlet.name}
                                    </option>
                                ))}
                            </SelectInput>
                            <SelectInput
                                value={filterForm.data.payment_method}
                                onChange={(event) =>
                                    filterForm.setData('payment_method', event.target.value)
                                }
                                className="rounded-xl border border-outline px-3 py-2 text-sm cursor-pointer"
                            >
                                <option value="">All payment methods</option>
                                {paymentMethods.map((method) => (
                                    <option key={method} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </SelectInput>
                            <SelectInput
                                value={filterForm.data.status}
                                onChange={(event) =>
                                    filterForm.setData('status', event.target.value)
                                }
                                className="rounded-xl border border-outline px-3 py-2 text-sm cursor-pointer"
                            >
                                <option value="">All statuses</option>
                                <option value="completed">Completed</option>
                                <option value="refunded">Refunded</option>
                            </SelectInput>
                            <button className="rounded-full bg-on-surface px-4 py-3 text-sm font-semibold text-white md:col-span-5 xl:col-span-1">
                                Apply filters
                            </button>
                        </form>
                    </div>

                    <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                Draft orders
                            </h3>
                            <span className="text-xs uppercase tracking-wide text-outline">
                                {draftOrders.length} drafts
                            </span>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {draftOrders.map((draft) => (
                                <div
                                    key={draft.id}
                                    className="rounded-xl border border-outline-variant p-4"
                                >
                                    <p className="font-medium text-on-surface">{draft.name}</p>
                                    <p className="mt-1 text-sm text-outline">
                                        {draft.outlet?.name || 'Outlet'}
                                    </p>
                                    <p className="mt-1 text-sm text-outline">
                                        {draft.customer?.name || 'Walk-in customer'}
                                    </p>
                                    <p className="mt-2 text-xs uppercase tracking-wide text-outline">
                                        Saved draft
                                    </p>
                                </div>
                            ))}
                            {draftOrders.length === 0 && (
                                <p className="text-sm text-outline">
                                    No saved drafts match this outlet filter.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="text-left text-outline">
                                    <tr>
                                        <th className="pb-3">Invoice</th>
                                        <th className="pb-3">Date</th>
                                        <th className="pb-3">Cashier</th>
                                        <th className="pb-3">Outlet</th>
                                        <th className="pb-3">Payment</th>
                                        <th className="pb-3">Customer</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Total</th>
                                        <th className="pb-3 text-right">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant text-on-surface-variant">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="py-3 font-medium text-on-surface">
                                                {transaction.invoice_number}
                                            </td>
                                            <td className="py-3">
                                                {transaction.paid_at || '-'}
                                            </td>
                                            <td className="py-3">
                                                {transaction.cashier?.name || '-'}
                                            </td>
                                            <td className="py-3">
                                                {transaction.outlet?.name || '-'}
                                            </td>
                                            <td className="py-3">
                                                {transaction.payments[0]?.method || '-'}
                                            </td>
                                            <td className="py-3">
                                                {transaction.customer?.name || 'Walk-in'}
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        transaction.status === 'refunded'
                                                            ? 'bg-error-container text-rose-700'
                                                            : 'bg-tertiary-container text-tertiary-container'
                                                    }`}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="py-3 font-medium text-on-surface">
                                                {formatCurrency(transaction.total)}
                                            </td>
                                            <td className="py-3 text-right">
                                                <Link
                                                    href={route('transactions.show', transaction.id)}
                                                    className="rounded-full border border-outline px-3 py-1 text-xs font-medium text-on-surface-variant"
                                                >
                                                    View receipt
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
