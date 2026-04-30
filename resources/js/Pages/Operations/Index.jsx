import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectInput from '@/Components/SelectInput';
import { Head, router, useForm, usePage } from '@inertiajs/react';

export default function OperationsIndex({
    canManageOperations,
    canManageCustomers,
    outlets,
    staffUsers,
    roles,
    customers,
    subscription,
    usage,
}) {
    const flash = usePage().props.flash || {};

    const outletForm = useForm({
        name: '',
        code: '',
        address: '',
        is_active: true,
        is_primary: false,
    });

    const userForm = useForm({
        name: '',
        email: '',
        password: '',
        role_id: roles[0]?.id || '',
        outlet_id: outlets[0]?.id || '',
        is_active: true,
    });

    const customerForm = useForm({
        name: '',
        email: '',
        phone: '',
        membership_number: '',
        membership_tier: '',
        membership_discount_rate: 0,
        is_active: true,
    });

    const editCustomer = (customer) => {
        const name = window.prompt('Customer name', customer.name);

        if (!name) {
            return;
        }

        const membershipTier = window.prompt(
            'Membership tier',
            customer.membership_tier || '',
        );

        router.patch(route('operations.customers.update', customer.id), {
            name,
            email: customer.email || '',
            phone: customer.phone || '',
            membership_number: customer.membership_number || '',
            membership_tier: membershipTier || '',
            membership_discount_rate: customer.membership_discount_rate || 0,
            is_active: customer.is_active,
        });
    };

    const toggleOutlet = (outlet) => {
        router.patch(route('operations.outlets.update', outlet.id), {
            name: outlet.name,
            code: outlet.code || '',
            address: outlet.address || '',
            is_active: !outlet.is_active,
            is_primary: outlet.is_primary,
        });
    };

    const promoteUser = (user) => {
        const nextRoleId = window.prompt('Role ID', user.role_id);

        if (!nextRoleId) {
            return;
        }

        router.patch(route('operations.users.update', user.id), {
            name: user.name,
            email: user.email,
            password: '',
            role_id: Number(nextRoleId),
            outlet_id: user.outlet_id || '',
            is_active: user.is_active,
        });
    };

    const toggleUser = (user) => {
        router.patch(route('operations.users.update', user.id), {
            name: user.name,
            email: user.email,
            password: '',
            role_id: user.role_id,
            outlet_id: user.outlet_id || '',
            is_active: !user.is_active,
        });
    };

    const toggleCustomer = (customer) => {
        router.patch(route('operations.customers.update', customer.id), {
            name: customer.name,
            email: customer.email || '',
            phone: customer.phone || '',
            membership_number: customer.membership_number || '',
            membership_tier: customer.membership_tier || '',
            membership_discount_rate: customer.membership_discount_rate || 0,
            is_active: !customer.is_active,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-on-surface">
                        Business operations
                    </h2>
                    <p className="mt-1 text-sm text-outline">
                        Manage outlets, staff access, and customer records.
                    </p>
                </div>
            }
        >
            <Head title="Operations" />

            <div className="space-y-6 py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-container px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    {canManageOperations && (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {[
                                ['Plan', subscription.plan],
                                ['Active users', `${usage.activeUsers} / ${subscription.user_limit}`],
                                ['Active outlets', `${usage.activeOutlets} / ${subscription.outlet_limit}`],
                                ['Status', subscription.status],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant"
                                >
                                    <p className="text-xs uppercase tracking-wide text-outline">
                                        {label}
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-on-surface">
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
                        <div className="space-y-6">
                            {canManageOperations && (
                                <>
                                    <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                            Outlet administration
                                        </h3>
                                        <form
                                            className="mt-4 grid gap-3 md:grid-cols-2"
                                            onSubmit={(event) => {
                                                event.preventDefault();
                                                outletForm.post(route('operations.outlets.store'));
                                            }}
                                        >
                                            <input
                                                value={outletForm.data.name}
                                                onChange={(event) =>
                                                    outletForm.setData('name', event.target.value)
                                                }
                                                placeholder="Outlet name"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <input
                                                value={outletForm.data.code}
                                                onChange={(event) =>
                                                    outletForm.setData('code', event.target.value)
                                                }
                                                placeholder="Code"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <textarea
                                                value={outletForm.data.address}
                                                onChange={(event) =>
                                                    outletForm.setData('address', event.target.value)
                                                }
                                                placeholder="Address"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm md:col-span-2"
                                            />
                                            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                                                <input
                                                    type="checkbox"
                                                    checked={outletForm.data.is_active}
                                                    onChange={(event) =>
                                                        outletForm.setData('is_active', event.target.checked)
                                                    }
                                                />
                                                Active outlet
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                                                <input
                                                    type="checkbox"
                                                    checked={outletForm.data.is_primary}
                                                    onChange={(event) =>
                                                        outletForm.setData('is_primary', event.target.checked)
                                                    }
                                                />
                                                Primary outlet
                                            </label>
                                            <button className="rounded-full bg-on-surface px-4 py-3 text-sm font-semibold text-white md:col-span-2">
                                                Add outlet
                                            </button>
                                        </form>

                                        <div className="mt-4 space-y-3">
                                            {outlets.map((outlet) => (
                                                <div
                                                    key={outlet.id}
                                                    className="flex items-center justify-between rounded-xl border border-outline-variant p-4"
                                                >
                                                    <div>
                                                        <p className="font-medium text-on-surface">
                                                            {outlet.name}
                                                        </p>
                                                        <p className="text-sm text-outline">
                                                            {outlet.code || 'No code'}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {outlet.is_primary && (
                                                            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                                                                Primary
                                                            </span>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleOutlet(outlet)}
                                                            className="rounded-full border border-outline px-3 py-1 text-xs font-medium text-on-surface-variant"
                                                        >
                                                            {outlet.is_active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                            User administration
                                        </h3>
                                        <form
                                            className="mt-4 grid gap-3 md:grid-cols-2"
                                            onSubmit={(event) => {
                                                event.preventDefault();
                                                userForm.post(route('operations.users.store'));
                                            }}
                                        >
                                            <input
                                                value={userForm.data.name}
                                                onChange={(event) =>
                                                    userForm.setData('name', event.target.value)
                                                }
                                                placeholder="Full name"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <input
                                                type="email"
                                                value={userForm.data.email}
                                                onChange={(event) =>
                                                    userForm.setData('email', event.target.value)
                                                }
                                                placeholder="Email"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <input
                                                type="password"
                                                value={userForm.data.password}
                                                onChange={(event) =>
                                                    userForm.setData('password', event.target.value)
                                                }
                                                placeholder="Password"
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            />
                                            <SelectInput
                                                value={userForm.data.role_id}
                                                onChange={(event) =>
                                                    userForm.setData('role_id', event.target.value)
                                                }
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            >
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                            <SelectInput
                                                value={userForm.data.outlet_id}
                                                onChange={(event) =>
                                                    userForm.setData('outlet_id', event.target.value)
                                                }
                                                className="rounded-xl border border-outline px-3 py-2 text-sm"
                                            >
                                                {outlets.map((outlet) => (
                                                    <option key={outlet.id} value={outlet.id}>
                                                        {outlet.name}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                                                <input
                                                    type="checkbox"
                                                    checked={userForm.data.is_active}
                                                    onChange={(event) =>
                                                        userForm.setData('is_active', event.target.checked)
                                                    }
                                                />
                                                Active user
                                            </label>
                                            <button className="rounded-full bg-on-surface px-4 py-3 text-sm font-semibold text-white md:col-span-2">
                                                Add staff user
                                            </button>
                                        </form>

                                        <div className="mt-4 space-y-3">
                                            {staffUsers.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center justify-between rounded-xl border border-outline-variant p-4"
                                                >
                                                    <div>
                                                        <p className="font-medium text-on-surface">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-sm text-outline">
                                                            {user.role?.name} • {user.outlet?.name || 'No outlet'}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => promoteUser(user)}
                                                            className="rounded-full border border-outline px-3 py-1 text-xs font-medium text-on-surface-variant"
                                                        >
                                                            Change role
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleUser(user)}
                                                            className="rounded-full border border-outline px-3 py-1 text-xs font-medium text-on-surface-variant"
                                                        >
                                                            {user.is_active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="space-y-6">
                            {canManageCustomers && (
                                <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                        Customer directory
                                    </h3>
                                    <form
                                        className="mt-4 space-y-3"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            customerForm.post(route('operations.customers.store'));
                                        }}
                                    >
                                        <input
                                            value={customerForm.data.name}
                                            onChange={(event) =>
                                                customerForm.setData('name', event.target.value)
                                            }
                                            placeholder="Customer name"
                                            className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                        />
                                        <input
                                            value={customerForm.data.email}
                                            onChange={(event) =>
                                                customerForm.setData('email', event.target.value)
                                            }
                                            placeholder="Email"
                                            className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                        />
                                        <input
                                            value={customerForm.data.phone}
                                            onChange={(event) =>
                                                customerForm.setData('phone', event.target.value)
                                            }
                                            placeholder="Phone"
                                            className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                        />
                                        <input
                                            value={customerForm.data.membership_number}
                                            onChange={(event) =>
                                                customerForm.setData(
                                                    'membership_number',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Membership number"
                                            className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                        />
                                        <input
                                            value={customerForm.data.membership_tier}
                                            onChange={(event) =>
                                                customerForm.setData(
                                                    'membership_tier',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Membership tier"
                                            className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                        />
                                        <input
                                            type="number"
                                            value={customerForm.data.membership_discount_rate}
                                            onChange={(event) =>
                                                customerForm.setData(
                                                    'membership_discount_rate',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Membership discount rate"
                                            className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                        />
                                        <button className="rounded-full bg-tertiary-container0 px-4 py-3 text-sm font-semibold text-white">
                                            Save customer
                                        </button>
                                    </form>

                                    <div className="mt-4 space-y-3">
                                        {customers.map((customer) => (
                                            <div
                                                key={customer.id}
                                                className="rounded-xl border border-outline-variant p-4"
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <p className="font-medium text-on-surface">
                                                            {customer.name}
                                                        </p>
                                                        <p className="text-sm text-outline">
                                                            {customer.membership_tier || 'Standard customer'}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => editCustomer(customer)}
                                                            className="rounded-full border border-outline px-3 py-1 text-xs font-medium text-on-surface-variant"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleCustomer(customer)}
                                                            className="rounded-full border border-outline px-3 py-1 text-xs font-medium text-on-surface-variant"
                                                        >
                                                            {customer.is_active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-outline">
                                                    {customer.email || 'No email'}
                                                    {customer.phone ? ` • ${customer.phone}` : ''}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
