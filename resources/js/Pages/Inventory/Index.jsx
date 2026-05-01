import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectInput from '@/Components/SelectInput';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function InventoryIndex({
    filters,
    outlets,
    selectedOutletId,
    products,
    movements,
    lowStockAlerts,
}) {
    const flash = usePage().props.flash || {};
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const filterForm = useForm({
        outlet: selectedOutletId || '',
        product_id: filters.product_id || '',
        movement_type: filters.movement_type || '',
        search: filters.search || '',
    });

    const movementForm = useForm({
        product_id: products[0]?.id || '',
        type: 'stock_in',
        quantity: 1,
        notes: '',
    });

    const applyFilters = (nextFilters = {}) => {
        router.get(route('inventory.index'), {
            outlet: selectedOutletId || undefined,
            product_id: (nextFilters.product_id ?? filterForm.data.product_id) || undefined,
            movement_type: (nextFilters.movement_type ?? filterForm.data.movement_type) || undefined,
            search: (nextFilters.search ?? searchQuery) || undefined,
        }, { preserveState: true, replace: true });
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchQuery(value);
        filterForm.setData('search', value);
        applyFilters({ search: value });
    };

    const handlePageChange = (url) => {
        router.get(url, {}, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-headline-md text-on-surface">
                        Inventory
                    </h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Review stock movements, low-stock alerts, and outlet-specific inventory activity.
                    </p>
                </div>
            }
        >
            <Head title="Inventory" />

            <div className="space-y-6 pb-24">
                {flash.success && (
                    <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-fixed-dim px-4 py-3 text-body-md text-on-tertiary-fixed">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                    <div className="grid gap-3 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search by product name..."
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                        </div>
                        <SelectInput
                            value={filterForm.data.product_id}
                            onChange={(event) => {
                                filterForm.setData('product_id', event.target.value);
                                applyFilters({ product_id: event.target.value });
                            }}
                            className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                        >
                            <option value="">All products</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </SelectInput>
                        <SelectInput
                            value={filterForm.data.movement_type}
                            onChange={(event) => {
                                filterForm.setData('movement_type', event.target.value);
                                applyFilters({ movement_type: event.target.value });
                            }}
                            className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                        >
                            <option value="">All movement types</option>
                            <option value="stock_in">Stock in</option>
                            <option value="stock_out">Stock out</option>
                            <option value="adjustment">Adjustment</option>
                            <option value="sale">Sale</option>
                            <option value="refund">Refund</option>
                        </SelectInput>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
                    <div className="space-y-6">
                        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                            <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">
                                Record movement
                            </h3>
                            <form
                                className="mt-5 space-y-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    movementForm.post(route('inventory.movements.store'));
                                }}
                            >
                                <SelectInput
                                    value={movementForm.data.product_id}
                                    onChange={(event) =>
                                        movementForm.setData('product_id', event.target.value)
                                    }
                                    className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                >
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </SelectInput>
                                <SelectInput
                                    value={movementForm.data.type}
                                    onChange={(event) => movementForm.setData('type', event.target.value)}
                                    className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                >
                                    <option value="stock_in">Stock in</option>
                                    <option value="stock_out">Stock out</option>
                                </SelectInput>
                                <input
                                    type="number"
                                    min="1"
                                    value={movementForm.data.quantity}
                                    onChange={(event) =>
                                        movementForm.setData('quantity', event.target.value)
                                    }
                                    className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                                <textarea
                                    value={movementForm.data.notes}
                                    onChange={(event) =>
                                        movementForm.setData('notes', event.target.value)
                                    }
                                    placeholder="Reference or reason"
                                    className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                                <button className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90">
                                    Save movement
                                </button>
                            </form>
                        </div>

                        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                            <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">
                                Low-stock alerts
                            </h3>
                            <div className="mt-5 space-y-3">
                                {lowStockAlerts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="rounded-xl border border-secondary-fixed-dim bg-secondary-container p-4"
                                    >
                                        <p className="font-medium text-on-surface">{product.name}</p>
                                        <p className="mt-1 text-sm text-on-surface-variant">
                                            Stock {product.stock_quantity} / minimum {product.minimum_stock}
                                        </p>
                                        <p className="mt-1 text-xs uppercase tracking-wide text-on-secondary-container">
                                            {product.outlet?.name}
                                        </p>
                                    </div>
                                ))}
                                {lowStockAlerts.length === 0 && (
                                    <p className="text-body-md text-on-surface-variant">
                                        No low-stock alerts for this filter.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">
                                Movement history
                            </h3>
                            <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                                {movements.total} records
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-xl bg-surface-container-lowest">
                            <div className="hidden gap-4 border-b border-outline-variant bg-surface-container-low px-4 py-3 text-xs font-semibold uppercase tracking-wide text-outline lg:grid lg:grid-cols-12">
                                <div className="col-span-4">Product</div>
                                <div className="col-span-2 text-center">Type</div>
                                <div className="col-span-1 text-center">Qty</div>
                                <div className="col-span-1 text-center">Balance</div>
                                <div className="col-span-2">User / Outlet</div>
                                <div className="col-span-2">Date</div>
                            </div>

                            {movements.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <svg className="w-12 h-12 text-outline mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <p className="text-on-surface-variant font-medium">No movements found</p>
                                    <p className="mt-1 text-sm text-outline">Try adjusting your search or filters.</p>
                                </div>
                            ) : (
                                movements.data.map((movement, index) => (
                                    <div
                                        key={movement.id}
                                        className={`grid grid-cols-1 gap-2 border-b border-outline-variant px-4 py-4 transition hover:bg-surface-container-low lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center ${
                                            index === movements.data.length - 1 ? 'border-b-0' : ''
                                        }`}
                                    >
                                        <div className="col-span-4">
                                            <p className="font-semibold text-on-surface">{movement.product?.name}</p>
                                            {movement.notes && (
                                                <p className="mt-1 text-xs text-outline truncate max-w-[200px]">{movement.notes}</p>
                                            )}
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                movement.type === 'stock_in'
                                                    ? 'bg-tertiary-fixed-dim text-on-tertiary-fixed'
                                                    : movement.type === 'stock_out'
                                                    ? 'bg-error-container text-on-error-container'
                                                    : 'bg-surface-container text-on-surface-variant'
                                            }`}>
                                                {movement.type}
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-center font-semibold text-on-surface">
                                            {movement.quantity}
                                        </div>
                                        <div className="col-span-1 text-center font-semibold text-on-surface">
                                            {movement.balance_after}
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-on-surface">{movement.user?.name}</p>
                                            <p className="text-xs text-outline">{movement.outlet?.name}</p>
                                        </div>
                                        <div className="col-span-2 text-sm text-outline">
                                            {movement.created_at}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {movements.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between gap-2">
                                <button
                                    onClick={() => handlePageChange(movements.prev_page_url)}
                                    disabled={!movements.prev_page_url}
                                    className="rounded-lg border border-outline px-4 py-2 text-sm font-medium text-on-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: movements.last_page }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(`${movements.path}?page=${page}`)}
                                            className={`rounded-lg px-3 py-1 text-sm font-medium ${
                                                movements.current_page === page
                                                    ? 'bg-primary text-on-primary'
                                                    : 'text-on-surface-variant hover:bg-surface-container-low'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePageChange(movements.next_page_url)}
                                    disabled={!movements.next_page_url}
                                    className="rounded-lg border border-outline px-4 py-2 text-sm font-medium text-on-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
