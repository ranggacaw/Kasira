import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

export default function TransactionShow({
    transaction,
    canSendDigitalReceipts,
    receiptChannels,
    receiptSettings,
    canRefund,
}) {
    const flash = usePage().props.flash || {};
    const receiptForm = useForm({
        channel: receiptChannels[0] || 'print',
        recipient: '',
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-slate-900">
                            Receipt {transaction.invoice_number}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Reprint and connected receipt delivery history.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                    >
                        Print receipt
                    </button>
                </div>
            }
        >
            <Head title={`Receipt ${transaction.invoice_number}`} />

            <div className="space-y-6 py-10">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
                        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        {transaction.outlet?.name || 'Outlet'}
                                    </p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {transaction.invoice_number}
                                    </p>
                                </div>
                                <div className="text-right text-sm text-slate-500">
                                    <p>{transaction.paid_at || '-'}</p>
                                    <p>{transaction.cashier?.name || '-'}</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                {receiptSettings.receipt_header && (
                                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                        {receiptSettings.receipt_header}
                                    </div>
                                )}
                                {transaction.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
                                    >
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {item.quantity} x {formatCurrency(item.unit_price)}
                                            </p>
                                        </div>
                                        <p className="font-medium text-slate-900">
                                            {formatCurrency(item.subtotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                                <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(transaction.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(transaction.discount_amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>{formatCurrency(transaction.tax_amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Service fee</span>
                                    <span>{formatCurrency(transaction.service_fee_amount)}</span>
                                </div>
                                    <div className="flex justify-between text-base font-semibold text-slate-900">
                                        <span>Total</span>
                                        <span>{formatCurrency(transaction.total)}</span>
                                    </div>
                                </div>

                                {receiptSettings.receipt_footer && (
                                    <p className="mt-6 border-t border-dashed border-slate-200 pt-4 text-center text-sm text-slate-500">
                                        {receiptSettings.receipt_footer}
                                    </p>
                                )}
                            </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Sale context
                                </h3>
                                <dl className="mt-4 space-y-3 text-sm text-slate-600">
                                    <div>
                                        <dt className="text-slate-400">Customer</dt>
                                        <dd className="mt-1 font-medium text-slate-900">
                                            {transaction.customer?.name || 'Walk-in customer'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400">Payment</dt>
                                        <dd className="mt-1 font-medium text-slate-900">
                                            {transaction.payments[0]?.method || '-'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400">Promotion</dt>
                                        <dd className="mt-1 font-medium text-slate-900">
                                            {transaction.promotion?.name || 'None'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400">Voucher</dt>
                                        <dd className="mt-1 font-medium text-slate-900">
                                            {transaction.voucher?.code || 'None'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Receipt delivery log
                                </h3>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <Link
                                        href={route('transactions.download', transaction.id)}
                                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                                    >
                                        Download receipt
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (navigator.share) {
                                                await navigator.share({
                                                    title: `Receipt ${transaction.invoice_number}`,
                                                    url: route('transactions.show', transaction.id),
                                                });
                                            }
                                        }}
                                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                                    >
                                        Share receipt
                                    </button>
                                    {canRefund && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post(route('transactions.refund', transaction.id))
                                            }
                                            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700"
                                        >
                                            Refund transaction
                                        </button>
                                    )}
                                </div>
                                <form
                                    className="mt-4 space-y-3"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        receiptForm.post(
                                            route('transactions.receipts.store', transaction.id),
                                        );
                                    }}
                                >
                                    <select
                                        value={receiptForm.data.channel}
                                        onChange={(event) =>
                                            receiptForm.setData('channel', event.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    >
                                        {receiptChannels.map((channel) => (
                                            <option key={channel} value={channel}>
                                                {channel}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        value={receiptForm.data.recipient}
                                        onChange={(event) =>
                                            receiptForm.setData('recipient', event.target.value)
                                        }
                                        placeholder="Email or WhatsApp recipient"
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    {!canSendDigitalReceipts && (
                                        <p className="text-xs text-amber-600">
                                            Digital receipt delivery requires the Business plan.
                                        </p>
                                    )}
                                    <button className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                                        Log receipt action
                                    </button>
                                </form>

                                <div className="mt-4 space-y-3">
                                    {transaction.receipt_deliveries.map((delivery) => (
                                        <div
                                            key={delivery.id}
                                            className="rounded-2xl border border-slate-200 p-4"
                                        >
                                            <p className="font-medium text-slate-900">
                                                {delivery.channel}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {delivery.recipient || 'No recipient'}
                                            </p>
                                            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                                                {delivery.status}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
