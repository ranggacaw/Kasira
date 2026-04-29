import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

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
    recentPromotions,
    recentVouchers,
    recentShifts,
    canManagePremium,
    outlets,
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
                    <h2 className="text-xl font-semibold leading-tight text-slate-900">
                        Premium extensions
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage plan entitlements, reporting exports, promotions, vouchers, and shift visibility.
                    </p>
                </div>
            }
        >
            <Head title="Premium" />

            <div className="space-y-6 py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            ['Current plan', subscription.plan],
                            ['Revenue', formatCurrency(profitability.revenue)],
                            ['COGS', formatCurrency(profitability.cogs)],
                            ['Profit', formatCurrency(profitability.profit)],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
                            >
                                <p className="text-xs uppercase tracking-wide text-slate-400">
                                    {label}
                                </p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                        <div className="space-y-6">
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                            Reporting entitlements
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Export sales, review COGS, and monitor premium usage.
                                        </p>
                                    </div>
                                    {features.includes('exports') ? (
                                        <Link
                                            href={route('premium.reports.export')}
                                            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                                        >
                                            Export CSV
                                        </Link>
                                    ) : (
                                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                            Upgrade required
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {features.length > 0 ? (
                                        features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                                            >
                                                {feature}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">
                                            Starter plan active. Premium reporting and commerce workflows are gated.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {canManagePremium && (
                                <>
                                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
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
                                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
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
                                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                            />
                                            <select
                                                value={promotionForm.data.type}
                                                onChange={(event) =>
                                                    promotionForm.setData('type', event.target.value)
                                                }
                                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
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
                                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                            />
                                            <input
                                                type="number"
                                                value={promotionForm.data.minimum_spend}
                                                onChange={(event) =>
                                                    promotionForm.setData('minimum_spend', event.target.value)
                                                }
                                                placeholder="Minimum spend"
                                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="date"
                                                    value={promotionForm.data.starts_at}
                                                    onChange={(event) =>
                                                        promotionForm.setData('starts_at', event.target.value)
                                                    }
                                                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                                />
                                                <input
                                                    type="date"
                                                    value={promotionForm.data.ends_at}
                                                    onChange={(event) =>
                                                        promotionForm.setData('ends_at', event.target.value)
                                                    }
                                                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                                />
                                            </div>
                                            <button className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white md:col-span-2">
                                                Save promotion
                                            </button>
                                        </form>
                                    </div>

                                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
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
                                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                            />
                                            <select
                                                value={voucherForm.data.outlet_id}
                                                onChange={(event) =>
                                                    voucherForm.setData('outlet_id', event.target.value)
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
                                                value={voucherForm.data.type}
                                                onChange={(event) =>
                                                    voucherForm.setData('type', event.target.value)
                                                }
                                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
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
                                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                            />
                                            <input
                                                type="number"
                                                value={voucherForm.data.minimum_spend}
                                                onChange={(event) =>
                                                    voucherForm.setData('minimum_spend', event.target.value)
                                                }
                                                placeholder="Minimum spend"
                                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                            />
                                            <input
                                                type="number"
                                                value={voucherForm.data.max_uses}
                                                onChange={(event) =>
                                                    voucherForm.setData('max_uses', event.target.value)
                                                }
                                                placeholder="Max uses"
                                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                            />
                                            <button className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white md:col-span-2">
                                                Save voucher
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Current usage
                                </h3>
                                <p className="mt-4 text-sm text-slate-600">
                                    {usage.activeUsers} active users of {subscription.user_limit}
                                </p>
                                <p className="mt-2 text-sm text-slate-600">
                                    {usage.activeOutlets} active outlets of {subscription.outlet_limit}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Recent commerce foundations
                                </h3>
                                <div className="mt-4 space-y-3 text-sm text-slate-600">
                                    {recentPromotions.map((promotion) => (
                                        <div key={`promotion-${promotion.id}`} className="rounded-2xl border border-slate-200 p-4">
                                            <p className="font-medium text-slate-900">
                                                {promotion.name}
                                            </p>
                                            <p className="text-slate-500">
                                                {promotion.outlet?.name || 'All outlets'}
                                            </p>
                                        </div>
                                    ))}
                                    {recentVouchers.map((voucher) => (
                                        <div key={`voucher-${voucher.id}`} className="rounded-2xl border border-slate-200 p-4">
                                            <p className="font-medium text-slate-900">
                                                {voucher.code}
                                            </p>
                                            <p className="text-slate-500">
                                                Used {voucher.used_count} times
                                            </p>
                                        </div>
                                    ))}
                                    {recentShifts.map((shift) => (
                                        <div key={`shift-${shift.id}`} className="rounded-2xl border border-slate-200 p-4">
                                            <p className="font-medium text-slate-900">
                                                {shift.user?.name}
                                            </p>
                                            <p className="text-slate-500">
                                                {shift.outlet?.name} • {shift.status}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {canManagePremium && (
                                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
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
                                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
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
                                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                        />
                                        <input
                                            type="email"
                                            value={subscriptionForm.data.billing_email}
                                            onChange={(event) =>
                                                subscriptionForm.setData('billing_email', event.target.value)
                                            }
                                            placeholder="Billing email"
                                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                        />
                                        <label className="flex items-center gap-2 text-sm text-slate-600">
                                            <input
                                                type="checkbox"
                                                checked={subscriptionForm.data.auto_renews}
                                                onChange={(event) =>
                                                    subscriptionForm.setData('auto_renews', event.target.checked)
                                                }
                                            />
                                            Auto renew subscription
                                        </label>
                                        <button className="rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white">
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
