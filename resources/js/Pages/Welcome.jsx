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

            <div className="min-h-screen bg-slate-950 text-slate-100">
                <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
                    <header className="flex items-center justify-between gap-4 py-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                                Kasira
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                                Modern POS foundation for small to medium businesses.
                            </p>
                        </div>

                        <nav className="flex items-center gap-3 text-sm">
                            {canLogin && (
                                <Link
                                    href={route('login')}
                                    className="rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                                >
                                    Log in
                                </Link>
                            )}

                            {canRegister && !auth.user && (
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-white px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-200"
                                >
                                    Register
                                </Link>
                            )}
                        </nav>
                    </header>

                    <main className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                                Laravel + Inertia + React
                            </div>
                            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Kasira is ready for the first real POS workflows.
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                                The application shell, authentication flow, and business roles are now in place so checkout, inventory, and reporting can be built on a stable foundation.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Link
                                    href={primaryHref}
                                    className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
                                >
                                    {primaryLabel}
                                </Link>

                                {canRegister && !auth.user && (
                                    <Link
                                        href={route('register')}
                                        className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                                    >
                                        Create first account
                                    </Link>
                                )}
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                {pillars.map((pillar) => (
                                    <div
                                        key={pillar.title}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                                    >
                                        <h2 className="text-sm font-semibold text-white">
                                            {pillar.title}
                                        </h2>
                                        <p className="mt-3 text-sm leading-6 text-slate-300">
                                            {pillar.body}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur">
                            <div className="rounded-[1.5rem] bg-slate-900 p-6 ring-1 ring-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                                            Access model
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold text-white">
                                            MVP business roles
                                        </h2>
                                    </div>
                                    <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                                        Protected app
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    {roles.map((role) => (
                                        <div
                                            key={role}
                                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"
                                        >
                                            <span className="font-medium text-white">
                                                {role}
                                            </span>
                                            <span className="text-sm text-slate-400">
                                                Ready for assignment
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 rounded-2xl bg-white/5 p-4 text-sm leading-6 text-slate-300">
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
