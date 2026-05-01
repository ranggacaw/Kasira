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

const emptyForm = (outletId = '', unitId = '') => ({
    outlet_id: outletId,
    category_id: '',
    unit_id: unitId,
    name: '',
    sku: '',
    barcode: '',
    selling_price: '',
    cost_price: '',
    stock_quantity: 0,
    minimum_stock: 0,
    image_path: '',
    is_active: true,
    track_stock: true,
});

export default function ProductsIndex({
    outlets,
    selectedOutletId,
    categories,
    units,
    products,
}) {
    const flash = usePage().props.flash || {};
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const defaultUnitId = units[0]?.id || '';
    const productForm = useForm(emptyForm(selectedOutletId || outlets[0]?.id || '', defaultUnitId));

    useEffect(() => {
        if (!editingProduct) {
            productForm.setData('outlet_id', selectedOutletId || outlets[0]?.id || '');
        }
    }, [selectedOutletId]);

    const changeOutlet = (event) => {
        router.get(
            route('products.index'),
            { outlet: event.target.value || undefined },
            { preserveState: true, replace: true },
        );
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        router.get(
            route('products.index'),
            {
                outlet: selectedOutletId || undefined,
                search: event.target.value || undefined,
                category: filterCategory || undefined,
                status: filterStatus || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleCategoryFilter = (event) => {
        setFilterCategory(event.target.value);
        router.get(
            route('products.index'),
            {
                outlet: selectedOutletId || undefined,
                search: searchQuery || undefined,
                category: event.target.value || undefined,
                status: filterStatus || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleStatusFilter = (event) => {
        setFilterStatus(event.target.value);
        router.get(
            route('products.index'),
            {
                outlet: selectedOutletId || undefined,
                search: searchQuery || undefined,
                category: filterCategory || undefined,
                status: event.target.value || undefined,
            },
            { preserveState: true, replace: true },
        );
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

    const activeCount = products.filter((p) => p.is_active).length;
    const totalCount = products.length;

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
                        className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant"
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
                    <div className="relative flex-1 min-w-64">
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
                        className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant"
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
                        className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant"
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
                            <input
                                value={productForm.data.name}
                                onChange={(event) => productForm.setData('name', event.target.value)}
                                placeholder="Product name"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <div className="grid grid-cols-2 gap-3">
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
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    value={productForm.data.sku}
                                    onChange={(event) => productForm.setData('sku', event.target.value)}
                                    placeholder="SKU"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                                <input
                                    value={productForm.data.barcode}
                                    onChange={(event) => productForm.setData('barcode', event.target.value)}
                                    placeholder="Barcode"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
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
                            <div className="grid grid-cols-2 gap-3">
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

                        <div className="sticky bottom-4 mt-5 flex gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest/95 p-3 backdrop-blur">
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
                                {activeCount}/{totalCount} active
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
                            {products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <svg className="w-12 h-12 text-outline mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <p className="text-on-surface-variant font-medium">No products found</p>
                                    <p className="mt-1 text-sm text-outline">Try adjusting your search or filters.</p>
                                </div>
                            ) : (
                                products.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className={`grid grid-cols-1 items-center gap-4 border-b border-outline-variant px-4 py-4 transition hover:bg-surface-container-low lg:grid lg:grid-cols-12 ${
                                            index === products.length - 1 ? 'border-b-0' : ''
                                        }`}
                                    >
                                        <div className="col-span-5 flex items-center gap-3">
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
