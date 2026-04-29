import PosLayout from '@/Layouts/PosLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

export default function Success({
    transaction,
    receiptChannels,
    receiptSettings,
    canSendDigitalReceipts,
    canUseThermalPrinting,
}) {
    const receiptForm = useForm({
        channel: receiptChannels[0] || 'print',
        recipient: '',
    });

    return (
        <PosLayout
            title="Sale completed"
            subtitle={`Transaction ${transaction.invoice_number} is ready for receipt handoff.`}
        >
            <Head title="Transaction Success" />

            <div className="grid gap-6 lg:grid-cols-[1.2fr_420px]">
                <section className="rounded-[2rem] border border-white/10 bg-surface-container-lowest/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-outline">{transaction.outlet?.name}</p>
                            <h2 className="mt-2 text-2xl font-semibold text-white">
                                {transaction.invoice_number}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white"
                        >
                            {canUseThermalPrinting ? 'Print now' : 'Print in browser'}
                        </button>
                    </div>

                    {receiptSettings.header && (
                        <p className="mt-6 rounded-xl border border-dashed border-white/10 p-4 text-sm text-on-surface-variant">
                            {receiptSettings.header}
                        </p>
                    )}

                    <div className="mt-6 space-y-3">
                        {transaction.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-surface-container/40 p-4"
                            >
                                <div>
                                    <p className="font-medium text-white">{item.product?.name}</p>
                                    <p className="mt-1 text-sm text-outline">
                                        {item.quantity} x {formatCurrency(item.unit_price)}
                                    </p>
                                </div>
                                <p className="font-semibold text-white">
                                    {formatCurrency(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm text-on-surface-variant">
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
                        <div className="flex justify-between text-base font-semibold text-white">
                            <span>Total</span>
                            <span>{formatCurrency(transaction.total)}</span>
                        </div>
                    </div>

                    {receiptSettings.footer && (
                        <p className="mt-6 border-t border-dashed border-white/10 pt-4 text-center text-sm text-outline">
                            {receiptSettings.footer}
                        </p>
                    )}
                </section>

                <section className="space-y-6 rounded-[2rem] border border-white/10 bg-surface-container-lowest/5 p-6 backdrop-blur">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Receipt handoff</h3>
                        <p className="mt-1 text-sm text-outline">
                            Print, download, or share the receipt right after payment.
                        </p>
                        <p className="mt-2 text-xs text-outline">
                            {canUseThermalPrinting
                                ? 'Current plan is eligible for thermal printer handoff when paired hardware is configured.'
                                : 'Browser printing is available now. Thermal printer handoff remains gated behind premium entitlements.'}
                        </p>
                    </div>

                    <div className="grid gap-3">
                        <Link
                            href={route('transactions.download', transaction.id)}
                            className="rounded-full bg-surface-container-lowest px-4 py-3 text-center text-sm font-semibold text-on-surface-variant"
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
                            className="rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-white"
                        >
                            Share receipt
                        </button>
                    </div>

                    <form
                        className="space-y-3"
                        onSubmit={(event) => {
                            event.preventDefault();
                            receiptForm.post(route('transactions.receipts.store', transaction.id));
                        }}
                    >
                        <select
                            value={receiptForm.data.channel}
                            onChange={(event) => receiptForm.setData('channel', event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-on-surface px-4 py-3 text-sm text-white"
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
                            className="w-full rounded-xl border border-white/10 bg-on-surface px-4 py-3 text-sm text-white"
                        />
                        {!canSendDigitalReceipts && (
                            <p className="text-xs text-amber-300">
                                Connected digital delivery requires the Business plan.
                            </p>
                        )}
                        <button className="w-full rounded-full bg-emerald-400 px-4 py-3 text-sm font-semibold text-on-surface-variant">
                            Log receipt action
                        </button>
                    </form>

                    <Link
                        href={route('pos.index')}
                        className="block rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                        Start another sale
                    </Link>
                </section>
            </div>
        </PosLayout>
    );
}
