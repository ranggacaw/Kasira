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

    const resetCategory = () => {
        setEditingCategory(null);
        categoryForm.setData(emptyCategory);
    };

    const resetUnit = () => {
        setEditingUnit(null);
        unitForm.setData(emptyUnit);
    };

    const submitCategory = (event) => {
        event.preventDefault();
        if (editingCategory) {
            categoryForm.patch(route('categories.update', editingCategory.id));
            return;
        }
        categoryForm.post(route('categories.store'));
    };

    const submitUnit = (event) => {
        event.preventDefault();
        if (editingUnit) {
            unitForm.patch(route('units.update', editingUnit.id));
            return;
        }
        unitForm.post(route('units.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-headline-md text-on-surface">
                        Categories and units
                    </h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Organize POS browsing with active categories, sort order, and shared sellable units.
                    </p>
                </div>
            }
        >
            <Head title="Categories" />

            <div className="space-y-6 pb-24">
                {flash.success && (
                    <div className="rounded-xl border border-tertiary-fixed-dim bg-tertiary-fixed-dim px-4 py-3 text-body-md text-on-tertiary-fixed">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[420px_1fr]">

                    {/* Section: Category Panel */}
                    <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                        <div className="flex items-center justify-between gap-3 mb-5">
                            <div>
                                <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">
                                    {editingCategory ? 'Edit category' : 'New category'}
                                </h3>
                                <p className="mt-1 text-body-md text-on-surface-variant">
                                    {editingCategory ? 'Update category details.' : 'Fill details below.'}
                                </p>
                            </div>
                            {editingCategory && (
                                <button
                                    type="button"
                                    onClick={resetCategory}
                                    className="rounded-full border border-outline bg-surface-container-lowest px-3 py-2 text-sm font-medium text-on-surface-variant"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <form className="space-y-4" onSubmit={submitCategory}>
                            <input
                                value={categoryForm.data.name}
                                onChange={(event) => categoryForm.setData('name', event.target.value)}
                                placeholder="Category name"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <textarea
                                value={categoryForm.data.description}
                                onChange={(event) => categoryForm.setData('description', event.target.value)}
                                placeholder="Description"
                                rows={2}
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: categoryForm.data.color || '#0f766e' }}></div>
                                    <input
                                        value={categoryForm.data.color}
                                        onChange={(event) => categoryForm.setData('color', event.target.value)}
                                        placeholder="#0f766e"
                                        className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface pl-10"
                                    />
                                </div>
                                <input
                                    type="number"
                                    value={categoryForm.data.sort_order}
                                    onChange={(event) => categoryForm.setData('sort_order', event.target.value)}
                                    placeholder="Order"
                                    className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                                />
                                <label className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md text-on-surface-variant">
                                    <input
                                        type="checkbox"
                                        checked={categoryForm.data.is_active}
                                        onChange={(event) => categoryForm.setData('is_active', event.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    Active
                                </label>
                            </div>
                            <button className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90">
                                {editingCategory ? 'Save category' : 'Add category'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-outline-variant">
                            <h4 className="text-sm font-semibold text-on-surface mb-4">
                                Existing categories ({categories.length})
                            </h4>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => startCategoryEdit(category)}
                                        className="flex w-full flex-col gap-3 rounded-lg border border-outline-variant bg-surface-container-low p-4 text-left transition hover:border-primary/30 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }}></span>
                                            <div>
                                                <p className="font-medium text-on-surface">{category.name}</p>
                                                <p className="text-xs text-outline">{category.products_count} products</p>
                                            </div>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            category.is_active
                                                ? 'bg-tertiary-fixed-dim text-on-tertiary-fixed'
                                                : 'bg-surface-container text-on-surface-variant'
                                        }`}>
                                            {category.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section: Unit Panel */}
                    <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
                        <div className="flex items-center justify-between gap-3 mb-5">
                            <div>
                                <h3 className="text-label-bold uppercase tracking-wide text-on-surface-variant">
                                    {editingUnit ? 'Edit unit' : 'New unit'}
                                </h3>
                                <p className="mt-1 text-body-md text-on-surface-variant">
                                    {editingUnit ? 'Update unit details.' : 'Add measurement units.'}
                                </p>
                            </div>
                            {editingUnit && (
                                <button
                                    type="button"
                                    onClick={resetUnit}
                                    className="rounded-full border border-outline bg-surface-container-lowest px-3 py-2 text-sm font-medium text-on-surface-variant"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <form className="space-y-4" onSubmit={submitUnit}>
                            <input
                                value={unitForm.data.name}
                                onChange={(event) => unitForm.setData('name', event.target.value)}
                                placeholder="Unit name (e.g., Portion)"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <input
                                value={unitForm.data.short_name}
                                onChange={(event) => unitForm.setData('short_name', event.target.value)}
                                placeholder="Short name (e.g., pcs)"
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <textarea
                                value={unitForm.data.description}
                                onChange={(event) => unitForm.setData('description', event.target.value)}
                                placeholder="Description (optional)"
                                rows={2}
                                className="w-full rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
                            />
                            <button className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90">
                                {editingUnit ? 'Save unit' : 'Add unit'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-outline-variant">
                            <h4 className="text-sm font-semibold text-on-surface mb-4">
                                Existing units ({units.length})
                            </h4>
                            <div className="space-y-2">
                                {units.map((unit) => (
                                    <button
                                        key={unit.id}
                                        type="button"
                                        onClick={() => startUnitEdit(unit)}
                                        className="flex w-full flex-col gap-3 rounded-lg border border-outline-variant bg-surface-container-low p-4 text-left transition hover:border-primary/30 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <p className="font-medium text-on-surface">{unit.name}</p>
                                            <p className="text-xs text-outline">{unit.short_name}</p>
                                        </div>
                                        <span className="text-xs uppercase tracking-wide text-outline">Tap to edit</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
