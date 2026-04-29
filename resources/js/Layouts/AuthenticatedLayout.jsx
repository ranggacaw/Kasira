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
                    className={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        active
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    } ${compact ? 'justify-center px-2' : ''}`}
                >
                    <span className={compact ? 'sr-only' : ''}>{item.label}</span>
                    {compact && <span>{item.label.slice(0, 1)}</span>}
                </Link>
            );
        });

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="flex min-h-screen">
                <div
                    className={`fixed inset-0 z-40 bg-slate-950/40 transition md:hidden ${
                        isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                    onClick={() => setIsDrawerOpen(false)}
                />

                <aside
                    className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white px-4 py-4 shadow-2xl transition-transform md:sticky md:translate-x-0 ${
                        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                    } ${isSidebarCollapsed ? 'md:w-24' : 'md:w-72'}`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <Link href={route('dashboard')} className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-10 text-slate-900" />
                            {!isSidebarCollapsed && (
                                <div>
                                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                                        Kasira
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Mobile back office
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
                            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            {isDesktop ? 'Collapse' : 'Close'}
                        </button>
                    </div>

                    <div className="mt-6 rounded-[1.75rem] bg-slate-950 px-4 py-4 text-white">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                            Signed in
                        </p>
                        {!isSidebarCollapsed && (
                            <>
                                <h2 className="mt-2 text-lg font-semibold">{user.name}</h2>
                                <p className="mt-1 text-sm text-slate-300">{user.email}</p>
                            </>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                                {roleName}
                            </span>
                            {!isSidebarCollapsed && (
                                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                                    {subscription?.plan}
                                </span>
                            )}
                        </div>
                    </div>

                    <nav className="mt-6 flex-1 space-y-2 overflow-y-auto">
                        {renderNavItems(isSidebarCollapsed)}
                    </nav>

                    <div className="space-y-2 border-t border-slate-200 pt-4">
                        <Link
                            href={route('profile.edit')}
                            className="flex rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            {isSidebarCollapsed ? 'P' : 'Profile'}
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                            {isSidebarCollapsed ? 'O' : 'Log out'}
                        </Link>
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    {!isOnline && (
                        <div className="bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
                            Offline mode: cached pages stay available, but sync and network actions wait for reconnection.
                        </div>
                    )}

                    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
                        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsDrawerOpen(true)}
                                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-500 md:hidden"
                                >
                                    Menu
                                </button>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                                        Back office
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {activeRoute || 'Workspace'}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={route('pos.index')}
                                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                                Open POS
                            </Link>
                        </div>
                    </div>

                    {header && (
                        <header className="px-4 py-6 sm:px-6 lg:px-8">{header}</header>
                    )}

                    <main className="px-4 pb-10 sm:px-6 lg:px-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
