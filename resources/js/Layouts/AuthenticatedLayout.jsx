import AppSidebar from '@/Components/AppSidebar';
import PwaInstallPrompt from '@/Components/PwaInstallPrompt';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, subscription } = usePage().props;
    const user = auth.user;
    const roleName = user?.role?.name ?? 'Unassigned';
    const initials = useMemo(
        () =>
            (user?.name || 'K')
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase(),
        [user?.name],
    );
    const navItems = [
        user?.abilities?.checkout && {
            label: 'POS',
            routeName: 'pos.index',
            matches: ['pos.index', 'pos.success'],
            icon: 'M4 6h16M4 12h16M4 18h16',
        },
        user?.abilities?.dashboard && {
            label: 'Dashboard',
            routeName: 'dashboard',
            matches: ['dashboard'],
            icon: 'M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-10h8V3h-8v8z',
        },
        user?.abilities?.catalog && {
            label: 'Products',
            routeName: 'products.index',
            matches: ['products.index'],
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
        },
        user?.abilities?.catalog && {
            label: 'Categories',
            routeName: 'categories.index',
            matches: ['categories.index'],
            icon: 'M7 7h10M7 12h6m-6 5h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z',
        },
        user?.abilities?.catalog && {
            label: 'Inventory',
            routeName: 'inventory.index',
            matches: ['inventory.index'],
            icon: 'M4 7h16M4 12h16M4 17h16',
        },
        user?.abilities?.transactions && {
            label: 'Transactions',
            routeName: 'transactions.index',
            matches: ['transactions.index', 'transactions.show'],
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        },
        user?.abilities?.reports && {
            label: 'Reports',
            routeName: 'reports.index',
            matches: ['reports.index'],
            icon: 'M9 17v-6m4 6V7m4 10v-3M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z',
        },
        user?.abilities?.settings && {
            label: 'Settings',
            routeName: 'settings.index',
            matches: ['settings.index'],
            icon: 'M10.325 4.317a1 1 0 011.35-.936l.566.226a1 1 0 00.758 0l.566-.226a1 1 0 011.35.936l.093.615a1 1 0 00.57.746l.552.276a1 1 0 01.447 1.341l-.248.574a1 1 0 000 .791l.248.574a1 1 0 01-.447 1.341l-.552.276a1 1 0 00-.57.746l-.093.615a1 1 0 01-1.35.936l-.566-.226a1 1 0 00-.758 0l-.566.226a1 1 0 01-1.35-.936l-.093-.615a1 1 0 00-.57-.746l-.552-.276a1 1 0 01-.447-1.341l.248-.574a1 1 0 000-.791l-.248-.574a1 1 0 01.447-1.341l.552-.276a1 1 0 00.57-.746l.093-.615z M12 15.5A3.5 3.5 0 1012 8.5a3.5 3.5 0 000 7z',
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
        const updateViewport = () => {
            const tabletUp = window.innerWidth >= 768;

            setIsDesktop(tabletUp);

            if (tabletUp) {
                setIsDrawerOpen(false);
            }
        };

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

    const sidebarNavigation = navItems.map((item) => ({
        key: item.routeName,
        name: item.label,
        href: route(item.routeName),
        icon: item.icon,
        active: item.matches.some((pattern) => route().current(pattern)),
    }));

    const sidebarFooterItems = [
        {
            key: 'profile',
            name: 'Profile',
            href: route('profile.edit'),
            icon: 'M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z',
        },
        {
            key: 'logout',
            name: 'Log out',
            href: route('logout'),
            method: 'post',
            as: 'button',
            icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
        },
    ];

    const sidebarActionLabel = isDesktop
        ? isSidebarCollapsed
            ? 'Expand sidebar'
            : 'Collapse sidebar'
        : 'Close sidebar';

    return (
        <div className="h-dvh overflow-hidden bg-surface text-on-surface">
            <PwaInstallPrompt />

            <div className="flex h-full min-h-0">
                <div
                    className={`fixed inset-0 z-40 bg-surface-variant/50 backdrop-blur-sm transition md:hidden ${
                        isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                    onClick={() => setIsDrawerOpen(false)}
                />

                <AppSidebar
                    className={`fixed inset-y-0 left-0 z-50 h-dvh w-72 shadow-lg transition-transform md:static md:h-full md:shrink-0 md:translate-x-0 md:shadow-none ${
                        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                    } ${isSidebarCollapsed ? 'md:w-24' : 'md:w-72'}`}
                    brandHref={route('dashboard')}
                    initials={initials}
                    brandTitle="Kasira"
                    brandSubtitle="Back office"
                    userName={user?.name}
                    roleName={roleName}
                    planName={subscription?.plan}
                    navigation={sidebarNavigation}
                    footerItems={sidebarFooterItems}
                    collapsed={isSidebarCollapsed}
                    responsiveLabels={false}
                    onNavigate={() => setIsDrawerOpen(false)}
                    headerAction={(
                        <button
                            type="button"
                            onClick={() =>
                                isDesktop
                                    ? setIsSidebarCollapsed((value) => !value)
                                    : setIsDrawerOpen(false)
                            }
                            aria-label={sidebarActionLabel}
                            title={sidebarActionLabel}
                            className="touch-target inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={
                                        isDesktop
                                            ? isSidebarCollapsed
                                                ? 'M9 5l7 7-7 7'
                                                : 'M15 19l-7-7 7-7'
                                            : 'M6 6l12 12M18 6L6 18'
                                    }
                                />
                            </svg>
                            <span className="sr-only">{sidebarActionLabel}</span>
                        </button>
                    )}
                />

                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <div className="touch-scroll flex-1 overflow-x-hidden overflow-y-auto">
                        {!isOnline && (
                            <div className="safe-area-x bg-secondary-container px-md py-sm text-body-md font-medium text-on-secondary-container">
                                Offline mode: cached pages stay available, but sync and network actions wait for reconnection.
                            </div>
                        )}

                        <div className="safe-area-top sticky top-0 z-30 border-b border-outline-variant bg-surface-container-lowest/90 backdrop-blur">
                            <div className="safe-area-x flex flex-col gap-4 px-md py-md lg:px-lg">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsDrawerOpen(true)}
                                            className="touch-target rounded-xl border border-outline-variant px-4 py-2 text-label-bold text-on-surface-variant md:hidden"
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

                                    {user?.abilities?.checkout && (
                                        <Link
                                            href={route('pos.index')}
                                            className="touch-target inline-flex items-center justify-center rounded-full border border-outline px-lg py-sm text-label-bold text-on-surface transition hover:border-outline-variant hover:bg-surface-container"
                                        >
                                            Open POS
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {header && (
                            <header className="safe-area-x px-md py-6 lg:px-lg">{header}</header>
                        )}

                        <main className="safe-area-x safe-area-bottom px-md pb-24 lg:px-lg">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
