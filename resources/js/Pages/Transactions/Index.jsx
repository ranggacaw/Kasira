import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
                    <h2 className="text-xl font-semibold leading-tight text-slate-900">
                        Transaction history
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Search completed sales by date, cashier, outlet, and payment method.
                    </p>
                </div>
            }
        >
            <Head title="Transactions" />

            <div className="space-y-6 py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
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
                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            />
                            <input
                                type="date"
                                value={filterForm.data.date_to}
                                onChange={(event) =>
                                    filterForm.setData('date_to', event.target.value)
                                }
                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            />
                            <select
                                value={filterForm.data.cashier_id}
                                onChange={(event) =>
                                    filterForm.setData('cashier_id', event.target.value)
                                }
                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="">All cashiers</option>
                                {cashiers.map((cashier) => (
                                    <option key={cashier.id} value={cashier.id}>
                                        {cashier.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filterForm.data.outlet_id}
                                onChange={(event) =>
                                    filterForm.setData('outlet_id', event.target.value)
                                }
                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="">All outlets</option>
                                {outlets.map((outlet) => (
                                    <option key={outlet.id} value={outlet.id}>
                                        {outlet.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filterForm.data.payment_method}
                                onChange={(event) =>
                                    filterForm.setData('payment_method', event.target.value)
                                }
                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="">All payment methods</option>
                                {paymentMethods.map((method) => (
                                    <option key={method} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filterForm.data.status}
                                onChange={(event) =>
                                    filterForm.setData('status', event.target.value)
                                }
                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="">All statuses</option>
                                <option value="completed">Completed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                            <button className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white md:col-span-5 xl:col-span-1">
                                Apply filters
                            </button>
                        </form>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Draft orders
                            </h3>
                            <span className="text-xs uppercase tracking-wide text-slate-400">
                                {draftOrders.length} drafts
                            </span>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {draftOrders.map((draft) => (
                                <div
                                    key={draft.id}
                                    className="rounded-2xl border border-slate-200 p-4"
                                >
                                    <p className="font-medium text-slate-900">{draft.name}</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {draft.outlet?.name || 'Outlet'}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {draft.customer?.name || 'Walk-in customer'}
                                    </p>
                                    <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                                        Saved draft
                                    </p>
                                </div>
                            ))}
                            {draftOrders.length === 0 && (
                                <p className="text-sm text-slate-500">
                                    No saved drafts match this outlet filter.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="text-left text-slate-400">
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
                                <tbody className="divide-y divide-slate-100 text-slate-600">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="py-3 font-medium text-slate-900">
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
                                                            ? 'bg-rose-50 text-rose-700'
                                                            : 'bg-emerald-50 text-emerald-700'
                                                    }`}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="py-3 font-medium text-slate-900">
                                                {formatCurrency(transaction.total)}
                                            </td>
                                            <td className="py-3 text-right">
                                                <Link
                                                    href={route('transactions.show', transaction.id)}
                                                    className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700"
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
