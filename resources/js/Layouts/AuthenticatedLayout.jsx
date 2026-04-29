import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, subscription } = usePage().props;
    const user = auth.user;
    const roleName = user?.role?.name ?? 'Unassigned';
    const navItems = [
        user?.abilities?.checkout && {
            label: 'POS',
            routeName: 'pos.index',
            matches: ['pos.index', 'pos.success'],
        },
        user?.abilities?.dashboard && {
            label: 'Dashboard',
            routeName: 'dashboard',
            matches: ['dashboard'],
        },
        user?.abilities?.catalog && {
            label: 'Products',
            routeName: 'products.index',
            matches: ['products.index'],
        },
        user?.abilities?.catalog && {
            label: 'Categories',
            routeName: 'categories.index',
            matches: ['categories.index'],
        },
        user?.abilities?.catalog && {
            label: 'Inventory',
            routeName: 'inventory.index',
            matches: ['inventory.index'],
        },
        user?.abilities?.transactions && {
            label: 'Transactions',
            routeName: 'transactions.index',
            matches: ['transactions.index', 'transactions.show'],
        },
        user?.abilities?.reports && {
            label: 'Reports',
            routeName: 'reports.index',
            matches: ['reports.index'],
        },
        user?.abilities?.settings && {
            label: 'Settings',
            routeName: 'settings.index',
            matches: ['settings.index'],
        },
    ].filter(Boolean);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        setIsOnline(window.navigator.onLine);
        setIsDesktop(window.innerWidth >= 768);

        const setOnline = () => setIsOnline(true);
        const setOffline = () => setIsOnline(false);
        const updateViewport = () => setIsDesktop(window.innerWidth >= 768);

        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOffline);
        window.addEventListener('resize', updateViewport);

        return () => {
            window.removeEventListener('online', setOnline);
            window.removeEventListener('offline', setOffline);
            window.removeEventListener('resize', updateViewport);
        };
    }, []);

    const activeRoute = useMemo(
        () =>
            navItems.find((item) =>
                item.matches.some((pattern) => route().current(pattern)),
            )?.label,
        [navItems],
    );

    const renderNavItems = (compact = false) =>
        navItems.map((item) => {
            const active = item.matches.some((pattern) => route().current(pattern));

            return (
                <Link
                    key={item.routeName}
                    href={route(item.routeName)}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`flex items-center rounded-xl px-lg py-sm text-label-bold transition ${
                        active
                            ? 'bg-primary-container text-on-primary-container shadow-sm'
                            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    } ${compact ? 'justify-center px-base' : ''}`}
                >
                    <span className={compact ? 'sr-only' : ''}>{item.label}</span>
                    {compact && <span>{item.label.slice(0, 1)}</span>}
                </Link>
            );
        });

    return (
        <div className="min-h-screen bg-surface">
            <div className="flex min-h-screen">
                <div
                    className={`fixed inset-0 z-40 bg-surface-variant/40 transition md:hidden ${
                        isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                    onClick={() => setIsDrawerOpen(false)}
                />

                <aside
                    className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-outline-variant bg-surface-container-lowest px-md py-md shadow-lg transition-transform md:sticky md:translate-x-0 ${
                        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                    } ${isSidebarCollapsed ? 'md:w-24' : 'md:w-72'}`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <Link href={route('dashboard')} className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-10 text-primary" />
                            {!isSidebarCollapsed && (
                                <div>
                                    <div className="text-label-bold uppercase tracking-[0.24em] text-on-surface">
                                        Kasira
                                    </div>
                                    <div className="text-body-md text-on-surface-variant">
                                        Back office
                                    </div>
                                </div>
                            )}
                        </Link>

                        <button
                            type="button"
                            onClick={() =>
                                isDesktop
                                    ? setIsSidebarCollapsed((value) => !value)
                                    : setIsDrawerOpen(false)
                            }
                            className="rounded-xl border border-outline-variant px-sm py-xs text-label-bold text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface"
                        >
                            {isDesktop ? 'Collapse' : 'Close'}
                        </button>
                    </div>

                    <div className="mt-md rounded-xl bg-inverse-surface px-md py-md text-inverse-on-surface">
                        <p className="text-label-bold uppercase tracking-[0.24em] text-outline-variant">
                            Signed in
                        </p>
                        {!isSidebarCollapsed && (
                            <>
                                <h2 className="mt-2 text-headline-md">{user.name}</h2>
                                <p className="mt-1 text-body-md text-surface-variant">{user.email}</p>
                            </>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-surface-variant/20 px-sm py-xs text-label-bold text-inverse-on-surface">
                                {roleName}
                            </span>
                            {!isSidebarCollapsed && (
                                <span className="rounded-full bg-tertiary/20 px-sm py-xs text-label-bold text-tertiary-fixed-dim">
                                    {subscription?.plan}
                                </span>
                            )}
                        </div>
                    </div>

                    <nav className="mt-md flex-1 space-y-2 overflow-y-auto">
                        {renderNavItems(isSidebarCollapsed)}
                    </nav>

                    <div className="space-y-2 border-t border-outline-variant pt-md">
                        <Link
                            href={route('profile.edit')}
                            className="flex rounded-xl px-lg py-sm text-label-bold text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface"
                        >
                            {isSidebarCollapsed ? 'P' : 'Profile'}
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full rounded-xl px-lg py-sm text-left text-label-bold text-error transition hover:bg-error-container"
                        >
                            {isSidebarCollapsed ? 'O' : 'Log out'}
                        </Link>
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    {!isOnline && (
                        <div className="bg-secondary-container px-md py-sm text-body-md font-medium text-on-secondary-container">
                            Offline mode: cached pages stay available, but sync and network actions wait for reconnection.
                        </div>
                    )}

                    <div className="sticky top-0 z-30 border-b border-outline-variant bg-surface-container-lowest/90 backdrop-blur">
                        <div className="flex items-center justify-between gap-4 px-md py-md lg:px-lg">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsDrawerOpen(true)}
                                    className="rounded-xl border border-outline-variant px-sm py-xs text-label-bold text-on-surface-variant md:hidden"
                                >
                                    Menu
                                </button>
                                <div>
                                    <p className="text-label-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                        Back office
                                    </p>
                                    <p className="text-headline-md text-on-surface">
                                        {activeRoute || 'Workspace'}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={route('pos.index')}
                                className="rounded-full border border-outline px-lg py-sm text-label-bold text-on-surface transition hover:border-outline-variant hover:bg-surface-container"
                            >
                                Open POS
                            </Link>
                        </div>
                    </div>

                    {header && (
                        <header className="px-md py-6 lg:px-lg">{header}</header>
                    )}

                    <main className="px-md pb-10 lg:px-lg">{children}</main>
                </div>
            </div>
        </div>
    );
}
