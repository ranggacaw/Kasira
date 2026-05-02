import PosLayout from '@/Layouts/PosLayout';
import SelectInput from '@/Components/SelectInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

const formatPercentage = (value) => `${Number(value || 0).toFixed(2)}%`;

export default function Success({
    transaction,
    receiptChannels,
    receiptSettings,
    canSendDigitalReceipts,
    canUseThermalPrinting,
    canViewProfitability,
}) {
    const receiptForm = useForm({
        channel: receiptChannels[0] || 'print',
        recipient: '',
    });
    const [shareCopied, setShareCopied] = useState(false);
    const [formStatus, setFormStatus] = useState(null);
    const profitabilityTotals = transaction.items.reduce(
        (totals, item) => ({
            subtotalCost: totals.subtotalCost + Number(item.subtotal_cost || 0),
            grossProfit: totals.grossProfit + Number(item.gross_profit || 0),
        }),
        { subtotalCost: 0, grossProfit: 0 },
    );
    const grossMargin = transaction.subtotal > 0
        ? (profitabilityTotals.grossProfit / transaction.subtotal) * 100
        : 0;

    return (
        <>
            <Head title="Transaction Success" />

            {/* Thermal Print Receipt - Only visible when printing */}
            <div className="hidden print:block w-full bg-white p-0 font-mono text-sm text-black">
                {/* Header */}
                <div className="mb-6 text-center">
                    <h2 className="mb-2 text-2xl font-bold uppercase tracking-wider">Kasira</h2>
                    <h2 className="mb-2 text-lg font-bold uppercase tracking-wider">Order Receipt</h2>
                    <p className="text-xs">#{transaction.invoice_number}</p>
                    {receiptSettings.header && (
                        <div className="mt-4 whitespace-pre-wrap text-xs">
                            {receiptSettings.header}
                        </div>
                    )}
                </div>

                {/* Table Header */}
                <div className="mb-2 flex border-b border-dashed border-gray-400 pb-2 text-xs font-bold uppercase">
                    <div className="w-8 text-left">Qty</div>
                    <div className="flex-1 px-2 text-left">Item</div>
                    <div className="w-24 text-right">Cost</div>
                </div>

                {/* Items */}
                <div className="mb-4 space-y-3 text-xs">
                    {transaction.items.map((item) => (
                        <div key={item.id} className="flex items-start">
                            <div className="w-8 text-left">{item.quantity}</div>
                            <div className="flex-1 px-2 text-left">
                                <div>{item.name}</div>
                                {item.quantity > 1 && (
                                    <div className="mt-0.5 text-gray-600">
                                        @ {formatCurrency(item.unit_price)}
                                    </div>
                                )}
                            </div>
                            <div className="w-24 text-right">{formatCurrency(item.subtotal)}</div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="mb-6 border-t border-dashed border-gray-400 pt-4 space-y-2 text-xs">
                    <div className="flex justify-end gap-4">
                        <span className="w-24 text-right">Subtotal:</span>
                        <span className="w-24 text-right">{formatCurrency(transaction.subtotal)}</span>
                    </div>
                    {transaction.discount_amount > 0 && (
                        <div className="flex justify-end gap-4">
                            <span className="w-24 text-right">Discount:</span>
                            <span className="w-24 text-right">-{formatCurrency(transaction.discount_amount)}</span>
                        </div>
                    )}
                    {transaction.tax_amount > 0 && (
                        <div className="flex justify-end gap-4">
                            <span className="w-24 text-right">Tax:</span>
                            <span className="w-24 text-right">{formatCurrency(transaction.tax_amount)}</span>
                        </div>
                    )}
                    {transaction.service_fee_amount > 0 && (
                        <div className="flex justify-end gap-4">
                            <span className="w-24 text-right">Service Fee:</span>
                            <span className="w-24 text-right">{formatCurrency(transaction.service_fee_amount)}</span>
                        </div>
                    )}
                    <div className="mt-2 flex justify-end gap-4 border-t border-dashed border-gray-400 pt-2 font-bold text-sm">
                        <span className="w-24 text-right uppercase">Total:</span>
                        <span className="w-24 text-right">{formatCurrency(transaction.total)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs">
                    <p className="mb-2 tracking-widest">************************</p>
                    <p className="font-bold uppercase whitespace-pre-wrap">{receiptSettings.footer || 'Thank You!'}</p>
                    <p className="mt-2 tracking-widest">************************</p>
                </div>
            </div>

            <div className="print:hidden contents">
                <PosLayout
                    title="Sale completed"
                    subtitle={`Transaction ${transaction.invoice_number} is ready for receipt handoff.`}
                >

            <div className="space-y-6 p-4 pb-24 sm:p-6">
                {/* Success Header Card */}
                <section className="rounded-2xl border border-outline-variant bg-white p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Transaction</p>
                                <h2 className="text-xl font-bold text-on-surface">{transaction.invoice_number}</h2>
                            </div>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Total Collected</p>
                            <p className="text-2xl font-extrabold text-primary">{formatCurrency(transaction.total)}</p>
                        </div>
                    </div>
                </section>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left: Receipt Items */}
                    <section className="lg:col-span-2 rounded-2xl border border-outline-variant bg-white p-6">
                        {receiptSettings.header && (
                            <div className="mb-4 rounded-xl border border-dashed border-outline-variant p-4 text-sm text-on-surface-variant">
                                {receiptSettings.header}
                            </div>
                        )}
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-bold text-on-surface">Receipt</h3>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="touch-target inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm font-medium text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                {canUseThermalPrinting ? 'Print' : 'Print'}
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="divide-y divide-outline-variant rounded-xl border border-outline-variant">
                            {transaction.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-3 p-4 transition hover:bg-surface-container-low sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <p className="font-semibold text-on-surface">{item.name}</p>
                                        <p className="text-sm text-on-surface-variant">
                                            {item.quantity} x {formatCurrency(item.unit_price)}
                                        </p>
                                        {canViewProfitability && (
                                            <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
                                                <p>Cost: {formatCurrency(item.cost_price)} per item</p>
                                                <p>COGS: {formatCurrency(item.subtotal_cost)}</p>
                                                <p>Gross profit: {formatCurrency(item.gross_profit)} ({formatPercentage(item.gross_margin)})</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold text-on-surface">{formatCurrency(item.subtotal)}</p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-4 rounded-xl bg-surface-container-low p-4">
                            <div className="space-y-2 text-sm text-on-surface-variant">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-on-surface">{formatCurrency(transaction.subtotal)}</span>
                                </div>
                                {transaction.discount_amount > 0 && (
                                    <div className="flex justify-between">
                                        <span>Discount</span>
                                        <span className="font-semibold text-tertiary">-{formatCurrency(transaction.discount_amount)}</span>
                                    </div>
                                )}
                                {transaction.tax_amount > 0 && (
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span className="font-semibold text-on-surface">{formatCurrency(transaction.tax_amount)}</span>
                                    </div>
                                )}
                                {transaction.service_fee_amount > 0 && (
                                    <div className="flex justify-between">
                                        <span>Service fee</span>
                                        <span className="font-semibold text-on-surface">{formatCurrency(transaction.service_fee_amount)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-outline-variant pt-3">
                                <span className="font-bold text-on-surface">Total</span>
                                <span className="text-xl font-extrabold text-primary">{formatCurrency(transaction.total)}</span>
                            </div>
                        </div>

                        {receiptSettings.footer && (
                            <p className="mt-4 border-t border-dashed border-outline-variant pt-4 text-center text-sm text-on-surface-variant">
                                {receiptSettings.footer}
                            </p>
                        )}
                    </section>

                    {/* Right: Actions */}
                    <section className="space-y-4">
                        {/* Next Action Card */}
                        <div className="rounded-2xl border border-outline-variant bg-white p-6">
                            <h3 className="mb-4 text-lg font-bold text-on-surface">Next Action</h3>
                            <div className="space-y-3">
                                <Link
                                    href={route('pos.index')}
                                    className="touch-target block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    Start Another Sale
                                </Link>
                                <Link
                                    href={route('transactions.download', transaction.id)}
                                    className="touch-target block rounded-xl border-2 border-outline-variant bg-white px-4 py-3 text-center text-sm font-semibold text-on-surface transition hover:border-primary/30 hover:bg-surface-container active:scale-[0.98]"
                                >
                                    Download PDF
                                </Link>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const url = route('transactions.show', transaction.id);
                                        if (navigator.share) {
                                            try {
                                                await navigator.share({
                                                    title: `Receipt ${transaction.invoice_number}`,
                                                    url,
                                                });
                                            } catch (e) {
                                                // User cancelled or error
                                            }
                                        } else {
                                            // Fallback: copy to clipboard
                                            try {
                                                await navigator.clipboard.writeText(url);
                                                setShareCopied(true);
                                                setTimeout(() => setShareCopied(false), 2000);
                                            } catch (e) {
                                                console.error('Failed to copy:', e);
                                            }
                                        }
                                    }}
                                    className="touch-target w-full rounded-xl border-2 border-outline-variant bg-white px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface active:scale-[0.98]"
                                >
                                    {shareCopied ? 'Link Copied!' : 'Share Receipt Link'}
                                </button>
                            </div>
                        </div>

                        {canViewProfitability && (
                            <div className="rounded-2xl border border-outline-variant bg-white p-6">
                                <h3 className="mb-4 text-lg font-bold text-on-surface">Profitability Snapshot</h3>
                                <div className="space-y-3 text-sm text-on-surface-variant">
                                    <div className="flex justify-between gap-4">
                                        <span>Revenue</span>
                                        <span className="font-semibold text-on-surface">{formatCurrency(transaction.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span>COGS</span>
                                        <span className="font-semibold text-on-surface">{formatCurrency(profitabilityTotals.subtotalCost)}</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span>Gross profit</span>
                                        <span className="font-semibold text-on-surface">{formatCurrency(profitabilityTotals.grossProfit)}</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span>Gross margin</span>
                                        <span className="font-semibold text-on-surface">{formatPercentage(grossMargin)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Delivery Log Card */}
                        <div className="rounded-2xl border border-outline-variant bg-white p-6">
                            <h3 className="mb-4 text-lg font-bold text-on-surface">Receipt Delivery</h3>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    setFormStatus(null);
                                    receiptForm.post(route('transactions.receipts.store', transaction.id), {
                                        onSuccess: () => {
                                            setFormStatus('success');
                                            receiptForm.reset();
                                        },
                                        onError: () => {
                                            setFormStatus('error');
                                        },
                                    });
                                }}
                                className="space-y-3"
                            >
                                <SelectInput
                                    value={receiptForm.data.channel}
                                    onChange={(event) => receiptForm.setData('channel', event.target.value)}
                                    disabled={receiptForm.processing}
                                    className="w-full rounded-xl border-2 border-outline-variant bg-white px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
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
                                    placeholder="Email or WhatsApp"
                                    disabled={receiptForm.processing}
                                    className="w-full rounded-xl border-2 border-outline-variant bg-white px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                                />
                                {formStatus === 'success' && (
                                    <p className="text-xs text-green-600 font-medium">
                                        Receipt delivery logged successfully!
                                    </p>
                                )}
                                {formStatus === 'error' && (
                                    <p className="text-xs text-red-600 font-medium">
                                        Failed to log delivery. Please try again.
                                    </p>
                                )}
                                {!canSendDigitalReceipts && (
                                    <p className="text-xs text-amber-600">
                                        Connected digital delivery requires the Business plan.
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={receiptForm.processing}
                                    className="touch-target w-full rounded-xl bg-surface-container px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-high active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {receiptForm.processing ? 'Logging...' : 'Log Delivery'}
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
            </PosLayout>
            </div>
        </>
    );
}
