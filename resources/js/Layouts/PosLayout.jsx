import AppSidebar from '@/Components/AppSidebar';
import SelectInput from '@/Components/SelectInput';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

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
    const [isFullscreen, setIsFullscreen] = useState(false);

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

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        handleFullscreenChange();
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const handleFullscreenToggle = async () => {
        if (typeof document === 'undefined') {
            return;
        }

        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                return;
            }

            await document.documentElement.requestFullscreen();
        } catch (error) {
            console.error('Unable to toggle fullscreen mode.', error);
        }
    };

    const navigation = [
        { name: 'New Sale', href: route('pos.index'), icon: 'M4 6h16M4 12h16M4 18h16', key: 'new-sale', active: activeNav === 'new-sale' },
        { name: 'Transactions', href: route('transactions.index'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', key: 'transactions', active: activeNav === 'transactions' },
        ...(canManageCatalog ? [{ name: 'Products', href: route('products.index'), icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', key: 'products', active: activeNav === 'products' }] : []),
        { name: 'Customers', href: route('operations.index'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', key: 'customers', active: activeNav === 'customers' },
    ];

    const footerItems = [
        {
            key: 'logout',
            name: 'Log out',
            href: route('logout'),
            method: 'post',
            as: 'button',
            icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
        },
    ];

    const shiftBalance = currentShift?.closing_balance || 0;
    const isShiftOpen = !!currentShift;

    return (
        <div className="flex h-screen overflow-hidden bg-surface">
            {/* Sidebar */}
            {!isFullscreen && (
                <AppSidebar
                    className="w-20 flex-shrink-0 lg:w-64"
                    brandHref={route('pos.index')}
                    initials={initials}
                    brandTitle="Kasira"
                    brandSubtitle="Point of Sale"
                    userName={auth.user?.name}
                    roleName={auth.user?.role?.name}
                    planName={subscription?.plan}
                    navigation={navigation}
                    footerItems={footerItems}
                />
            )}

            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-hidden">
                {/* Header Bar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-white px-6">
                    <div className="flex items-center gap-4">
                        {outlets.length > 0 ? (
                            <SelectInput
                                value={currentOutlet}
                                onChange={(e) => onOutletChange?.(e.target.value)}
                                className="rounded-lg border border-outline-variant bg-surface-container px-4 py-2 text-sm font-medium text-on-surface"
                            >
                                {outlets.map((outlet) => (
                                    <option key={outlet.id} value={outlet.id}>
                                        {outlet.name}
                                    </option>
                                ))}
                            </SelectInput>
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
                        <button
                            type="button"
                            onClick={handleFullscreenToggle}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-on-surface transition hover:bg-surface-container hover:text-primary"
                        >
                            {isFullscreen ? 'Exit full size' : 'Full size'}
                        </button>
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
