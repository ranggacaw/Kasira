import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';

export default function InventoryIndex({
    filters,
    outlets,
    selectedOutletId,
    products,
    movements,
    lowStockAlerts,
}) {
    const flash = usePage().props.flash || {};
    const filterForm = useForm({
        outlet: selectedOutletId || '',
        product_id: filters.product_id || '',
        movement_type: filters.movement_type || '',
    });
    const movementForm = useForm({
        product_id: products[0]?.id || '',
        type: 'stock_in',
        quantity: 1,
        notes: '',
    });

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Inventory
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Review stock movements, low-stock alerts, and outlet-specific inventory activity.
                    </p>
                </div>
            }
        >
            <Head title="Inventory" />

            <div className="space-y-6 pb-24">
                {flash.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <form
                        className="grid gap-3 md:grid-cols-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get(route('inventory.index'), filterForm.data, {
                                preserveState: true,
                            });
                        }}
                    >
                        <select
                            value={filterForm.data.outlet}
                            onChange={(event) => filterForm.setData('outlet', event.target.value)}
                            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                        >
                            {outlets.map((outlet) => (
                                <option key={outlet.id} value={outlet.id}>
                                    {outlet.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterForm.data.product_id}
                            onChange={(event) =>
                                filterForm.setData('product_id', event.target.value)
                            }
                            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                        >
                            <option value="">All products</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterForm.data.movement_type}
                            onChange={(event) =>
                                filterForm.setData('movement_type', event.target.value)
                            }
                            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                        >
                            <option value="">All movement types</option>
                            <option value="stock_in">Stock in</option>
                            <option value="stock_out">Stock out</option>
                            <option value="adjustment">Adjustment</option>
                            <option value="sale">Sale</option>
                            <option value="refund">Refund</option>
                        </select>
                        <button className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                            Apply filters
                        </button>
                    </form>
                </div>

                <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
                    <div className="space-y-6">
                        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Record movement
                            </h3>
                            <form
                                className="mt-5 space-y-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    movementForm.post(route('inventory.movements.store'));
                                }}
                            >
                                <select
                                    value={movementForm.data.product_id}
                                    onChange={(event) =>
                                        movementForm.setData('product_id', event.target.value)
                                    }
                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                                >
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={movementForm.data.type}
                                    onChange={(event) => movementForm.setData('type', event.target.value)}
                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                                >
                                    <option value="stock_in">Stock in</option>
                                    <option value="stock_out">Stock out</option>
                                </select>
                                <input
                                    type="number"
                                    min="1"
                                    value={movementForm.data.quantity}
                                    onChange={(event) =>
                                        movementForm.setData('quantity', event.target.value)
                                    }
                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                                />
                                <textarea
                                    value={movementForm.data.notes}
                                    onChange={(event) =>
                                        movementForm.setData('notes', event.target.value)
                                    }
                                    placeholder="Reference or reason"
                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                                />
                                <button className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
                                    Save movement
                                </button>
                            </form>
                        </div>

                        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Low-stock alerts
                            </h3>
                            <div className="mt-5 space-y-3">
                                {lowStockAlerts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
                                    >
                                        <p className="font-medium text-slate-900">{product.name}</p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            Stock {product.stock_quantity} / minimum {product.minimum_stock}
                                        </p>
                                        <p className="mt-1 text-xs uppercase tracking-wide text-amber-700">
                                            {product.outlet?.name}
                                        </p>
                                    </div>
                                ))}
                                {lowStockAlerts.length === 0 && (
                                    <p className="text-sm text-slate-500">
                                        No low-stock alerts for this filter.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Movement history
                            </h3>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {movements.length} records
                            </span>
                        </div>

                        <div className="mt-5 space-y-3">
                            {movements.map((movement) => (
                                <div
                                    key={movement.id}
                                    className="rounded-2xl border border-slate-200 p-4"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {movement.product?.name}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {movement.user?.name} • {movement.outlet?.name}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                            {movement.type}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm text-slate-600">
                                        Qty {movement.quantity} • Balance {movement.balance_after}
                                    </p>
                                    {movement.notes && (
                                        <p className="mt-1 text-sm text-slate-500">{movement.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
