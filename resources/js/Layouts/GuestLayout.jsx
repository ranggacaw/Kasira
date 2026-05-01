import ApplicationLogo from '@/Components/ApplicationLogo';
import PwaInstallPrompt from '@/Components/PwaInstallPrompt';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen overflow-x-hidden bg-surface text-on-surface">
            <PwaInstallPrompt />

            <div className="safe-area-y safe-area-x mx-auto grid min-h-screen w-full max-w-6xl gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
                <div className="flex flex-col justify-between rounded-[2rem] bg-primary px-6 py-8 text-on-primary shadow-xl shadow-primary/10 sm:px-8 sm:py-10">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-4">
                            <ApplicationLogo className="h-14 w-14 fill-current text-on-primary" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-on-primary/70">
                                    Kasira
                                </p>
                                <p className="text-lg font-semibold text-on-primary">
                                    Operations workspace
                                </p>
                            </div>
                        </Link>

                        <div className="mt-10 max-w-md space-y-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-on-primary/70">
                                Installable PWA
                            </p>
                            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                                Run sales, stock, and team workflows from one touch-ready shell.
                            </h1>
                            <p className="text-base leading-7 text-on-primary/80 sm:text-lg">
                                Kasira is built for phone and tablet use across back-office operations and the cashier counter.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 pt-8 sm:grid-cols-3">
                        {[
                            ['Fast sign-in', 'Touch-sized fields and actions'],
                            ['Safe layout', 'No horizontal overflow on mobile'],
                            ['Install flow', 'Ready for supported browsers'],
                        ].map(([title, body]) => (
                            <div
                                key={title}
                                className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur"
                            >
                                <p className="text-sm font-semibold text-on-primary">{title}</p>
                                <p className="mt-2 text-sm leading-6 text-on-primary/75">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-center pb-20 lg:pb-0">
                    <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-lowest px-5 py-6 shadow-xl shadow-slate-900/5 ring-1 ring-outline-variant sm:px-8 sm:py-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
