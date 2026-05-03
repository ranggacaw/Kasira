import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

const toArray = (value) => (Array.isArray(value) ? value : []);

const toNumber = (value) => {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(toNumber(value));

const formatDateTime = (value) => {
    if (!value) {
        return 'Not available';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

const formatFeatureLabel = (feature) =>
    String(feature || '')
        .split('_')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

const getUsageWidth = (used, limit) => {
    const safeLimit = toNumber(limit);

    if (safeLimit <= 0) {
        return 0;
    }

    return Math.min((toNumber(used) / safeLimit) * 100, 100);
};

const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
};

const MetricCard = ({ label, value, variant = 'default' }) => (
    <div className="rounded-xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant">
        <p className="text-xs uppercase tracking-wide text-outline">{label}</p>
        <p className={`mt-2 text-lg font-semibold ${variant === 'highlight' ? 'text-on-tertiary-container' : 'text-on-surface'}`}>
            {value}
        </p>
    </div>
);

const ReportCard = ({ title, children, action, sectionId }) => (
    <section id={sectionId} className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">{title}</h3>
            {action}
        </div>
        {children}
    </section>
);

const ListItem = ({ label, sublabel, amount, variant = 'default' }) => (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${variant === 'alert' ? 'border-error/30 bg-error-container/30' : 'border-outline-variant'}`}>
        <div>
            <p className="font-medium text-on-surface">{label}</p>
            <p className={`text-sm ${variant === 'alert' ? 'text-error' : 'text-outline'}`}>{sublabel}</p>
        </div>
        <p className={`text-base font-semibold ${variant === 'alert' ? 'text-error' : 'text-on-surface'}`}>{amount}</p>
    </div>
);

const QuickAction = ({ icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 hover:bg-surface-container-low transition-colors text-on-surface font-medium text-sm"
    >
        {icon}
        {label}
    </button>
);

const EmptyState = ({ message }) => (
    <div className="rounded-xl border border-dashed border-outline-variant px-4 py-6 text-center text-sm text-outline">
        {message}
    </div>
);

export default function PremiumIndex({
    subscription = {},
    features = [],
    usage = {},
    profitability = {},
    paymentBreakdown = [],
    cashierPerformance = [],
    topProducts = [],
    lowStockAlerts = [],
    recentPromotions = [],
    recentVouchers = [],
    recentShifts = [],
    canManagePremium = false,
    outlets = [],
    selectedOutletId,
    filters = {},
}) {
    const page = usePage();
    const flash = page.props.flash || {};
    const currentSection = new URLSearchParams(String(page.url || '').split('?')[1] || '').get('section');
    const subscriptionPlan = subscription?.plan || 'Starter';
    const userLimit = toNumber(subscription?.user_limit);
    const outletLimit = toNumber(subscription?.outlet_limit);
    const featureList = toArray(features);
    const outletOptions = toArray(outlets);
    const paymentBreakdownList = toArray(paymentBreakdown);
    const cashierPerformanceList = toArray(cashierPerformance);
    const topProductsList = toArray(topProducts);
    const lowStockAlertsList = toArray(lowStockAlerts);
    const recentPromotionsList = toArray(recentPromotions);
    const recentVouchersList = toArray(recentVouchers);
    const recentShiftsList = toArray(recentShifts);
    const activeUsers = toNumber(usage?.activeUsers);
    const activeOutlets = toNumber(usage?.activeOutlets);
    const activeFilters = {
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
    };
    const hasExports = featureList.includes('exports');

    useEffect(() => {
        if (!currentSection) {
            return;
        }

        window.requestAnimationFrame(() => {
            document.getElementById(currentSection)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, [currentSection]);

    const buildFilterParams = (overrides = {}) => {
        const nextFilters = {
            outlet: selectedOutletId ?? '',
            date_from: activeFilters.date_from,
            date_to: activeFilters.date_to,
            ...overrides,
        };

        return Object.fromEntries(
            Object.entries(nextFilters).filter(([, value]) => value !== '' && value !== null && value !== undefined),
        );
    };

    const updateFilters = (overrides = {}) => {
        router.get(route('reports.index'), buildFilterParams(overrides), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-on-surface">
                            Reports
                        </h2>
                        <p className="mt-1 text-sm text-outline">
                            Sales, products, payments, cashier performance
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Reports" />

            <div className="space-y-6">
                {flash.success && (
                    <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-container px-4 py-3 text-sm text-on-tertiary-container">
                        {flash.success}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={selectedOutletId || ''}
                        onChange={(event) => updateFilters({ outlet: event.target.value })}
                        className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant"
                    >
                        <option value="">All outlets</option>
                        {outletOptions.map((outlet) => (
                            <option key={outlet.id} value={outlet.id}>
                                {outlet.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={activeFilters.date_from}
                        onChange={(event) => updateFilters({ date_from: event.target.value })}
                        className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant"
                    />
                    <input
                        type="date"
                        value={activeFilters.date_to}
                        onChange={(event) => updateFilters({ date_to: event.target.value })}
                        className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant"
                    />
                    <a
                        href={hasExports ? route('reports.export', buildFilterParams()) : '#subscription'}
                        className={`rounded-full px-4 py-2 text-body-md font-semibold transition-colors ${hasExports ? 'bg-primary text-on-primary hover:bg-primary/90' : 'bg-surface-container text-outline'}`}
                    >
                        {hasExports ? 'Export' : 'Export locked'}
                    </a>
                </div>

                {/* Main Layout: Sidebar + Content */}
                <div className="flex gap-6">
                    {/* Sidebar */}
                    {/* <aside className="w-48 shrink-0 hidden lg:block">
                        <nav className="space-y-1 sticky top-4">
                            <a href="#overview" className="block px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm font-medium">
                                Overview
                            </a>
                            <a href="#sales" className="block px-3 py-2 rounded-lg text-on-surface-variant text-sm hover:bg-surface-container-low transition-colors">
                                Sales Report
                            </a>
                            <a href="#products" className="block px-3 py-2 rounded-lg text-on-surface-variant text-sm hover:bg-surface-container-low transition-colors">
                                Products
                            </a>
                            <a href="#payments" className="block px-3 py-2 rounded-lg text-on-surface-variant text-sm hover:bg-surface-container-low transition-colors">
                                Payments
                            </a>
                            <a href="#cashiers" className="block px-3 py-2 rounded-lg text-on-surface-variant text-sm hover:bg-surface-container-low transition-colors">
                                Cashiers
                            </a>
                            <a href="#inventory" className="block px-3 py-2 rounded-lg text-on-surface-variant text-sm hover:bg-surface-container-low transition-colors">
                                Inventory
                            </a>
                            <hr className="my-4 border-outline-variant" />
                            <p className="px-3 text-xs uppercase tracking-wide text-outline mb-2">Commerce</p>
                            <a href="#promotions" className="block px-3 py-2 rounded-lg text-on-surface-variant text-sm hover:bg-surface-container-low transition-colors">
                                Promotions
                            </a>
                            <a href="#vouchers" className="block px-3 py-2 rounded-lg text-on-surface-variant text-sm hover:bg-surface-container-low transition-colors">
                                Vouchers
                            </a>
                            <a href="#shifts" className="block px-3 py-2 rounded-lg text-on-surface-variant text-sm hover:bg-surface-container-low transition-colors">
                                Shifts
                            </a>
                            <hr className="my-4 border-outline-variant" />
                            <a href="#subscription" className="block px-3 py-2 rounded-lg text-on-surface-variant text-sm hover:bg-surface-container-low transition-colors">
                                Subscription
                            </a>
                        </nav>
                    </aside> */}

                    {/* Content */}
                    <div className="flex-1 space-y-6 min-w-0">
                        {/* Metrics */}
                        <div id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <MetricCard label="Current Plan" value={subscriptionPlan} />
                            <MetricCard label="Revenue" value={formatCurrency(profitability?.revenue)} />
                            <MetricCard label="COGS" value={formatCurrency(profitability?.cogs)} />
                            <MetricCard label="Profit" value={formatCurrency(profitability?.profit)} />
                        </div>

                        {/* Reports Grid */}
                        <div className="grid gap-6 xl:grid-cols-2">
                            <ReportCard title="Payment Methods" sectionId="payments">
                                <div className="space-y-3">
                                    {paymentBreakdownList.length > 0 ? (
                                        paymentBreakdownList.map((entry, index) => (
                                            <ListItem
                                                key={entry.method || index}
                                                label={entry.method || 'Unknown method'}
                                                sublabel={`${toNumber(entry.transaction_count)} transactions`}
                                                amount={formatCurrency(entry.total_amount)}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState message="No payments found for the selected filters." />
                                    )}
                                </div>
                            </ReportCard>

                            <ReportCard title="Cashier Performance" sectionId="cashiers">
                                <div className="space-y-3">
                                    {cashierPerformanceList.length > 0 ? (
                                        cashierPerformanceList.map((entry, index) => (
                                            <ListItem
                                                key={entry.id || index}
                                                label={entry.name || 'Unknown cashier'}
                                                sublabel={`${toNumber(entry.transaction_count)} transactions`}
                                                amount={formatCurrency(entry.revenue)}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState message="No cashier activity found for the selected filters." />
                                    )}
                                </div>
                            </ReportCard>

                            <ReportCard title="Top Products" sectionId="products">
                                <div className="space-y-3">
                                    {topProductsList.length > 0 ? (
                                        topProductsList.map((product, index) => (
                                            <ListItem
                                                key={product.id || index}
                                                label={product.name || 'Unnamed product'}
                                                sublabel={`${toNumber(product.quantity_sold)} sold`}
                                                amount={formatCurrency(product.revenue)}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState message="No product sales found for the selected filters." />
                                    )}
                                </div>
                            </ReportCard>

                            <ReportCard title="Low Stock Alerts" sectionId="inventory" action={
                                <span className="rounded-full bg-error-container px-2.5 py-1 text-xs font-semibold text-on-error-container">
                                    {lowStockAlertsList.length} items
                                </span>
                            }>
                                <div className="space-y-3">
                                    {lowStockAlertsList.length > 0 ? (
                                        lowStockAlertsList.map((product, index) => (
                                            <ListItem
                                                key={product.id || index}
                                                label={product.name || 'Unnamed product'}
                                                sublabel={`Stock: ${toNumber(product.stock_quantity)} / Min: ${toNumber(product.minimum_stock)}`}
                                                amount={product.outlet?.name || 'All outlets'}
                                                variant="alert"
                                            />
                                        ))
                                    ) : (
                                        <EmptyState message="No low-stock alerts for the selected outlet." />
                                    )}
                                </div>
                            </ReportCard>
                        </div>

                        {/* Usage & Quick Actions */}
                        <div className="grid gap-6 xl:grid-cols-2">
                            <ReportCard title="Current Usage" sectionId="usage">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-on-surface-variant">Active Users</span>
                                            <span className="font-semibold text-on-surface">{activeUsers} of {userLimit}</span>
                                        </div>
                                        <div className="w-full bg-surface-container rounded-full h-2">
                                            <div
                                                className="bg-on-surface h-2 rounded-full transition-all"
                                                style={{ width: `${getUsageWidth(activeUsers, userLimit)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-on-surface-variant">Active Outlets</span>
                                            <span className="font-semibold text-on-surface">{activeOutlets} of {outletLimit}</span>
                                        </div>
                                        <div className="w-full bg-surface-container rounded-full h-2">
                                            <div
                                                className="bg-on-surface h-2 rounded-full transition-all"
                                                style={{ width: `${getUsageWidth(activeOutlets, outletLimit)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </ReportCard>

                            <ReportCard title="Quick Actions" sectionId="actions">
                                <div className="grid grid-cols-2 gap-3">
                                    <QuickAction
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                        label="Promotions"
                                        onClick={() => scrollToSection('promotions')}
                                    />
                                    <QuickAction
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}
                                        label="Vouchers"
                                        onClick={() => scrollToSection('vouchers')}
                                    />
                                    <QuickAction
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                                        label="Shifts"
                                        onClick={() => scrollToSection('shifts')}
                                    />
                                    {canManagePremium ? (
                                        <QuickAction
                                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                            label="Subscription"
                                            onClick={() => scrollToSection('subscription')}
                                        />
                                    ) : null}
                                </div>
                            </ReportCard>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-3">
                            <ReportCard title="Recent Promotions" sectionId="promotions">
                                <div className="space-y-3">
                                    {recentPromotionsList.length > 0 ? (
                                        recentPromotionsList.map((promotion, index) => (
                                            <ListItem
                                                key={promotion.id || index}
                                                label={promotion.name || 'Unnamed promotion'}
                                                sublabel={`${promotion.outlet?.name || 'All outlets'} • Min. spend ${formatCurrency(promotion.minimum_spend)}`}
                                                amount={promotion.is_active ? 'Active' : 'Inactive'}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState message="No recent promotions available." />
                                    )}
                                </div>
                            </ReportCard>

                            <ReportCard title="Recent Vouchers" sectionId="vouchers">
                                <div className="space-y-3">
                                    {recentVouchersList.length > 0 ? (
                                        recentVouchersList.map((voucher, index) => (
                                            <ListItem
                                                key={voucher.id || index}
                                                label={voucher.code || 'Untitled voucher'}
                                                sublabel={`${voucher.outlet?.name || 'All outlets'} • Min. spend ${formatCurrency(voucher.minimum_spend)}`}
                                                amount={voucher.is_active ? 'Active' : 'Inactive'}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState message="No recent vouchers available." />
                                    )}
                                </div>
                            </ReportCard>

                            <ReportCard title="Recent Shifts" sectionId="shifts">
                                <div className="space-y-3">
                                    {recentShiftsList.length > 0 ? (
                                        recentShiftsList.map((shift, index) => (
                                            <ListItem
                                                key={shift.id || index}
                                                label={shift.user?.name || 'Unknown cashier'}
                                                sublabel={`${shift.outlet?.name || 'Unknown outlet'} • ${formatDateTime(shift.opened_at)} • ${toNumber(shift.sales_summary?.transaction_count)} sales • Expected ${formatCurrency(shift.expected_cash)}`}
                                                amount={shift.status === 'closed' ? `Diff ${formatCurrency(shift.cash_difference)}` : (shift.status || 'Unknown')}
                                                variant={toNumber(shift.cash_difference) !== 0 ? 'alert' : 'default'}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState message="No recent shift activity available." />
                                    )}
                                </div>
                            </ReportCard>
                        </div>

                        {/* Features & Entitlements */}
                        <div id="subscription" className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                        Reporting Entitlements
                                    </h3>
                                    <p className="mt-1 text-sm text-outline">
                                        {featureList.length > 0 ? 'Active premium features' : 'Upgrade for premium reporting'}
                                    </p>
                                </div>
                                {hasExports ? (
                                    <a
                                        href={route('reports.export', buildFilterParams())}
                                        className="rounded-full bg-on-surface px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        Export CSV
                                    </a>
                                ) : (
                                    <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
                                        Upgrade required
                                    </span>
                                )}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {featureList.length > 0 ? (
                                    featureList.map((feature) => (
                                        <span
                                            key={feature}
                                            className="rounded-full bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface-variant"
                                        >
                                            {formatFeatureLabel(feature)}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-outline">
                                        Starter plan active. Premium reporting and commerce workflows are gated.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
