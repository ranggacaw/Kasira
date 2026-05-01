import PwaInstallPrompt from '@/Components/PwaInstallPrompt';
import SelectInput from '@/Components/SelectInput';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function PosLayout({
    title,
    children,
    cart,
    currentOutlet,
    outlets = [],
    onOutletChange,
    currentShift,
}) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        const setOnline = () => setIsOnline(true);
        const setOffline = () => setIsOnline(false);

        handleFullscreenChange();
        setIsOnline(window.navigator.onLine);

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOffline);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('online', setOnline);
            window.removeEventListener('offline', setOffline);
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

    const isShiftOpen = !!currentShift;

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-surface text-on-surface">
            <PwaInstallPrompt />

            {!isOnline && (
                <div className="safe-area-x bg-secondary-container px-4 py-3 text-sm font-medium text-on-secondary-container">
                    Offline mode: cached pages stay available, but payment sync and live receipt actions wait for reconnection.
                </div>
            )}

            {/* Section: Compact Header */}
            <header className="safe-area-top sticky top-0 z-30 border-b border-outline-variant bg-surface-container-lowest/95 backdrop-blur">
                <div className="safe-area-x flex items-center justify-between gap-3 px-4 py-3">
                    {/* Left: Outlet + Shift */}
                    <div className="flex items-center gap-2 min-w-0">
                        {outlets.length > 0 ? (
                            <SelectInput
                                value={currentOutlet}
                                onChange={(e) => onOutletChange?.(e.target.value)}
                                className="rounded-full border border-outline-variant bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface"
                            >
                                {outlets.map((outlet) => (
                                    <option key={outlet.id} value={outlet.id}>
                                        {outlet.name}
                                    </option>
                                ))}
                            </SelectInput>
                        ) : (
                            <span className="rounded-full bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface">
                                {currentOutlet?.name || title}
                            </span>
                        )}

                        {currentShift && (
                            <span className="rounded-full bg-secondary-container px-3 py-2 text-xs font-semibold text-on-secondary-container">
                                Shift {isShiftOpen ? 'open' : 'closed'}
                            </span>
                        )}
                    </div>

                    {/* Section: Icon Nav */}
                    <div className="flex items-center gap-1">
                        <Link
                            href={route('dashboard')}
                            className="touch-target flex h-11 w-11 items-center justify-center rounded-xl border border-outline bg-surface-container-lowest text-on-surface-variant transition hover:bg-surface-container md:hidden"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M13 6l6 6-6 6" />
                            </svg>
                        </Link>
                        <Link
                            href={route('transactions.index')}
                            className="touch-target hidden h-11 w-11 items-center justify-center rounded-xl border border-outline bg-surface-container-lowest text-on-surface-variant transition hover:bg-surface-container md:flex"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </Link>
                        <button
                            type="button"
                            onClick={handleFullscreenToggle}
                            className="touch-target flex h-11 w-11 items-center justify-center rounded-xl border border-outline bg-surface-container-lowest text-on-surface-variant transition hover:bg-surface-container"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Section: Title Row */}
                <div className="px-4 pb-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        Cashier workspace
                    </p>
                    <h1 className="text-xl font-semibold text-on-surface sm:text-2xl">
                        {title}
                    </h1>
                </div>
            </header>

            {/* Section: Main Content */}
            <main className={`min-h-0 flex-1 flex flex-col pb-20 md:pb-0`}>
                <div className="flex flex-1 flex-col md:flex-row min-h-0">
                    <div className="min-w-0 flex-1 flex flex-col overflow-y-auto">
                        {children}
                    </div>

                    {cart && (
                        /* Section: Cart Panel — Tablet+ */
                        <aside className="hidden md:order-last md:flex md:w-[40rem] md:flex-col md:border-l md:border-outline-variant md:bg-surface-container-lowest">
                            {cart}
                        </aside>
                    )}
                </div>
            </main>

            {cart && (
                /* Section: Bottom Cart Bar — Mobile */
                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant bg-surface-container-lowest shadow-[-4px_20px_rgba(0,0,0,0.1)] md:hidden">
                    <div className="safe-area-x flex h-[72px] items-center justify-between gap-3 px-4">
                        <Link
                            href={route('transactions.index')}
                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-on-primary"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.4 5M17 13l2.4 5M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                        </Link>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-on-surface-variant truncate">{title} • View cart</p>
                        </div>
                        <Link
                            href={route('transactions.index')}
                            className="touch-target flex h-14 max-w-48 flex-1 items-center justify-center rounded-2xl bg-primary text-base font-bold text-on-primary shadow-lg shadow-primary/30"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}