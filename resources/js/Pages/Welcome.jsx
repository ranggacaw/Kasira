import { Head, Link } from '@inertiajs/react';

const pillars = [
    {
        title: 'Checkout flow',
        body: 'Fast cart handling, taxes, discounts, and multi-method payment capture.',
    },
    {
        title: 'Inventory control',
        body: 'Product, category, stock movement, and low-stock monitoring in one baseline.',
    },
    {
        title: 'Daily reporting',
        body: 'Revenue, transaction counts, and top sellers built for owner visibility.',
    },
];

const roles = ['Owner', 'Admin', 'Cashier'];

export default function Welcome({ auth, canLogin, canRegister }) {
    const primaryHref = auth.user ? route('dashboard') : route('login');
    const primaryLabel = auth.user ? 'Open dashboard' : 'Sign in';

    return (
        <>
            <Head title="Kasira" />

            <div className="min-h-screen bg-surface text-on-surface">
                <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
                    <header className="flex items-center justify-between gap-4 py-4">
                        <div>
                            <p className="text-label-bold uppercase text-primary">
                                Kasira
                            </p>
                            <p className="mt-2 text-body-md text-on-surface-variant">
                                Modern POS foundation for small to medium businesses.
                            </p>
                        </div>

                        <nav className="flex items-center gap-3 text-sm">
                            {canLogin && (
                                <Link
                                    href={route('login')}
                                    className="rounded-full border border-outline px-4 py-2 text-on-surface transition hover:border-outline-variant hover:bg-surface-container"
                                >
                                    Log in
                                </Link>
                            )}

                            {canRegister && !auth.user && (
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-primary px-4 py-2 font-medium text-on-primary transition hover:bg-primary-container hover:text-on-primary-container"
                                >
                                    Register
                                </Link>
                            )}
                        </nav>
                    </header>

                    <main className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <div className="inline-flex rounded-full border border-outline-variant bg-surface-container-high px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                                Laravel + Inertia + React
                            </div>
                            <h1 className="mt-6 max-w-3xl text-display-lg text-on-surface">
                                Kasira is ready for the first real POS workflows.
                            </h1>
                            <p className="mt-6 max-w-2xl text-body-lg text-on-surface-variant">
                                The application shell, authentication flow, and business roles are now in place so checkout, inventory, and reporting can be built on a stable foundation.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Link
                                    href={primaryHref}
                                    className="rounded-full bg-primary px-5 py-3 text-label-bold text-on-primary transition hover:bg-primary-container hover:text-on-primary-container"
                                >
                                    {primaryLabel}
                                </Link>

                                {canRegister && !auth.user && (
                                    <Link
                                        href={route('register')}
                                        className="rounded-full border border-outline px-5 py-3 text-label-bold text-on-surface transition hover:bg-surface-container"
                                    >
                                        Create first account
                                    </Link>
                                )}
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                {pillars.map((pillar) => (
                                    <div
                                        key={pillar.title}
                                        className="rounded-xl border border-outline-variant bg-surface-container p-5"
                                    >
                                        <h2 className="text-label-bold text-on-surface">
                                            {pillar.title}
                                        </h2>
                                        <p className="mt-3 text-body-md text-on-surface-variant">
                                            {pillar.body}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-lg">
                            <div className="rounded-xl bg-surface-container-low p-6 ring-1 ring-outline-variant">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-label-bold uppercase text-on-surface-variant">
                                            Access model
                                        </p>
                                        <h2 className="mt-2 text-headline-md text-on-surface">
                                            MVP business roles
                                        </h2>
                                    </div>
                                    <div className="rounded-full bg-primary-container px-3 py-1 text-xs font-medium text-on-primary-container">
                                        Protected app
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    {roles.map((role) => (
                                        <div
                                            key={role}
                                            className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface px-4 py-3"
                                        >
                                            <span className="font-medium text-on-surface">
                                                {role}
                                            </span>
                                            <span className="text-sm text-on-surface-variant">
                                                Ready for assignment
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 rounded-lg bg-surface p-4 text-body-md text-on-surface-variant">
                                    Seeded demo users are created for local development so you can move straight into feature work after the PostgreSQL database is configured.
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
