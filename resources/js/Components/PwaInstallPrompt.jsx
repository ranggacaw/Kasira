import { useEffect, useMemo, useState } from 'react';

const DISMISS_KEY = 'kasira.install-prompt.dismissed';

const isStandaloneDisplay = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

export default function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [showManualIosHint, setShowManualIosHint] = useState(false);
    const [isPhoneOrTablet, setIsPhoneOrTablet] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);

    useEffect(() => {
        const displayModeMedia = window.matchMedia('(display-mode: standalone)');
        const userAgent = window.navigator.userAgent;
        const isIos = /iphone|ipad|ipod/i.test(userAgent);
        const isSafari = /safari/i.test(userAgent) && !/crios|fxios|edgios|opr\//i.test(userAgent);

        const syncState = () => {
            setIsStandalone(isStandaloneDisplay());
            setIsPhoneOrTablet(window.innerWidth < 1280);
            setShowManualIosHint(isIos && isSafari && !isStandaloneDisplay());
        };

        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
        };

        const handleAppInstalled = () => {
            window.sessionStorage.removeItem(DISMISS_KEY);
            setDeferredPrompt(null);
            setIsInstalling(false);
            syncState();
        };

        syncState();
        setIsDismissed(window.sessionStorage.getItem(DISMISS_KEY) === '1');

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        window.addEventListener('resize', syncState);

        if (displayModeMedia.addEventListener) {
            displayModeMedia.addEventListener('change', syncState);
        } else if (displayModeMedia.addListener) {
            displayModeMedia.addListener(syncState);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('resize', syncState);

            if (displayModeMedia.removeEventListener) {
                displayModeMedia.removeEventListener('change', syncState);
            } else if (displayModeMedia.removeListener) {
                displayModeMedia.removeListener(syncState);
            }
        };
    }, []);

    const message = useMemo(() => {
        if (deferredPrompt) {
            return 'Install Kasira for faster launch, cleaner standalone spacing, and tablet-ready access from the home screen.';
        }

        return 'On iPhone or iPad, open the browser share menu and choose Add to Home Screen to install Kasira.';
    }, [deferredPrompt]);

    if (isStandalone || isDismissed || !isPhoneOrTablet || (!deferredPrompt && !showManualIosHint)) {
        return null;
    }

    const dismissPrompt = () => {
        window.sessionStorage.setItem(DISMISS_KEY, '1');
        setIsDismissed(true);
    };

    const handleInstall = async () => {
        if (!deferredPrompt) {
            return;
        }

        setIsInstalling(true);
        deferredPrompt.prompt();

        const choiceResult = await deferredPrompt.userChoice.catch(() => null);

        if (choiceResult?.outcome !== 'accepted') {
            setIsInstalling(false);
        }

        setDeferredPrompt(null);
    };

    return (
        <div
            className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 sm:px-6"
            style={{ paddingBottom: 'calc(var(--safe-bottom) + 1rem)' }}
        >
            <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest/95 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        Install Kasira
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant sm:text-body-md">
                        {message}
                    </p>
                </div>

                <div className="flex items-center gap-2 sm:flex-shrink-0">
                    {deferredPrompt ? (
                        <button
                            type="button"
                            onClick={handleInstall}
                            disabled={isInstalling}
                            className="touch-target rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-60"
                        >
                            {isInstalling ? 'Opening...' : 'Install app'}
                        </button>
                    ) : null}
                    <button
                        type="button"
                        onClick={dismissPrompt}
                        className="touch-target rounded-full border border-outline px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container"
                    >
                        Not now
                    </button>
                </div>
            </div>
        </div>
    );
}
