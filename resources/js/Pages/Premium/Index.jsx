import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

export default function PremiumIndex({
    subscription,
    features,
    usage,
    profitability,
    paymentBreakdown,
    cashierPerformance,
    topProducts,
    lowStockAlerts,
    recentPromotions,
    recentVouchers,
    recentShifts,
    canManagePremium,
    outlets,
    selectedOutletId,
    filters,
}) {
    const flash = usePage().props.flash || {};

    const promotionForm = useForm({
        outlet_id: '',
        name: '',
        type: 'percentage',
        value: '',
        minimum_spend: 0,
        starts_at: '',
        ends_at: '',
        is_active: true,
    });

    const voucherForm = useForm({
        outlet_id: '',
        code: '',
        type: 'fixed',
        value: '',
        minimum_spend: 0,
        max_uses: '',
        starts_at: '',
        ends_at: '',
        is_active: true,
    });

    const subscriptionForm = useForm({
        plan: subscription.plan,
        status: subscription.status,
        billing_email: subscription.billing_email || '',
        auto_renews: subscription.auto_renews,
    });

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-on-surface">
                        Reports and premium workflows
                    </h2>
                    <p className="mt-1 text-sm text-outline">
                        Sales, products, payments, cashier performance, and gated premium commerce workflows.
                    </p>
                </div>
            }
        >
            <Head title="Reports" />

            <div className="space-y-6 py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-container px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                        <div className="grid gap-3 md:grid-cols-4">
                            <select
                                value={selectedOutletId || ''}
                                onChange={(event) =>
                                    router.get(route('reports.index'), {
                                        outlet: event.target.value,
                                        date_from: filters.date_from,
                                        date_to: filters.date_to,
                                    })
                                }
                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                            >
                                {outlets.map((outlet) => (
                                    <option key={outlet.id} value={outlet.id}>
                                        {outlet.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(event) =>
                                    router.get(route('reports.index'), {
                                        outlet: selectedOutletId,
                                        date_from: event.target.value,
                                        date_to: filters.date_to,
                                    })
                                }
                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                            />
                            <input
                                type="date"
                                value={filters.date_to}
                                onChange={(event) =>
                                    router.get(route('reports.index'), {
                                        outlet: selectedOutletId,
                                        date_from: filters.date_from,
                                        date_to: event.target.value,
                                    })
                                }
                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                            />
                            <Link
                                href={route('reports.export', { outlet: selectedOutletId })}
                                className="rounded-full bg-on-surface px-4 py-3 text-center text-sm font-semibold text-white"
                            >
                                Export current report
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            ['Current plan', subscription.plan],
                            ['Revenue', formatCurrency(profitability.revenue)],
                            ['COGS', formatCurrency(profitability.cogs)],
                            ['Profit', formatCurrency(profitability.profit)],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant"
                            >
                                <p className="text-xs uppercase tracking-wide text-outline">
                                    {label}
                                </p>
                                <p className="mt-2 text-lg font-semibold text-on-surface">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                        <div className="space-y-6">
                            <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                            Reporting entitlements
                                        </h3>
                                        <p className="mt-1 text-sm text-outline">
                                            Export sales, review COGS, and monitor premium usage.
                                        </p>
                                    </div>
                                    {features.includes('exports') ? (
                                        <Link
                                            href={route('reports.export')}
                                            className="rounded-full bg-on-surface px-4 py-2 text-sm font-semibold text-white"
                                        >
                                            Export CSV
                                        </Link>
                                    ) : (
                                        <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
                                            Upgrade required
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {features.length > 0 ? (
                                        features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="rounded-full bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface-variant"
                                            >
                                                {feature}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-outline">
                                            Starter plan active. Premium reporting and commerce workflows are gated.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                        Payment report
                                    </h3>
                                    <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
                                        {paymentBreakdown.map((entry) => (
                                            <div
                                                key={entry.method}
                                                className="rounded-xl border border-outline-variant p-4"
                                            >
                                                <p className="font-medium text-on-surface">
                                                    {entry.method}
                                                </p>
                                                <p className="mt-1 text-outline">
                                                    {entry.transaction_count} transactions
                                                </p>
                                                <p className="mt-2 text-xs uppercase tracking-wide text-tertiary">
                                                    {formatCurrency(entry.total_amount)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                        Cashier report
                                    </h3>
                                    <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
                                        {cashierPerformance.map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="rounded-xl border border-outline-variant p-4"
                                            >
                                                <p className="font-medium text-on-surface">
                                                    {entry.name}
                                                </p>
                                                <p className="mt-1 text-outline">
                                                    {entry.transaction_count} transactions
                                                </p>
                                                <p className="mt-2 text-xs uppercase tracking-wide text-tertiary">
                                                    {formatCurrency(entry.revenue)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                        Product report
                                    </h3>
                                    <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
                                        {topProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="rounded-xl border border-outline-variant p-4"
                                            >
                                                <p className="font-medium text-on-surface">
                                                    {product.name}
                                                </p>
                                                <p className="mt-1 text-outline">
                                                    {product.quantity_sold} sold
                                                </p>
                                                <p className="mt-2 text-xs uppercase tracking-wide text-tertiary">
                                                    {formatCurrency(product.revenue)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                        Inventory report
                                    </h3>
                                    <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
                                        {lowStockAlerts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="rounded-xl border border-secondary-fixed-dim bg-secondary-container p-4"
                                            >
                                                <p className="font-medium text-on-surface">
                                                    {product.name}
                                                </p>
                                                <p className="mt-1 text-outline">
                                                    Stock {product.stock_quantity} / minimum {product.minimum_stock}
                                                </p>
                                                <p className="mt-2 text-xs uppercase tracking-wide text-on-secondary-container">
                                                    {product.outlet?.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {canManagePremium && (
                                <>
                                    <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                            Promotions
                                        </h3>
                                        <form
                                            className="mt-4 grid gap-3 md:grid-cols-2"
                                            onSubmit={(event) => {
                                                event.preventDefault();
                                                promotionForm.post(route('premium.promotions.store'));
                                            }}
                                        >
                                            <select
                                                value={promotionForm.data.outlet_id}
                                                onChange={(event) =>
                                                    promotionForm.setData('outlet_id', event.target.value)
                                                }
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            >
                                                <option value="">All outlets</option>
                                                {outlets.map((outlet) => (
                                                    <option key={outlet.id} value={outlet.id}>
                                                        {outlet.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                value={promotionForm.data.name}
                                                onChange={(event) =>
                                                    promotionForm.setData('name', event.target.value)
                                                }
                                                placeholder="Promotion name"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <select
                                                value={promotionForm.data.type}
                                                onChange={(event) =>
                                                    promotionForm.setData('type', event.target.value)
                                                }
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            >
                                                <option value="percentage">Percentage</option>
                                                <option value="fixed">Fixed</option>
                                            </select>
                                            <input
                                                type="number"
                                                value={promotionForm.data.value}
                                                onChange={(event) =>
                                                    promotionForm.setData('value', event.target.value)
                                                }
                                                placeholder="Value"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <input
                                                type="number"
                                                value={promotionForm.data.minimum_spend}
                                                onChange={(event) =>
                                                    promotionForm.setData('minimum_spend', event.target.value)
                                                }
                                                placeholder="Minimum spend"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="date"
                                                    value={promotionForm.data.starts_at}
                                                    onChange={(event) =>
                                                        promotionForm.setData('starts_at', event.target.value)
                                                    }
                                                    className="rounded-xl border border-outline px-3 py-2 text-sm"
                                                />
                                                <input
                                                    type="date"
                                                    value={promotionForm.data.ends_at}
                                                    onChange={(event) =>
                                                        promotionForm.setData('ends_at', event.target.value)
                                                    }
                                                    className="rounded-xl border border-outline px-3 py-2 text-sm"
                                                />
                                            </div>
                                            <button className="rounded-full bg-on-surface px-4 py-3 text-sm font-semibold text-white md:col-span-2">
                                                Save promotion
                                            </button>
                                        </form>
                                    </div>

                                    <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                            Vouchers
                                        </h3>
                                        <form
                                            className="mt-4 grid gap-3 md:grid-cols-2"
                                            onSubmit={(event) => {
                                                event.preventDefault();
                                                voucherForm.post(route('premium.vouchers.store'));
                                            }}
                                        >
                                            <input
                                                value={voucherForm.data.code}
                                                onChange={(event) =>
                                                    voucherForm.setData('code', event.target.value)
                                                }
                                                placeholder="Voucher code"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <select
                                                value={voucherForm.data.outlet_id}
                                                onChange={(event) =>
                                                    voucherForm.setData('outlet_id', event.target.value)
                                                }
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            >
                                                <option value="">All outlets</option>
                                                {outlets.map((outlet) => (
                                                    <option key={outlet.id} value={outlet.id}>
                                                        {outlet.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                value={voucherForm.data.type}
                                                onChange={(event) =>
                                                    voucherForm.setData('type', event.target.value)
                                                }
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            >
                                                <option value="fixed">Fixed</option>
                                                <option value="percentage">Percentage</option>
                                            </select>
                                            <input
                                                type="number"
                                                value={voucherForm.data.value}
                                                onChange={(event) =>
                                                    voucherForm.setData('value', event.target.value)
                                                }
                                                placeholder="Value"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <input
                                                type="number"
                                                value={voucherForm.data.minimum_spend}
                                                onChange={(event) =>
                                                    voucherForm.setData('minimum_spend', event.target.value)
                                                }
                                                placeholder="Minimum spend"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <input
                                                type="number"
                                                value={voucherForm.data.max_uses}
                                                onChange={(event) =>
                                                    voucherForm.setData('max_uses', event.target.value)
                                                }
                                                placeholder="Max uses"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <button className="rounded-full bg-on-surface px-4 py-3 text-sm font-semibold text-white md:col-span-2">
                                                Save voucher
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                    Current usage
                                </h3>
                                <p className="mt-4 text-sm text-on-surface-variant">
                                    {usage.activeUsers} active users of {subscription.user_limit}
                                </p>
                                <p className="mt-2 text-sm text-on-surface-variant">
                                    {usage.activeOutlets} active outlets of {subscription.outlet_limit}
                                </p>
                            </div>

                            <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                    Recent commerce foundations
                                </h3>
                                <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
                                    {recentPromotions.map((promotion) => (
                                        <div key={`promotion-${promotion.id}`} className="rounded-xl border border-outline-variant p-4">
                                            <p className="font-medium text-on-surface">
                                                {promotion.name}
                                            </p>
                                            <p className="text-outline">
                                                {promotion.outlet?.name || 'All outlets'}
                                            </p>
                                        </div>
                                    ))}
                                    {recentVouchers.map((voucher) => (
                                        <div key={`voucher-${voucher.id}`} className="rounded-xl border border-outline-variant p-4">
                                            <p className="font-medium text-on-surface">
                                                {voucher.code}
                                            </p>
                                            <p className="text-outline">
                                                Used {voucher.used_count} times
                                            </p>
                                        </div>
                                    ))}
                                    {recentShifts.map((shift) => (
                                        <div key={`shift-${shift.id}`} className="rounded-xl border border-outline-variant p-4">
                                            <p className="font-medium text-on-surface">
                                                {shift.user?.name}
                                            </p>
                                            <p className="text-outline">
                                                {shift.outlet?.name} • {shift.status}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {canManagePremium && (
                                <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                        Billing and subscription
                                    </h3>
                                    <form
                                        className="mt-4 space-y-3"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            subscriptionForm.patch(route('premium.subscription.update'));
                                        }}
                                    >
                                        <select
                                            value={subscriptionForm.data.plan}
                                            onChange={(event) =>
                                                subscriptionForm.setData('plan', event.target.value)
                                            }
                                            className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                        >
                                            <option value="Starter">Starter</option>
                                            <option value="Pro">Pro</option>
                                            <option value="Business">Business</option>
                                        </select>
                                        <input
                                            value={subscriptionForm.data.status}
                                            onChange={(event) =>
                                                subscriptionForm.setData('status', event.target.value)
                                            }
                                            placeholder="Status"
                                            className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                        />
                                        <input
                                            type="email"
                                            value={subscriptionForm.data.billing_email}
                                            onChange={(event) =>
                                                subscriptionForm.setData('billing_email', event.target.value)
                                            }
                                            placeholder="Billing email"
                                            className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                        />
                                        <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                                            <input
                                                type="checkbox"
                                                checked={subscriptionForm.data.auto_renews}
                                                onChange={(event) =>
                                                    subscriptionForm.setData('auto_renews', event.target.checked)
                                                }
                                            />
                                            Auto renew subscription
                                        </label>
                                        <button className="rounded-full bg-tertiary-container0 px-4 py-3 text-sm font-semibold text-white">
                                            Update subscription
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
