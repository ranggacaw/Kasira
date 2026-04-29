import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const emptyCategory = {
    name: '',
    description: '',
    color: '#0f766e',
    sort_order: 0,
    is_active: true,
};

const emptyUnit = {
    name: '',
    short_name: '',
    description: '',
};

export default function CategoriesIndex({ categories, units }) {
    const flash = usePage().props.flash || {};
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingUnit, setEditingUnit] = useState(null);
    const categoryForm = useForm(emptyCategory);
    const unitForm = useForm(emptyUnit);

    const startCategoryEdit = (category) => {
        setEditingCategory(category);
        categoryForm.setData({
            name: category.name,
            description: category.description || '',
            color: category.color,
            sort_order: category.sort_order,
            is_active: category.is_active,
        });
    };

    const startUnitEdit = (unit) => {
        setEditingUnit(unit);
        unitForm.setData({
            name: unit.name,
            short_name: unit.short_name,
            description: unit.description || '',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Categories and units
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Organize POS browsing with active categories, sort order, and shared sellable units.
                    </p>
                </div>
            }
        >
            <Head title="Categories" />

            <div className="space-y-6 pb-24">
                {flash.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editingCategory ? 'Edit category' : 'New category'}
                            </h3>
                            {editingCategory && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingCategory(null);
                                        categoryForm.setData(emptyCategory);
                                    }}
                                    className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <form
                            className="mt-5 space-y-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (editingCategory) {
                                    categoryForm.patch(
                                        route('categories.update', editingCategory.id),
                                    );
                                    return;
                                }
                                categoryForm.post(route('categories.store'));
                            }}
                        >
                            <input
                                value={categoryForm.data.name}
                                onChange={(event) =>
                                    categoryForm.setData('name', event.target.value)
                                }
                                placeholder="Category name"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <textarea
                                value={categoryForm.data.description}
                                onChange={(event) =>
                                    categoryForm.setData('description', event.target.value)
                                }
                                placeholder="Description"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <div className="grid gap-3 sm:grid-cols-3">
                                <input
                                    value={categoryForm.data.color}
                                    onChange={(event) =>
                                        categoryForm.setData('color', event.target.value)
                                    }
                                    placeholder="#0f766e"
                                    className="rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                                />
                                <input
                                    type="number"
                                    value={categoryForm.data.sort_order}
                                    onChange={(event) =>
                                        categoryForm.setData('sort_order', event.target.value)
                                    }
                                    placeholder="Sort order"
                                    className="rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                                />
                                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={categoryForm.data.is_active}
                                        onChange={(event) =>
                                            categoryForm.setData('is_active', event.target.checked)
                                        }
                                    />
                                    Active
                                </label>
                            </div>
                            <button className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                                {editingCategory ? 'Save category' : 'Add category'}
                            </button>
                        </form>

                        <div className="mt-6 space-y-3">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => startCategoryEdit(category)}
                                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="h-4 w-4 rounded-full"
                                            style={{ backgroundColor: category.color }}
                                        />
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {category.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {category.products_count} products
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs uppercase tracking-wide text-slate-400">
                                        {category.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editingUnit ? 'Edit unit' : 'New unit'}
                            </h3>
                            {editingUnit && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingUnit(null);
                                        unitForm.setData(emptyUnit);
                                    }}
                                    className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <form
                            className="mt-5 space-y-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (editingUnit) {
                                    unitForm.patch(route('units.update', editingUnit.id));
                                    return;
                                }
                                unitForm.post(route('units.store'));
                            }}
                        >
                            <input
                                value={unitForm.data.name}
                                onChange={(event) => unitForm.setData('name', event.target.value)}
                                placeholder="Unit name"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <input
                                value={unitForm.data.short_name}
                                onChange={(event) =>
                                    unitForm.setData('short_name', event.target.value)
                                }
                                placeholder="Short name"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <textarea
                                value={unitForm.data.description}
                                onChange={(event) =>
                                    unitForm.setData('description', event.target.value)
                                }
                                placeholder="Description"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                            />
                            <button className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
                                {editingUnit ? 'Save unit' : 'Add unit'}
                            </button>
                        </form>

                        <div className="mt-6 space-y-3">
                            {units.map((unit) => (
                                <button
                                    key={unit.id}
                                    type="button"
                                    onClick={() => startUnitEdit(unit)}
                                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {unit.name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {unit.short_name}
                                        </p>
                                    </div>
                                    <span className="text-xs uppercase tracking-wide text-slate-400">
                                        Tap to edit
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
