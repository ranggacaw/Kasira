import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;
    const role = user.role?.name ?? 'Unassigned';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-slate-900">
                            Operations dashboard
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            The Kasira foundation is ready for checkout,
                            inventory, and reporting modules.
                        </p>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        {role}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
                        <div className="overflow-hidden rounded-2xl bg-slate-900 p-8 text-white shadow-sm">
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">
                                Welcome back
                            </p>
                            <h3 className="mt-4 text-3xl font-semibold">
                                {user.name}
                            </h3>
                            <p className="mt-3 max-w-2xl text-sm text-slate-300">
                                You are signed in as {role}. This protected area
                                now has the auth and role context needed to gate
                                future POS workflows.
                            </p>
                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                {[
                                    ['Checkout', 'Ready for POS flow'],
                                    ['Inventory', 'Ready for catalog work'],
                                    ['Reports', 'Ready for daily insights'],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                                    >
                                        <p className="text-xs uppercase tracking-wide text-slate-400">
                                            {label}
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-white">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Account context
                                </h3>
                                <dl className="mt-4 space-y-4 text-sm text-slate-600">
                                    <div>
                                        <dt className="text-slate-400">Name</dt>
                                        <dd className="mt-1 font-medium text-slate-900">
                                            {user.name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400">Email</dt>
                                        <dd className="mt-1 font-medium text-slate-900">
                                            {user.email}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400">Role</dt>
                                        <dd className="mt-1 font-medium text-slate-900">
                                            {role}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Next implementation slices
                                </h3>
                                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                                    <li>Cart, tax, discounts, and payment capture</li>
                                    <li>Product, category, and stock movement CRUD</li>
                                    <li>Transaction history and daily dashboard metrics</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
