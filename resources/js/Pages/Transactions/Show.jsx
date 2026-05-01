import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectInput from '@/Components/SelectInput';
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
    canUseThermalPrinting,
}) {
    const flash = usePage().props.flash || {};
    const receiptForm = useForm({
        channel: receiptChannels[0] || 'print',
        recipient: '',
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-on-surface">
                            Receipt {transaction.invoice_number}
                        </h2>
                        <p className="mt-1 text-sm text-outline">
                            Reprint and connected receipt delivery history.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="touch-target inline-flex items-center justify-center rounded-full border border-outline px-4 py-2 text-sm font-medium text-on-surface-variant"
                    >
                        {canUseThermalPrinting ? 'Print receipt' : 'Print in browser'}
                    </button>
                </div>
            }
        >
            <Head title={`Receipt ${transaction.invoice_number}`} />

            <div className="space-y-6 ">
                <div className="mx-auto space-y-6">
                    {flash.success && (
                        <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-container px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
                        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                            <div className="flex flex-col gap-3 border-b border-outline-variant pb-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-outline">
                                        {transaction.outlet?.name || 'Outlet'}
                                    </p>
                                    <p className="text-lg font-semibold text-on-surface">
                                        {transaction.invoice_number}
                                    </p>
                                </div>
                                <div className="text-sm text-outline sm:text-right">
                                    <p>{transaction.paid_at || '-'}</p>
                                    <p>{transaction.cashier?.name || '-'}</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                {receiptSettings.receipt_header && (
                                    <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant">
                                        {receiptSettings.receipt_header}
                                    </div>
                                )}
                                {transaction.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <p className="font-medium text-on-surface">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-sm text-outline">
                                                {item.quantity} x {formatCurrency(item.unit_price)}
                                            </p>
                                        </div>
                                        <p className="font-medium text-on-surface">
                                            {formatCurrency(item.subtotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                                <div className="mt-6 space-y-2 border-t border-outline-variant pt-4 text-sm text-on-surface-variant">
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
                                    <div className="flex justify-between text-base font-semibold text-on-surface">
                                        <span>Total</span>
                                        <span>{formatCurrency(transaction.total)}</span>
                                    </div>
                                </div>

                                {receiptSettings.receipt_footer && (
                                    <p className="mt-6 border-t border-dashed border-outline-variant pt-4 text-center text-sm text-outline">
                                        {receiptSettings.receipt_footer}
                                    </p>
                                )}
                            </div>

                        <div className="space-y-6">
                            <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                    Sale context
                                </h3>
                                <dl className="mt-4 space-y-3 text-sm text-on-surface-variant">
                                    <div>
                                        <dt className="text-outline">Customer</dt>
                                        <dd className="mt-1 font-medium text-on-surface">
                                            {transaction.customer?.name || 'Walk-in customer'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-outline">Payment</dt>
                                        <dd className="mt-1 font-medium text-on-surface">
                                            {transaction.payments[0]?.method || '-'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-outline">Promotion</dt>
                                        <dd className="mt-1 font-medium text-on-surface">
                                            {transaction.promotion?.name || 'None'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-outline">Voucher</dt>
                                        <dd className="mt-1 font-medium text-on-surface">
                                            {transaction.voucher?.code || 'None'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                    Receipt delivery log
                                </h3>
                                <p className="mt-2 text-xs text-outline">
                                    {canUseThermalPrinting
                                        ? 'Current plan is eligible for thermal printer handoff when paired hardware is configured.'
                                        : 'Browser printing is available now. Thermal printer handoff remains gated behind premium entitlements.'}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <Link
                                        href={route('transactions.download', transaction.id)}
                                        className="touch-target rounded-full border border-outline px-4 py-2 text-sm font-medium text-on-surface-variant"
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
                                        className="touch-target rounded-full border border-outline px-4 py-2 text-sm font-medium text-on-surface-variant"
                                    >
                                        Share receipt
                                    </button>
                                    {canRefund && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post(route('transactions.refund', transaction.id))
                                            }
                                            className="touch-target rounded-full border border-rose-200 bg-error-container px-4 py-2 text-sm font-medium text-rose-700"
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
                                    <SelectInput
                                        value={receiptForm.data.channel}
                                        onChange={(event) =>
                                            receiptForm.setData('channel', event.target.value)
                                        }
                                        className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                    >
                                        {receiptChannels.map((channel) => (
                                            <option key={channel} value={channel}>
                                                {channel}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <input
                                        value={receiptForm.data.recipient}
                                        onChange={(event) =>
                                            receiptForm.setData('recipient', event.target.value)
                                        }
                                        placeholder="Email or WhatsApp recipient"
                                        className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                    />
                                    {!canSendDigitalReceipts && (
                                        <p className="text-xs text-amber-600">
                                            Digital receipt delivery requires the Business plan.
                                        </p>
                                    )}
                                    <button className="touch-target rounded-full bg-on-surface px-4 py-3 text-sm font-semibold text-white">
                                        Log receipt action
                                    </button>
                                </form>

                                <div className="mt-4 space-y-3">
                                    {transaction.receipt_deliveries.map((delivery) => (
                                        <div
                                            key={delivery.id}
                                            className="rounded-xl border border-outline-variant p-4"
                                        >
                                            <p className="font-medium text-on-surface">
                                                {delivery.channel}
                                            </p>
                                            <p className="mt-1 text-sm text-outline">
                                                {delivery.recipient || 'No recipient'}
                                            </p>
                                            <p className="mt-1 text-xs uppercase tracking-wide text-outline">
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
