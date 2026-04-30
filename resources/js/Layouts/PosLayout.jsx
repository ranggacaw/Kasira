import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

const NavigationItem = ({ icon, label, href, active }) => (
    <Link
        href={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
            active
                ? 'bg-primary text-white'
                : 'text-on-surface-variant hover:bg-surface-container'
        }`}
    >
        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
        </svg>
        <span className="hidden lg:block text-sm font-medium">{label}</span>
    </Link>
);

export default function PosLayout({
    title,
    subtitle,
    actions,
    children,
    cart,
    currentOutlet,
    outlets = [],
    onOutletChange,
    currentShift,
    activeNav = 'new-sale',
}) {
    const { auth, subscription } = usePage().props;

    const initials = useMemo(
        () =>
            (auth.user?.name || 'K')
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase(),
        [auth.user?.name],
    );

    const formatCurrency = (value) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value || 0);

    const canManageCatalog = auth.user?.abilities?.catalog ?? false;

    const navigation = [
        { name: 'New Sale', href: route('pos.index'), icon: 'M4 6h16M4 12h16M4 18h16', key: 'new-sale' },
        { name: 'Transactions', href: route('transactions.index'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', key: 'transactions' },
        ...(canManageCatalog ? [{ name: 'Products', href: route('products.index'), icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', key: 'products' }] : []),
        { name: 'Customers', href: route('operations.index'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', key: 'customers' },
    ];

    const shiftBalance = currentShift?.closing_balance || 0;
    const isShiftOpen = !!currentShift;

    return (
        <div className="flex h-screen overflow-hidden bg-surface">
            {/* Sidebar */}
            <aside className="flex w-20 flex-col flex-shrink-0 overflow-hidden border-r border-outline-variant bg-white lg:w-64">
                {/* Logo Area */}
                <div className="border-b border-outline-variant p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container text-label-bold text-on-primary-container">
                            {initials}
                        </div>
                        <div className="hidden overflow-hidden lg:block">
                            <p className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-primary">Kasira</p>
                            <p className="whitespace-nowrap text-sm font-semibold text-on-surface">Point of Sale</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="border-b border-outline-variant p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-bold text-on-primary-container">
                            {initials}
                        </div>
                        <div className="hidden min-w-0 flex-1 overflow-hidden lg:block">
                            <p className="truncate text-sm font-semibold text-on-surface">{auth.user?.name}</p>
                            <div className="mt-0.5 flex items-center gap-2">
                                <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-semibold text-on-secondary-container">
                                    {auth.user?.role?.name}
                                </span>
                                <span className="rounded-full bg-tertiary-container px-2 py-0.5 text-[10px] font-semibold text-on-tertiary">
                                    {subscription?.plan}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {navigation.map((item) => (
                        <NavigationItem
                            key={item.key}
                            icon={item.icon}
                            label={item.name}
                            href={item.href}
                            active={activeNav === item.key}
                        />
                    ))}
                </nav>

                {/* Logout */}
                <div className="border-t border-outline-variant p-4">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-on-surface-variant hover:bg-surface-container transition"
                    >
                        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="hidden whitespace-nowrap lg:block text-sm font-medium">Log out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-hidden">
                {/* Header Bar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-white px-6">
                    <div className="flex items-center gap-4">
                        {outlets.length > 0 ? (
                            <select
                                value={currentOutlet}
                                onChange={(e) => onOutletChange?.(e.target.value)}
                                className="rounded-lg border border-outline-variant bg-surface-container px-4 py-2 text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {outlets.map((outlet) => (
                                    <option key={outlet.id} value={outlet.id}>
                                        {outlet.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className="text-sm text-on-surface-variant">
                                {title}
                            </span>
                        )}
                        {currentShift && (
                            <span className="hidden text-xs text-on-surface-variant sm:inline">
                                Shift: {isShiftOpen ? 'Open' : 'Closed'} • {formatCurrency(shiftBalance)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative rounded-lg p-2 hover:bg-surface-container transition">
                            <svg className="h-5 w-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                        </button>
                        <Link href={route('transactions.index')} className="text-sm font-medium text-on-surface hover:text-primary transition">
                            View receipts
                        </Link>
                    </div>
                </header>

                {/* Actions Bar */}
                {actions && (
                    <div className="flex shrink-0 items-center gap-3 border-outline-variant bg-surface-container-low">
                        {actions}
                    </div>
                )}

                {/* Page Content */}
                <div className={`flex flex-1 overflow-hidden ${cart ? '' : ''}`}>
                    {/* Left: Main Content Area */}
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>

                    {/* Right: Cart Panel */}
                    {cart && (
                        <aside className="flex w-[28rem] flex-shrink-0 flex-col border-l border-outline-variant bg-white">
                            {cart}
                        </aside>
                    )}
                </div>
            </main>
        </div>
    );
}