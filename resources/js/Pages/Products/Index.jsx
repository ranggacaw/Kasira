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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold leading-tight text-on-surface">
                            Products
                        </h2>
                        <p className="mt-1 text-sm text-outline">
                            Outlet-aware product administration with touch-friendly detail editing.
                        </p>
                    </div>
                    <SelectInput
                        value={selectedOutletId || ''}
                        onChange={changeOutlet}
                        className="rounded-full border border-outline px-4 py-2 text-sm text-on-surface-variant"
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
                    <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-container px-4 py-3 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
                    <form
                        onSubmit={submit}
                        className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-semibold text-on-surface">
                                    {editingProduct ? 'Edit product' : 'New product'}
                                </h3>
                                <p className="mt-1 text-sm text-outline">
                                    Sticky actions keep saves within thumb reach on tablet and mobile.
                                </p>
                            </div>
                            {editingProduct && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-full border border-outline px-3 py-2 text-sm font-medium text-on-surface-variant"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="mt-5 space-y-4">
                            <input
                                value={productForm.data.name}
                                onChange={(event) => productForm.setData('name', event.target.value)}
                                placeholder="Product name"
                                className="w-full rounded-xl border border-outline px-4 py-3 text-sm"
                            />
                            <div className="grid gap-3 sm:grid-cols-2">
                                <SelectInput
                                    value={productForm.data.category_id}
                                    onChange={(event) => productForm.setData('category_id', event.target.value)}
                                    className="rounded-xl border border-outline px-4 py-3 text-sm"
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
                                    className="rounded-xl border border-outline px-4 py-3 text-sm"
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
                                    placeholder="SKU"
                                    className="rounded-xl border border-outline px-4 py-3 text-sm"
                                />
                                <input
                                    value={productForm.data.barcode}
                                    onChange={(event) => productForm.setData('barcode', event.target.value)}
                                    placeholder="Barcode"
                                    className="rounded-xl border border-outline px-4 py-3 text-sm"
                                />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    type="number"
                                    value={productForm.data.selling_price}
                                    onChange={(event) =>
                                        productForm.setData('selling_price', event.target.value)
                                    }
                                    placeholder="Selling price"
                                    className="rounded-xl border border-outline px-4 py-3 text-sm"
                                />
                                <input
                                    type="number"
                                    value={productForm.data.cost_price}
                                    onChange={(event) =>
                                        productForm.setData('cost_price', event.target.value)
                                    }
                                    placeholder="Cost price"
                                    className="rounded-xl border border-outline px-4 py-3 text-sm"
                                />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    type="number"
                                    value={productForm.data.stock_quantity}
                                    onChange={(event) =>
                                        productForm.setData('stock_quantity', event.target.value)
                                    }
                                    placeholder="Stock quantity"
                                    className="rounded-xl border border-outline px-4 py-3 text-sm"
                                />
                                <input
                                    type="number"
                                    value={productForm.data.minimum_stock}
                                    onChange={(event) =>
                                        productForm.setData('minimum_stock', event.target.value)
                                    }
                                    placeholder="Minimum stock"
                                    className="rounded-xl border border-outline px-4 py-3 text-sm"
                                />
                            </div>
                            <input
                                value={productForm.data.image_path}
                                onChange={(event) => productForm.setData('image_path', event.target.value)}
                                placeholder="Image path or URL"
                                className="w-full rounded-xl border border-outline px-4 py-3 text-sm"
                            />
                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className="flex items-center gap-3 rounded-xl border border-outline-variant px-4 py-3 text-sm text-on-surface-variant">
                                    <input
                                        type="checkbox"
                                        checked={productForm.data.is_active}
                                        onChange={(event) =>
                                            productForm.setData('is_active', event.target.checked)
                                        }
                                    />
                                    Active for checkout
                                </label>
                                <label className="flex items-center gap-3 rounded-xl border border-outline-variant px-4 py-3 text-sm text-on-surface-variant">
                                    <input
                                        type="checkbox"
                                        checked={productForm.data.track_stock}
                                        onChange={(event) =>
                                            productForm.setData('track_stock', event.target.checked)
                                        }
                                    />
                                    Track stock
                                </label>
                            </div>
                        </div>

                        <div className="sticky bottom-4 mt-6 flex gap-3 rounded-[1.5rem] border border-outline-variant bg-surface-container-lowest/95 p-3 backdrop-blur">
                            <button className="flex-1 rounded-full bg-on-surface px-4 py-3 text-sm font-semibold text-white">
                                {editingProduct ? 'Save changes' : 'Save product'}
                            </button>
                            {editingProduct && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-full border border-outline px-4 py-3 text-sm font-semibold text-on-surface-variant"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-on-surface">
                                Current products
                            </h3>
                            <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                                {products.length} items
                            </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {products.map((product) => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => beginEdit(product)}
                                    className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-5 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-lg font-semibold text-on-surface">
                                                {product.name}
                                            </p>
                                            <p className="mt-1 text-sm text-outline">
                                                {(product.category?.name || 'Uncategorized') + ' • ' + (product.unit?.short_name || 'pcs')}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                product.is_active
                                                    ? 'bg-tertiary-container text-tertiary-container'
                                                    : 'bg-surface-container-low text-outline'
                                            }`}
                                        >
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-xl bg-surface-container-low p-3">
                                            <p className="text-xs uppercase tracking-wide text-outline">
                                                Price
                                            </p>
                                            <p className="mt-1 font-semibold text-on-surface">
                                                {formatCurrency(product.selling_price)}
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-surface-container-low p-3">
                                            <p className="text-xs uppercase tracking-wide text-outline">
                                                Stock
                                            </p>
                                            <p className="mt-1 font-semibold text-on-surface">
                                                {product.stock_quantity}
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-surface-container-low p-3">
                                            <p className="text-xs uppercase tracking-wide text-outline">
                                                Min
                                            </p>
                                            <p className="mt-1 font-semibold text-on-surface">
                                                {product.minimum_stock}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs uppercase tracking-wide text-outline">
                                        {product.sku || product.barcode || 'No stock code'}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
