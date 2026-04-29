import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

export default function CatalogIndex({
    outlets,
    selectedOutletId,
    categories,
    products,
    movements,
}) {
    const flash = usePage().props.flash || {};

    const categoryForm = useForm({
        name: '',
        description: '',
    });

    const productForm = useForm({
        outlet_id: selectedOutletId || outlets[0]?.id || '',
        category_id: categories[0]?.id || '',
        name: '',
        sku: '',
        barcode: '',
        selling_price: '',
        cost_price: '',
        stock_quantity: 0,
        minimum_stock: 0,
        image_path: '',
        is_active: true,
    });

    const movementForm = useForm({
        product_id: products[0]?.id || '',
        type: 'stock_in',
        quantity: 1,
        notes: '',
    });

    useEffect(() => {
        if (selectedOutletId) {
            productForm.setData('outlet_id', selectedOutletId);
        }
    }, [selectedOutletId]);

    useEffect(() => {
        if (!movementForm.data.product_id && products[0]?.id) {
            movementForm.setData('product_id', products[0].id);
        }
    }, [products]);

    const changeOutlet = (event) => {
        router.get(
            route('catalog.index'),
            { outlet: event.target.value || undefined },
            { preserveState: true, replace: true },
        );
    };

    const quickUpdateProduct = (product) => {
        const name = window.prompt('Product name', product.name);

        if (!name) {
            return;
        }

        const sellingPrice = window.prompt('Selling price', product.selling_price);
        const costPrice = window.prompt('Cost price', product.cost_price);
        const minimumStock = window.prompt('Minimum stock', product.minimum_stock);

        router.patch(route('catalog.products.update', product.id), {
            outlet_id: product.outlet_id,
            category_id: product.category_id || '',
            name,
            sku: product.sku || '',
            barcode: product.barcode || '',
            selling_price: Number(sellingPrice || product.selling_price),
            cost_price: Number(costPrice || product.cost_price),
            stock_quantity: product.stock_quantity,
            minimum_stock: Number(minimumStock || product.minimum_stock),
            image_path: product.image_path || '',
            is_active: product.is_active,
        });
    };

    const toggleProductStatus = (product) => {
        router.patch(route('catalog.products.update', product.id), {
            outlet_id: product.outlet_id,
            category_id: product.category_id || '',
            name: product.name,
            sku: product.sku || '',
            barcode: product.barcode || '',
            selling_price: product.selling_price,
            cost_price: product.cost_price,
            stock_quantity: product.stock_quantity,
            minimum_stock: product.minimum_stock,
            image_path: product.image_path || '',
            is_active: !product.is_active,
        });
    };

    const renameCategory = (category) => {
        const name = window.prompt('Category name', category.name);

        if (!name) {
            return;
        }

        router.patch(route('catalog.categories.update', category.id), {
            name,
            description: category.description || '',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-slate-900">
                            Catalog and inventory
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Manage products, categories, and stock movement history.
                        </p>
                    </div>
                    <select
                        value={selectedOutletId || ''}
                        onChange={changeOutlet}
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                    >
                        {outlets.map((outlet) => (
                            <option key={outlet.id} value={outlet.id}>
                                {outlet.name}
                            </option>
                        ))}
                    </select>
                </div>
            }
        >
            <Head title="Catalog" />

            <div className="space-y-6 py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
                        <div className="space-y-6">
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    New product
                                </h3>
                                <form
                                    className="mt-4 grid gap-4 md:grid-cols-2"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        productForm.post(route('catalog.products.store'));
                                    }}
                                >
                                    <select
                                        value={productForm.data.outlet_id}
                                        onChange={(event) =>
                                            productForm.setData('outlet_id', event.target.value)
                                        }
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    >
                                        {outlets.map((outlet) => (
                                            <option key={outlet.id} value={outlet.id}>
                                                {outlet.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={productForm.data.category_id}
                                        onChange={(event) =>
                                            productForm.setData('category_id', event.target.value)
                                        }
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    >
                                        <option value="">No category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        value={productForm.data.name}
                                        onChange={(event) =>
                                            productForm.setData('name', event.target.value)
                                        }
                                        placeholder="Product name"
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        value={productForm.data.sku}
                                        onChange={(event) =>
                                            productForm.setData('sku', event.target.value)
                                        }
                                        placeholder="SKU"
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        value={productForm.data.barcode}
                                        onChange={(event) =>
                                            productForm.setData('barcode', event.target.value)
                                        }
                                        placeholder="Barcode"
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="number"
                                        value={productForm.data.selling_price}
                                        onChange={(event) =>
                                            productForm.setData('selling_price', event.target.value)
                                        }
                                        placeholder="Selling price"
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="number"
                                        value={productForm.data.cost_price}
                                        onChange={(event) =>
                                            productForm.setData('cost_price', event.target.value)
                                        }
                                        placeholder="Cost price"
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="number"
                                        value={productForm.data.stock_quantity}
                                        onChange={(event) =>
                                            productForm.setData('stock_quantity', event.target.value)
                                        }
                                        placeholder="Opening stock"
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="number"
                                        value={productForm.data.minimum_stock}
                                        onChange={(event) =>
                                            productForm.setData('minimum_stock', event.target.value)
                                        }
                                        placeholder="Minimum stock"
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        value={productForm.data.image_path}
                                        onChange={(event) =>
                                            productForm.setData('image_path', event.target.value)
                                        }
                                        placeholder="Image path or URL"
                                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                                    />
                                    <label className="flex items-center gap-2 text-sm text-slate-600 md:col-span-2">
                                        <input
                                            type="checkbox"
                                            checked={productForm.data.is_active}
                                            onChange={(event) =>
                                                productForm.setData('is_active', event.target.checked)
                                            }
                                        />
                                        Active for checkout
                                    </label>
                                    <button className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white md:col-span-2">
                                        Save product
                                    </button>
                                </form>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                        Products
                                    </h3>
                                    <span className="text-xs uppercase tracking-wide text-slate-400">
                                        {products.length} items
                                    </span>
                                </div>
                                <div className="mt-4 overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="text-left text-slate-400">
                                            <tr>
                                                <th className="pb-3">Name</th>
                                                <th className="pb-3">Category</th>
                                                <th className="pb-3">Price</th>
                                                <th className="pb-3">Stock</th>
                                                <th className="pb-3">Status</th>
                                                <th className="pb-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-600">
                                            {products.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="py-3">
                                                        <div className="font-medium text-slate-900">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {product.sku || 'No SKU'}
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        {product.category?.name || 'Uncategorized'}
                                                    </td>
                                                    <td className="py-3">
                                                        {formatCurrency(product.selling_price)}
                                                    </td>
                                                    <td className="py-3">
                                                        {product.stock_quantity} / min {product.minimum_stock}
                                                    </td>
                                                    <td className="py-3">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                                product.is_active
                                                                    ? 'bg-emerald-50 text-emerald-700'
                                                                    : 'bg-slate-100 text-slate-500'
                                                            }`}
                                                        >
                                                            {product.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => quickUpdateProduct(product)}
                                                                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleProductStatus(product)}
                                                                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700"
                                                            >
                                                                {product.is_active ? 'Deactivate' : 'Activate'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Category management
                                </h3>
                                <form
                                    className="mt-4 space-y-3"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        categoryForm.post(route('catalog.categories.store'));
                                    }}
                                >
                                    <input
                                        value={categoryForm.data.name}
                                        onChange={(event) =>
                                            categoryForm.setData('name', event.target.value)
                                        }
                                        placeholder="Category name"
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <textarea
                                        value={categoryForm.data.description}
                                        onChange={(event) =>
                                            categoryForm.setData('description', event.target.value)
                                        }
                                        placeholder="Description"
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <button className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                                        Add category
                                    </button>
                                </form>
                                <div className="mt-4 space-y-3">
                                    {categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {category.name}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {category.description || 'No description'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => renameCategory(category)}
                                                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700"
                                            >
                                                Rename
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Record stock movement
                                </h3>
                                <form
                                    className="mt-4 space-y-3"
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
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    >
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={movementForm.data.type}
                                        onChange={(event) =>
                                            movementForm.setData('type', event.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    >
                                        <option value="stock_in">Stock in</option>
                                        <option value="stock_out">Stock out</option>
                                    </select>
                                    <input
                                        type="number"
                                        value={movementForm.data.quantity}
                                        onChange={(event) =>
                                            movementForm.setData('quantity', event.target.value)
                                        }
                                        min="1"
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <textarea
                                        value={movementForm.data.notes}
                                        onChange={(event) =>
                                            movementForm.setData('notes', event.target.value)
                                        }
                                        placeholder="Reason or reference"
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    <button className="rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white">
                                        Save movement
                                    </button>
                                </form>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Recent movements
                                </h3>
                                <div className="mt-4 space-y-3">
                                    {movements.map((movement) => (
                                        <div
                                            key={movement.id}
                                            className="rounded-2xl border border-slate-200 p-4"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="font-medium text-slate-900">
                                                    {movement.product?.name}
                                                </p>
                                                <span className="text-xs uppercase tracking-wide text-slate-400">
                                                    {movement.type}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Qty {movement.quantity} • Balance {movement.balance_after}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {movement.user?.name} • {movement.outlet?.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
