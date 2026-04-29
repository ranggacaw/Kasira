import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function SettingsIndex({ settings, paymentMethods, subscription, usage }) {
    const flash = usePage().props.flash || {};
    const businessForm = useForm({
        business_name: settings.business_name || '',
        business_phone: settings.business_phone || '',
        business_address: settings.business_address || '',
        logo_path: settings.logo_path || '',
        currency: settings.currency || 'IDR',
        timezone: settings.timezone || 'Asia/Jakarta',
    });
    const receiptForm = useForm({
        receipt_header: settings.receipt_header || '',
        receipt_footer: settings.receipt_footer || '',
        show_cashier_on_receipt: settings.show_cashier_on_receipt,
        show_tax_breakdown_on_receipt: settings.show_tax_breakdown_on_receipt,
    });
    const paymentForm = useForm({
        enabled_payment_methods: settings.enabled_payment_methods || paymentMethods,
    });
    const pwaForm = useForm({
        pwa_name: settings.pwa_name || '',
        pwa_short_name: settings.pwa_short_name || '',
        pwa_theme_color: settings.pwa_theme_color || '#0f172a',
        pwa_description: settings.pwa_description || '',
    });

    const togglePaymentMethod = (method) => {
        const next = paymentForm.data.enabled_payment_methods.includes(method)
            ? paymentForm.data.enabled_payment_methods.filter((item) => item !== method)
            : [...paymentForm.data.enabled_payment_methods, method];

        paymentForm.setData('enabled_payment_methods', next);
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Business identity, receipt content, manual payment methods, and PWA appearance.
                    </p>
                </div>
            }
        >
            <Head title="Settings" />

            <div className="space-y-6 pb-24">
                {flash.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[
                        ['Plan', subscription.plan],
                        ['Users', `${usage.activeUsers} / ${subscription.user_limit}`],
                        ['Outlets', `${usage.activeOutlets} / ${subscription.outlet_limit}`],
                        ['Status', subscription.status],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
                        >
                            <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <form
                        className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"
                        onSubmit={(event) => {
                            event.preventDefault();
                            businessForm.patch(route('settings.business.update'));
                        }}
                    >
                        <h3 className="text-lg font-semibold text-slate-900">Business identity</h3>
                        <div className="mt-5 space-y-4">
                            <input
                                value={businessForm.data.business_name}
                                onChange={(event) =>
                                    businessForm.setData('business_name', event.target.value)
                                }
                                placeholder="Business name"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <input
                                value={businessForm.data.business_phone}
                                onChange={(event) =>
                                    businessForm.setData('business_phone', event.target.value)
                                }
                                placeholder="Phone number"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <textarea
                                value={businessForm.data.business_address}
                                onChange={(event) =>
                                    businessForm.setData('business_address', event.target.value)
                                }
                                placeholder="Business address"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <input
                                value={businessForm.data.logo_path}
                                onChange={(event) =>
                                    businessForm.setData('logo_path', event.target.value)
                                }
                                placeholder="Logo path"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    value={businessForm.data.currency}
                                    onChange={(event) =>
                                        businessForm.setData('currency', event.target.value)
                                    }
                                    placeholder="Currency"
                                    className="rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                                />
                                <input
                                    value={businessForm.data.timezone}
                                    onChange={(event) =>
                                        businessForm.setData('timezone', event.target.value)
                                    }
                                    placeholder="Timezone"
                                    className="rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                                />
                            </div>
                        </div>
                        <button className="mt-5 w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                            Save business settings
                        </button>
                    </form>

                    <form
                        className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"
                        onSubmit={(event) => {
                            event.preventDefault();
                            receiptForm.patch(route('settings.receipt.update'));
                        }}
                    >
                        <h3 className="text-lg font-semibold text-slate-900">Receipt configuration</h3>
                        <div className="mt-5 space-y-4">
                            <textarea
                                value={receiptForm.data.receipt_header}
                                onChange={(event) =>
                                    receiptForm.setData('receipt_header', event.target.value)
                                }
                                placeholder="Receipt header"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <textarea
                                value={receiptForm.data.receipt_footer}
                                onChange={(event) =>
                                    receiptForm.setData('receipt_footer', event.target.value)
                                }
                                placeholder="Receipt footer"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={receiptForm.data.show_cashier_on_receipt}
                                    onChange={(event) =>
                                        receiptForm.setData(
                                            'show_cashier_on_receipt',
                                            event.target.checked,
                                        )
                                    }
                                />
                                Show cashier name on receipts
                            </label>
                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={receiptForm.data.show_tax_breakdown_on_receipt}
                                    onChange={(event) =>
                                        receiptForm.setData(
                                            'show_tax_breakdown_on_receipt',
                                            event.target.checked,
                                        )
                                    }
                                />
                                Show tax breakdown on receipts
                            </label>
                        </div>
                        <button className="mt-5 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
                            Save receipt settings
                        </button>
                    </form>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <form
                        className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"
                        onSubmit={(event) => {
                            event.preventDefault();
                            paymentForm.patch(route('settings.payments.update'));
                        }}
                    >
                        <h3 className="text-lg font-semibold text-slate-900">Manual payment methods</h3>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => togglePaymentMethod(method)}
                                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                                        paymentForm.data.enabled_payment_methods.includes(method)
                                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                            : 'border-slate-200 bg-white text-slate-600'
                                    }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                        <button className="mt-5 w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                            Save payment methods
                        </button>
                    </form>

                    <form
                        className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"
                        onSubmit={(event) => {
                            event.preventDefault();
                            pwaForm.patch(route('settings.pwa.update'));
                        }}
                    >
                        <h3 className="text-lg font-semibold text-slate-900">PWA appearance</h3>
                        <div className="mt-5 space-y-4">
                            <input
                                value={pwaForm.data.pwa_name}
                                onChange={(event) => pwaForm.setData('pwa_name', event.target.value)}
                                placeholder="App name"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <input
                                value={pwaForm.data.pwa_short_name}
                                onChange={(event) =>
                                    pwaForm.setData('pwa_short_name', event.target.value)
                                }
                                placeholder="Short name"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <input
                                value={pwaForm.data.pwa_theme_color}
                                onChange={(event) =>
                                    pwaForm.setData('pwa_theme_color', event.target.value)
                                }
                                placeholder="#0f172a"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <textarea
                                value={pwaForm.data.pwa_description}
                                onChange={(event) =>
                                    pwaForm.setData('pwa_description', event.target.value)
                                }
                                placeholder="PWA description"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                        </div>
                        <button className="mt-5 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
                            Save PWA settings
                        </button>
                    </form>
                </div>

                <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Operational administration</h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Existing outlet, staff, and customer administration stays available during the route transition.
                            </p>
                        </div>
                        <Link
                            href={route('operations.index')}
                            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                        >
                            Open legacy operations tools
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
