import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function SettingsIndex({ settings, paymentMethods, subscription, usage }) {
    const page = usePage();
    const flash = page.props.flash || {};
    const currentSection = new URLSearchParams(String(page.url || '').split('?')[1] || '').get('section');
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
    const marginForm = useForm({
        default_minimum_product_margin: settings.default_minimum_product_margin || 20,
    });
    const checkoutDefaultsForm = useForm({
        default_checkout_tax_rate: settings.default_checkout_tax_rate || 0,
    });
    const pwaForm = useForm({
        pwa_name: settings.pwa_name || '',
        pwa_short_name: settings.pwa_short_name || '',
        pwa_theme_color: settings.pwa_theme_color || '#0f172a',
        pwa_description: settings.pwa_description || '',
    });

    useEffect(() => {
        const targetId = currentSection === 'business'
            ? 'business-section'
            : currentSection === 'checkout-defaults'
              ? 'checkout-defaults-section'
              : null;

        if (!targetId) {
            return;
        }

        window.requestAnimationFrame(() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, [currentSection]);

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
                    <h2 className="text-headline-md text-on-surface">Settings</h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Business identity, receipt content, pricing guardrails, manual payment methods, and PWA appearance.
                    </p>
                </div>
            }
        >
            <Head title="Settings" />

            <div className="space-y-6 pb-24">
                {flash.success && (
                    <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-fixed-dim px-4 py-3 text-body-md text-on-tertiary-fixed">
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
                            className="rounded-xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant"
                        >
                            <p className="text-xs uppercase tracking-wide text-outline">{label}</p>
                            <p className="mt-2 text-lg font-semibold text-on-surface">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <form
                        className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant"
                        onSubmit={(event) => {
                            event.preventDefault();
                            marginForm.patch(route('settings.margins.update'));
                        }}
                    >
                        <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">Product margin default</h3>
                        <div className="mt-5 space-y-4">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={marginForm.data.default_minimum_product_margin}
                                onChange={(event) =>
                                    marginForm.setData('default_minimum_product_margin', event.target.value)
                                }
                                placeholder="20"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <p className="text-sm text-on-surface-variant">
                                Products without their own override use this gross margin threshold for low-margin warnings.
                            </p>
                        </div>
                        <button className="mt-5 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90">
                            Save default margin
                        </button>
                    </form>

                    <form
                        id="checkout-defaults-section"
                        className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant"
                        onSubmit={(event) => {
                            event.preventDefault();
                            checkoutDefaultsForm.patch(route('settings.checkout-defaults.update'));
                        }}
                    >
                        <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">Checkout defaults</h3>
                        <div className="mt-5 space-y-4">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={checkoutDefaultsForm.data.default_checkout_tax_rate}
                                onChange={(event) =>
                                    checkoutDefaultsForm.setData('default_checkout_tax_rate', event.target.value)
                                }
                                placeholder="0"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <p className="text-sm text-on-surface-variant">
                                New POS sales start with this tax percentage, while cashiers can still adjust the rate per sale.
                            </p>
                        </div>
                        <button className="mt-5 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90">
                            Save checkout defaults
                        </button>
                    </form>

                    <form
                        id="business-section"
                        className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant"
                        onSubmit={(event) => {
                            event.preventDefault();
                            businessForm.patch(route('settings.business.update'));
                        }}
                    >
                        <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">Business identity</h3>
                        <div className="mt-5 space-y-4">
                            <input
                                value={businessForm.data.business_name}
                                onChange={(event) =>
                                    businessForm.setData('business_name', event.target.value)
                                }
                                placeholder="Business name"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <input
                                value={businessForm.data.business_phone}
                                onChange={(event) =>
                                    businessForm.setData('business_phone', event.target.value)
                                }
                                placeholder="Phone number"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <textarea
                                value={businessForm.data.business_address}
                                onChange={(event) =>
                                    businessForm.setData('business_address', event.target.value)
                                }
                                placeholder="Business address"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <input
                                value={businessForm.data.logo_path}
                                onChange={(event) =>
                                    businessForm.setData('logo_path', event.target.value)
                                }
                                placeholder="Logo path"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    value={businessForm.data.currency}
                                    onChange={(event) =>
                                        businessForm.setData('currency', event.target.value)
                                    }
                                    placeholder="Currency"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                                <input
                                    value={businessForm.data.timezone}
                                    onChange={(event) =>
                                        businessForm.setData('timezone', event.target.value)
                                    }
                                    placeholder="Timezone"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                            </div>
                        </div>
                        <button className="mt-5 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90">
                            Save business settings
                        </button>
                    </form>

                    <form
                        className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant"
                        onSubmit={(event) => {
                            event.preventDefault();
                            receiptForm.patch(route('settings.receipt.update'));
                        }}
                    >
                        <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">Receipt configuration</h3>
                        <div className="mt-5 space-y-4">
                            <textarea
                                value={receiptForm.data.receipt_header}
                                onChange={(event) =>
                                    receiptForm.setData('receipt_header', event.target.value)
                                }
                                placeholder="Receipt header"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <textarea
                                value={receiptForm.data.receipt_footer}
                                onChange={(event) =>
                                    receiptForm.setData('receipt_footer', event.target.value)
                                }
                                placeholder="Receipt footer"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <label className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface-variant">
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
                            <label className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface-variant">
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
                        <button className="mt-5 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90">
                            Save receipt settings
                        </button>
                    </form>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <form
                        className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant"
                        onSubmit={(event) => {
                            event.preventDefault();
                            paymentForm.patch(route('settings.payments.update'));
                        }}
                    >
                        <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">Manual payment methods</h3>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => togglePaymentMethod(method)}
                                    className={`rounded-xl border px-4 py-3 text-left text-body-md font-medium transition ${
                                        paymentForm.data.enabled_payment_methods.includes(method)
                                            ? 'border-tertiary-fixed-dim bg-tertiary-fixed-dim text-on-tertiary-fixed'
                                            : 'border-outline-variant bg-surface-container-low text-on-surface-variant'
                                    }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                        <button className="mt-5 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90">
                            Save payment methods
                        </button>
                    </form>

                    <form
                        className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant"
                        onSubmit={(event) => {
                            event.preventDefault();
                            pwaForm.patch(route('settings.pwa.update'));
                        }}
                    >
                        <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">PWA appearance</h3>
                        <div className="mt-5 space-y-4">
                            <input
                                value={pwaForm.data.pwa_name}
                                onChange={(event) => pwaForm.setData('pwa_name', event.target.value)}
                                placeholder="App name"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <input
                                value={pwaForm.data.pwa_short_name}
                                onChange={(event) =>
                                    pwaForm.setData('pwa_short_name', event.target.value)
                                }
                                placeholder="Short name"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <input
                                value={pwaForm.data.pwa_theme_color}
                                onChange={(event) =>
                                    pwaForm.setData('pwa_theme_color', event.target.value)
                                }
                                placeholder="#0f172a"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <textarea
                                value={pwaForm.data.pwa_description}
                                onChange={(event) =>
                                    pwaForm.setData('pwa_description', event.target.value)
                                }
                                placeholder="PWA description"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                        </div>
                        <button className="mt-5 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90">
                            Save PWA settings
                        </button>
                    </form>
                </div>

                <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">Operational administration</h3>
                            <p className="mt-1 text-body-md text-on-surface-variant">
                                Existing outlet, staff, and customer administration stays available during the route transition.
                            </p>
                        </div>
                        <Link
                            href={route('operations.index')}
                            className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant"
                        >
                            Open legacy operations tools
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
