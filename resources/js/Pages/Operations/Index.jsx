import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const emptyOutletForm = {
    name: '',
    code: '',
    address: '',
    is_active: true,
    is_primary: false,
};

const buildUserForm = (roles = []) => ({
    name: '',
    email: '',
    password: '',
    role_id: roles[0]?.id ? String(roles[0].id) : '',
    outlet_id: '',
    is_active: true,
});

const mapOutletToForm = (outlet) => ({
    name: outlet.name || '',
    code: outlet.code || '',
    address: outlet.address || '',
    is_active: Boolean(outlet.is_active),
    is_primary: Boolean(outlet.is_primary),
});

const mapUserToForm = (user, fallbackRoleId = '') => ({
    name: user.name || '',
    email: user.email || '',
    password: '',
    role_id: user.role_id ? String(user.role_id) : fallbackRoleId,
    outlet_id: user.outlet_id ? String(user.outlet_id) : '',
    is_active: Boolean(user.is_active),
});

const firstErrorMessage = (errors = {}) => {
    for (const value of Object.values(errors)) {
        if (Array.isArray(value) && value[0]) {
            return value[0];
        }

        if (value) {
            return value;
        }
    }

    return null;
};

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
    const page = usePage();
    const flash = page.props.flash || {};
    const pageErrors = page.props.errors || {};
    const globalError = firstErrorMessage(pageErrors);
    const currentRoleName = page.props.auth?.user?.role?.name;
    const managesCashiersOnly = currentRoleName === 'Admin';
    const [editingOutletId, setEditingOutletId] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);

    const outletForm = useForm(emptyOutletForm);
    const userForm = useForm(buildUserForm(roles));
    const customerForm = useForm({
        name: '',
        email: '',
        phone: '',
        membership_number: '',
        membership_tier: '',
        membership_discount_rate: 0,
        is_active: true,
    });

    const resetOutletForm = () => {
        setEditingOutletId(null);
        outletForm.clearErrors();
        outletForm.setData(emptyOutletForm);
    };

    const resetUserForm = () => {
        setEditingUserId(null);
        userForm.clearErrors();
        userForm.setData(buildUserForm(roles));
    };

    const beginOutletEdit = (outlet) => {
        setEditingOutletId(outlet.id);
        outletForm.clearErrors();
        outletForm.setData(mapOutletToForm(outlet));
    };

    const beginUserEdit = (user) => {
        setEditingUserId(user.id);
        userForm.clearErrors();
        userForm.setData(mapUserToForm(user, roles[0]?.id ? String(roles[0].id) : ''));
    };

    const submitOutlet = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => resetOutletForm(),
        };

        if (editingOutletId) {
            outletForm.patch(route('operations.outlets.update', editingOutletId), options);

            return;
        }

        outletForm.post(route('operations.outlets.store'), options);
    };

    const submitUser = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => resetUserForm(),
        };

        if (editingUserId) {
            userForm.patch(route('operations.users.update', editingUserId), options);

            return;
        }

        userForm.post(route('operations.users.store'), options);
    };

    const toggleOutlet = (outlet) => {
        router.patch(
            route('operations.outlets.update', outlet.id),
            {
                ...mapOutletToForm(outlet),
                is_active: !outlet.is_active,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const toggleUser = (user) => {
        router.patch(
            route('operations.users.update', user.id),
            {
                ...mapUserToForm(user, roles[0]?.id ? String(roles[0].id) : ''),
                is_active: !user.is_active,
            },
            {
                preserveScroll: true,
            },
        );
    };

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

    const staffSectionTitle = managesCashiersOnly ? 'Cashier administration' : 'Staff administration';
    const staffSubmitLabel = editingUserId
        ? managesCashiersOnly
            ? 'Update cashier'
            : 'Update staff user'
        : managesCashiersOnly
          ? 'Add cashier'
          : 'Add staff user';

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-on-surface">
                        Business operations
                    </h2>
                    <p className="mt-1 text-sm text-outline">
                        Manage branches, staff access, and customer records.
                    </p>
                </div>
            }
        >
            <Head title="Operations" />

            <div className="space-y-6">
                <div className="mx-auto space-y-6">
                    {flash.success && (
                        <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-container px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    {globalError && (
                        <div className="rounded-xl border border-error/30 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {globalError}
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
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                                    Branch administration
                                                </h3>
                                                <p className="mt-1 text-sm text-outline">
                                                    Branch records are stored as outlets and used across operations workflows.
                                                </p>
                                            </div>
                                            {editingOutletId && (
                                                <button
                                                    type="button"
                                                    onClick={resetOutletForm}
                                                    className="rounded-full border border-outline px-3 py-1 text-xs font-medium text-on-surface-variant"
                                                >
                                                    Cancel edit
                                                </button>
                                            )}
                                        </div>

                                        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submitOutlet}>
                                            <div>
                                                <input
                                                    value={outletForm.data.name}
                                                    onChange={(event) =>
                                                        outletForm.setData('name', event.target.value)
                                                    }
                                                    placeholder="Branch name"
                                                    className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                                />
                                                <InputError message={outletForm.errors.name} className="mt-2" />
                                            </div>

                                            <div>
                                                <input
                                                    value={outletForm.data.code}
                                                    onChange={(event) =>
                                                        outletForm.setData('code', event.target.value)
                                                    }
                                                    placeholder="Branch code"
                                                    className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                                />
                                                <InputError message={outletForm.errors.code} className="mt-2" />
                                            </div>

                                            <div className="md:col-span-2">
                                                <textarea
                                                    value={outletForm.data.address}
                                                    onChange={(event) =>
                                                        outletForm.setData('address', event.target.value)
                                                    }
                                                    placeholder="Address"
                                                    rows={3}
                                                    className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                                />
                                                <InputError message={outletForm.errors.address} className="mt-2" />
                                            </div>

                                            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                                                <input
                                                    type="checkbox"
                                                    checked={outletForm.data.is_active}
                                                    onChange={(event) =>
                                                        outletForm.setData('is_active', event.target.checked)
                                                    }
                                                />
                                                Active branch
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                                                <input
                                                    type="checkbox"
                                                    checked={outletForm.data.is_primary}
                                                    onChange={(event) =>
                                                        outletForm.setData('is_primary', event.target.checked)
                                                    }
                                                />
                                                Primary branch
                                            </label>

                                            <InputError
                                                message={outletForm.errors.is_active || outletForm.errors.is_primary}
                                                className="md:col-span-2"
                                            />

                                            <button
                                                disabled={outletForm.processing}
                                                className="rounded-full bg-on-surface px-4 py-3 text-sm font-semibold text-white md:col-span-2"
                                            >
                                                {editingOutletId ? 'Update branch' : 'Add branch'}
                                            </button>
                                        </form>

                                        <div className="mt-4 space-y-3">
                                            {outlets.map((outlet) => (
                                                <div
                                                    key={outlet.id}
                                                    className="flex flex-col gap-3 rounded-xl border border-outline-variant p-4"
                                                >
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <p className="font-medium text-on-surface">
                                                                {outlet.name}
                                                            </p>
                                                            <p className="text-sm text-outline">
                                                                {outlet.code || 'No code'}
                                                            </p>
                                                            <p className="mt-1 text-sm text-outline">
                                                                {outlet.address || 'No address'}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
                                                                {outlet.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                            {outlet.is_primary && (
                                                                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                                                                    Primary
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => beginOutletEdit(outlet)}
                                                            className="rounded-full border border-outline px-3 py-1 text-xs font-medium text-on-surface-variant"
                                                        >
                                                            Edit
                                                        </button>
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
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold uppercase tracking-wide text-outline">
                                                    {staffSectionTitle}
                                                </h3>
                                                <p className="mt-1 text-sm text-outline">
                                                    {managesCashiersOnly
                                                        ? 'Admins can create, update, activate, deactivate, and assign cashier accounts to branches.'
                                                        : 'Owners can manage operational staff accounts and outlet assignments.'}
                                                </p>
                                            </div>
                                            {editingUserId && (
                                                <button
                                                    type="button"
                                                    onClick={resetUserForm}
                                                    className="rounded-full border border-outline px-3 py-1 text-xs font-medium text-on-surface-variant"
                                                >
                                                    Cancel edit
                                                </button>
                                            )}
                                        </div>

                                        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submitUser}>
                                            <div>
                                                <input
                                                    value={userForm.data.name}
                                                    onChange={(event) =>
                                                        userForm.setData('name', event.target.value)
                                                    }
                                                    placeholder="Full name"
                                                    className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                                />
                                                <InputError message={userForm.errors.name} className="mt-2" />
                                            </div>

                                            <div>
                                                <input
                                                    type="email"
                                                    value={userForm.data.email}
                                                    onChange={(event) =>
                                                        userForm.setData('email', event.target.value)
                                                    }
                                                    placeholder="Email"
                                                    className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                                />
                                                <InputError message={userForm.errors.email} className="mt-2" />
                                            </div>

                                            <div>
                                                <input
                                                    type="password"
                                                    value={userForm.data.password}
                                                    onChange={(event) =>
                                                        userForm.setData('password', event.target.value)
                                                    }
                                                    placeholder={editingUserId ? 'Leave blank to keep password' : 'Password'}
                                                    className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                                />
                                                <InputError message={userForm.errors.password} className="mt-2" />
                                            </div>

                                            <div>
                                                <SelectInput
                                                    value={userForm.data.role_id}
                                                    onChange={(event) =>
                                                        userForm.setData('role_id', event.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                                >
                                                    {roles.map((role) => (
                                                        <option key={role.id} value={role.id}>
                                                            {role.name}
                                                        </option>
                                                    ))}
                                                </SelectInput>
                                                <InputError message={userForm.errors.role_id} className="mt-2" />
                                            </div>

                                            <div className="md:col-span-2">
                                                <SelectInput
                                                    value={userForm.data.outlet_id}
                                                    onChange={(event) =>
                                                        userForm.setData('outlet_id', event.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                                                >
                                                    <option value="">No branch assignment</option>
                                                    {outlets.map((outlet) => (
                                                        <option key={outlet.id} value={outlet.id}>
                                                            {outlet.name}
                                                        </option>
                                                    ))}
                                                </SelectInput>
                                                <InputError message={userForm.errors.outlet_id} className="mt-2" />
                                            </div>

                                            <label className="flex items-center gap-2 text-sm text-on-surface-variant md:col-span-2">
                                                <input
                                                    type="checkbox"
                                                    checked={userForm.data.is_active}
                                                    onChange={(event) =>
                                                        userForm.setData('is_active', event.target.checked)
                                                    }
                                                />
                                                Active account
                                            </label>

                                            <InputError message={userForm.errors.is_active} className="md:col-span-2" />

                                            <button
                                                disabled={userForm.processing}
                                                className="rounded-full bg-on-surface px-4 py-3 text-sm font-semibold text-white md:col-span-2"
                                            >
                                                {staffSubmitLabel}
                                            </button>
                                        </form>

                                        <div className="mt-4 space-y-3">
                                            {staffUsers.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="flex flex-col gap-3 rounded-xl border border-outline-variant p-4"
                                                >
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <p className="font-medium text-on-surface">
                                                                {user.name}
                                                            </p>
                                                            <p className="text-sm text-outline">
                                                                {user.email}
                                                            </p>
                                                            <p className="mt-1 text-sm text-outline">
                                                                {user.role?.name} • {user.outlet?.name || 'No branch assignment'}
                                                            </p>
                                                        </div>
                                                        <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
                                                            {user.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => beginUserEdit(user)}
                                                            className="rounded-full border border-outline px-3 py-1 text-xs font-medium text-on-surface-variant"
                                                        >
                                                            Edit
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
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="font-medium text-on-surface">
                                                            {customer.name}
                                                        </p>
                                                        <p className="text-sm text-outline">
                                                            {customer.membership_tier || 'Standard customer'}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
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
