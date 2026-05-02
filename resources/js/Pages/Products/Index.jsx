import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectInput from '@/Components/SelectInput';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

const formatPercentage = (value) => `${Number(value || 0).toFixed(2)}%`;

const toNumber = (value) => {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
};

const emptyForm = (outletId = '', unitId = '') => ({
    outlet_id: outletId,
    category_id: '',
    unit_id: unitId,
    name: '',
    sku: '',
    barcode: '',
    selling_price: '',
    cost_price: '',
    minimum_margin: '',
    stock_quantity: 0,
    minimum_stock: 0,
    image_path: '',
    is_active: true,
    track_stock: true,
});

export default function ProductsIndex({
    outlets,
    selectedOutletId,
    filters,
    categories,
    units,
    defaultMinimumMargin,
    products,
    recentCostHistories,
}) {
    const flash = usePage().props.flash || {};
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [filterCategory, setFilterCategory] = useState(filters.category || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const defaultUnitId = units[0]?.id || '';
    const productForm = useForm(emptyForm(selectedOutletId || outlets[0]?.id || '', defaultUnitId));

    useEffect(() => {
        if (!editingProduct) {
            productForm.setData('outlet_id', selectedOutletId || outlets[0]?.id || '');
        }
    }, [selectedOutletId]);

    const applyFilters = (nextFilters = {}) => {
        const outlet = nextFilters.outlet ?? selectedOutletId ?? '';
        const search = nextFilters.search ?? searchQuery;
        const category = nextFilters.category ?? filterCategory;
        const status = nextFilters.status ?? filterStatus;

        router.get(
            route('products.index'),
            {
                outlet: outlet || undefined,
                search: search || undefined,
                category: category || undefined,
                status: status || undefined,
                page: nextFilters.page || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const changeOutlet = (event) => {
        applyFilters({ outlet: event.target.value });
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchQuery(value);
        applyFilters({ search: value });
    };

    const handleCategoryFilter = (event) => {
        const value = event.target.value;
        setFilterCategory(value);
        applyFilters({ category: value });
    };

    const handleStatusFilter = (event) => {
        const value = event.target.value;
        setFilterStatus(value);
        applyFilters({ status: value });
    };

    const handlePageChange = (page) => {
        applyFilters({ page });
    };

    const beginEdit = (product) => {
        setEditingProduct(product);
        productForm.setData({
            outlet_id: product.outlet_id,
            category_id: product.category_id || '',
            unit_id: product.unit_id || defaultUnitId,
            name: product.name,
            sku: product.sku || '',
            barcode: product.barcode || '',
            selling_price: product.selling_price,
            cost_price: product.cost_price,
            minimum_margin: product.minimum_margin ?? '',
            stock_quantity: product.stock_quantity,
            minimum_stock: product.minimum_stock,
            image_path: product.image_path || '',
            is_active: product.is_active,
            track_stock: product.track_stock,
        });
    };

    const resetForm = () => {
        setEditingProduct(null);
        productForm.setData(emptyForm(selectedOutletId || outlets[0]?.id || '', defaultUnitId));
    };

    const submit = (event) => {
        event.preventDefault();

        if (editingProduct) {
            productForm.patch(route('products.update', editingProduct.id), {
                onSuccess: resetForm,
            });
            return;
        }

        productForm.post(route('products.store'), {
            onSuccess: resetForm,
        });
    };

    const activeCount = products.data.filter((p) => p.is_active).length;
    const formErrors = Object.values(productForm.errors);
    const sellingPrice = toNumber(productForm.data.selling_price);
    const costPrice = toNumber(productForm.data.cost_price);
    const estimatedProfit = sellingPrice - costPrice;
    const estimatedMargin = sellingPrice > 0 ? (estimatedProfit / sellingPrice) * 100 : 0;
    const effectiveMinimumMargin = productForm.data.minimum_margin === ''
        ? Number(defaultMinimumMargin || 0)
        : toNumber(productForm.data.minimum_margin);
    const isLowMargin = sellingPrice > 0 && estimatedMargin < effectiveMinimumMargin;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-headline-md leading-tight text-on-surface">
                            Products
                        </h2>
                        <p className="mt-1 text-body-md text-on-surface-variant">
                            Manage products for this outlet.
                        </p>
                    </div>
                    <SelectInput
                        value={selectedOutletId || ''}
                        onChange={changeOutlet}
                        className="w-full rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant sm:w-auto"
                    >
                        {outlets.map((outlet) => (
                            <option key={outlet.id} value={outlet.id}>
                                {outlet.name}
                            </option>
                        ))}
                    </SelectInput>
                </div>
            }
        >
            <Head title="Products" />

            <div className="space-y-6 pb-24">

                {flash.success && (
                    <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-fixed-dim px-4 py-3 text-body-md text-on-tertiary-fixed">
                        {flash.success}
                    </div>
                )}

                {/* Search + Filter Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-full flex-1 sm:min-w-64">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0 1 14 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, SKU, or barcode..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full rounded-full border border-outline bg-surface-container-lowest py-2 pl-12 pr-4 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <SelectInput
                        value={filterCategory}
                        onChange={handleCategoryFilter}
                        className="w-full rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant sm:w-auto"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </SelectInput>
                    <SelectInput
                        value={filterStatus}
                        onChange={handleStatusFilter}
                        className="w-full rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant sm:w-auto"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </SelectInput>
                </div>

                {/* Two Column Layout */}
                <div className="grid gap-6 xl:grid-cols-[420px_1fr]">

                    {/* Form Panel */}
                    <form
                        onSubmit={submit}
                        className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant"
                    >
                        <div className="flex items-center justify-between gap-3 mb-5">
                            <div>
                                <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">
                                    {editingProduct ? 'Edit Product' : 'New Product'}
                                </h3>
                                <p className="mt-1 text-body-md text-on-surface-variant">
                                    {editingProduct ? 'Update product details.' : 'Fill details below.'}
                                </p>
                            </div>
                            {editingProduct && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-full border border-outline bg-surface-container-lowest px-3 py-2 text-sm font-medium text-on-surface-variant"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {formErrors.length > 0 && (
                                <div className="rounded-xl border border-error-container bg-error-container/60 px-4 py-3 text-sm text-on-error-container">
                                    {formErrors.map((error, index) => (
                                        <div key={index}>{error}</div>
                                    ))}
                                </div>
                            )}
                            <input
                                value={productForm.data.name}
                                onChange={(event) => productForm.setData('name', event.target.value)}
                                placeholder="Product name"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <div className="grid gap-3 sm:grid-cols-2">
                                <SelectInput
                                    value={productForm.data.category_id}
                                    onChange={(event) => productForm.setData('category_id', event.target.value)}
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                >
                                    <option value="">No category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </SelectInput>
                                <SelectInput
                                    value={productForm.data.unit_id}
                                    onChange={(event) => productForm.setData('unit_id', event.target.value)}
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                >
                                    {units.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </SelectInput>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    value={productForm.data.sku}
                                    onChange={(event) => productForm.setData('sku', event.target.value)}
                                    placeholder="SKU (optional)"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                                <input
                                    value={productForm.data.barcode}
                                    onChange={(event) => productForm.setData('barcode', event.target.value)}
                                    placeholder="Barcode"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                            </div>
                            <p className="-mt-1 text-xs text-on-surface-variant">
                                Leave SKU empty to generate one automatically.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    type="number"
                                    value={productForm.data.selling_price}
                                    onChange={(event) => productForm.setData('selling_price', event.target.value)}
                                    placeholder="Selling price"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                                <input
                                    type="number"
                                    value={productForm.data.cost_price}
                                    onChange={(event) => productForm.setData('cost_price', event.target.value)}
                                    placeholder="Cost price"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={productForm.data.minimum_margin}
                                    onChange={(event) => productForm.setData('minimum_margin', event.target.value)}
                                    placeholder="Minimum margin override %"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                                <div className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
                                    Uses {formatPercentage(effectiveMinimumMargin)} minimum margin threshold.
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3">
                                    <p className="text-xs uppercase tracking-wide text-on-surface-variant">Estimated profit</p>
                                    <p className={`mt-1 text-lg font-semibold ${estimatedProfit < 0 ? 'text-on-error-container' : 'text-on-surface'}`}>
                                        {formatCurrency(estimatedProfit)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3">
                                    <p className="text-xs uppercase tracking-wide text-on-surface-variant">Estimated gross margin</p>
                                    <p className={`mt-1 text-lg font-semibold ${isLowMargin ? 'text-on-error-container' : 'text-on-surface'}`}>
                                        {formatPercentage(estimatedMargin)}
                                    </p>
                                </div>
                            </div>
                            {isLowMargin && (
                                <div className="rounded-xl border border-error-container bg-error-container/60 px-4 py-3 text-sm text-on-error-container">
                                    Estimated gross margin is below the active minimum threshold of {formatPercentage(effectiveMinimumMargin)}.
                                </div>
                            )}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    type="number"
                                    value={productForm.data.stock_quantity}
                                    onChange={(event) => productForm.setData('stock_quantity', event.target.value)}
                                    placeholder="Stock qty"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                                <input
                                    type="number"
                                    value={productForm.data.minimum_stock}
                                    onChange={(event) => productForm.setData('minimum_stock', event.target.value)}
                                    placeholder="Min stock"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                            </div>
                            <input
                                value={productForm.data.image_path}
                                onChange={(event) => productForm.setData('image_path', event.target.value)}
                                placeholder="Image path or URL"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface-variant">
                                    <input
                                        type="checkbox"
                                        checked={productForm.data.is_active}
                                        onChange={(event) => productForm.setData('is_active', event.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    Active for checkout
                                </label>
                                <label className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface-variant">
                                    <input
                                        type="checkbox"
                                        checked={productForm.data.track_stock}
                                        onChange={(event) => productForm.setData('track_stock', event.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    Track stock
                                </label>
                            </div>
                        </div>

                        <div className="sticky bottom-4 mt-5 flex flex-col gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest/95 p-3 backdrop-blur sm:flex-row">
                            <button
                                type="submit"
                                className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
                            >
                                {editingProduct ? 'Save Changes' : 'Save Product'}
                            </button>
                            {editingProduct && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-full border border-outline bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface-variant"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Product Table */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">
                                Current Products
                            </h3>
                            <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                                {products.total} total
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant">
                            {/* Table Header */}
                            <div className="hidden gap-4 border-b border-outline-variant bg-surface-container-low px-4 py-3 text-xs font-semibold uppercase tracking-wide text-outline lg:grid lg:grid-cols-12">
                                <div className="col-span-5">Product</div>
                                <div className="col-span-2 text-center">Category</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-1 text-center">Stock</div>
                                <div className="col-span-1 text-center">Status</div>
                                <div className="col-span-1"></div>
                            </div>

                            {/* Table Rows */}
                            {products.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <svg className="w-12 h-12 text-outline mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <p className="text-on-surface-variant font-medium">No products found</p>
                                    <p className="mt-1 text-sm text-outline">Try adjusting your search or filters.</p>
                                </div>
                            ) : (
                                products.data.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className={`grid grid-cols-1 items-center gap-4 border-b border-outline-variant px-4 py-4 transition hover:bg-surface-container-low lg:grid lg:grid-cols-12 ${
                                            index === products.data.length - 1 ? 'border-b-0' : ''
                                        }`}
                                    >
                                        <div className="col-span-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-sm font-semibold uppercase text-on-surface-variant">
                                                {product.name.slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-on-surface">{product.name}</p>
                                                <p className="text-xs text-outline">
                                                    SKU: {product.sku || product.barcode || '—'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className="inline-flex rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface-variant">
                                                {product.category?.name || '—'}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-center font-semibold text-on-surface">
                                            {formatCurrency(product.selling_price)}
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                product.stock_quantity > 0
                                                    ? 'bg-tertiary-fixed-dim text-on-tertiary-fixed'
                                                    : 'bg-error-container text-on-error-container'
                                            }`}>
                                                {product.stock_quantity}
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                product.is_active
                                                    ? 'bg-tertiary-fixed-dim text-on-tertiary-fixed'
                                                    : 'bg-surface-container text-on-surface-variant'
                                            }`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <button
                                                type="button"
                                                onClick={() => beginEdit(product)}
                                                className="rounded-lg border border-outline px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container-low"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {products.last_page > 1 && (
                            <div className="flex items-center justify-between gap-2">
                                <button
                                    type="button"
                                    onClick={() => handlePageChange(products.current_page - 1)}
                                    disabled={!products.prev_page_url}
                                    className="rounded-lg border border-outline px-4 py-2 text-sm font-medium text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => handlePageChange(page)}
                                            className={`rounded-lg px-3 py-1 text-sm font-medium ${
                                                products.current_page === page
                                                    ? 'bg-primary text-on-primary'
                                                    : 'text-on-surface-variant hover:bg-surface-container-low'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handlePageChange(products.current_page + 1)}
                                    disabled={!products.next_page_url}
                                    className="rounded-lg border border-outline px-4 py-2 text-sm font-medium text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">
                                        Cost Change History
                                    </h3>
                                    <p className="mt-1 text-body-md text-on-surface-variant">
                                        Recent manual cost updates for this outlet.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                {recentCostHistories.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-outline-variant px-4 py-6 text-sm text-on-surface-variant">
                                        No cost changes have been recorded yet.
                                    </div>
                                ) : (
                                    recentCostHistories.map((history) => (
                                        <div
                                            key={history.id}
                                            className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3"
                                        >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="font-medium text-on-surface">
                                                        {history.product?.name || 'Unknown product'}
                                                    </p>
                                                    <p className="text-sm text-on-surface-variant">
                                                        {formatCurrency(history.previous_cost_price)} to {formatCurrency(history.new_cost_price)}
                                                    </p>
                                                </div>
                                                <div className="text-sm text-on-surface-variant sm:text-right">
                                                    <p>{history.changed_by?.name || 'System'}</p>
                                                    <p>{new Date(history.created_at).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
