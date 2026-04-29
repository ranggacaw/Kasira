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
        <div className="min-h-screen bg-surface">
            <div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col px-md pb-lg pt-md">
                <header className="rounded-xl border border-outline-variant bg-surface-container-lowest px-md py-md shadow-lg md:px-lg">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container text-label-bold text-on-primary-container">
                                {initials}
                            </div>
                            <div>
                                <p className="text-label-bold uppercase tracking-[0.24em] text-primary">
                                    Kasira POS
                                </p>
                                <h1 className="mt-1 text-headline-md text-on-surface">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="mt-1 text-body-md text-on-surface-variant">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-outline-variant bg-surface-container px-sm py-xs text-label-bold text-on-surface-variant">
                                {auth.user?.role?.name}
                            </span>
                            <span className="rounded-full border border-tertiary-fixed-dim bg-tertiary-container px-sm py-xs text-label-bold text-tertiary-fixed">
                                {subscription?.plan}
                            </span>
                            <Link
                                href={route('dashboard')}
                                className="rounded-full border border-outline-variant bg-surface-container-low px-lg py-sm text-label-bold text-on-surface transition hover:bg-surface-container hover:border-outline"
                            >
                                Back office
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="rounded-full border border-outline-variant px-lg py-sm text-label-bold text-on-surface-variant transition hover:border-outline hover:text-on-surface hover:bg-surface-container"
                            >
                                Log out
                            </Link>
                        </div>
                    </div>
                    {actions && <div className="mt-md">{actions}</div>}
                </header>

                <main className="mt-md flex-1">{children}</main>
            </div>
        </div>
    );
}
