import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export default function PosLayout({ title, subtitle, actions, children }) {
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

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
                <header className="rounded-[2rem] border border-white/10 bg-white/5 px-4 py-4 shadow-2xl shadow-slate-950/30 backdrop-blur md:px-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-sm font-semibold text-emerald-200">
                                {initials}
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                    Kasira POS
                                </p>
                                <h1 className="mt-1 text-xl font-semibold text-white">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="mt-1 text-sm text-slate-300">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                                {auth.user?.role?.name}
                            </span>
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                                {subscription?.plan}
                            </span>
                            <Link
                                href={route('dashboard')}
                                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
                            >
                                Back office
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
                            >
                                Log out
                            </Link>
                        </div>
                    </div>
                    {actions && <div className="mt-4">{actions}</div>}
                </header>

                <main className="mt-4 flex-1">{children}</main>
            </div>
        </div>
    );
}
