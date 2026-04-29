<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesOutletContext;
use App\Models\Category;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    use ResolvesOutletContext;

    public function index(Request $request): Response
    {
        return $this->products($request);
    }

    public function products(Request $request): Response
    {
        abort_unless($request->user()->canManageCatalog(), 403);

        $outlets = Outlet::query()->orderByDesc('is_primary')->orderBy('name')->get();
        $currentOutlet = $this->resolveCurrentOutlet($request);

        $products = Product::query()
            ->with(['category:id,name', 'outlet:id,name', 'unit:id,name,short_name'])
            ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Index', [
            'outlets' => $outlets,
            'selectedOutletId' => $currentOutlet?->id,
            'categories' => Category::query()->where('is_active', true)->orderBy('sort_order')->orderBy('name')->get(),
            'units' => Unit::query()->orderBy('name')->get(),
            'products' => $products,
        ]);
    }

    public function categories(Request $request): Response
    {
        abort_unless($request->user()->canManageCatalog(), 403);

        return Inertia::render('Categories/Index', [
            'categories' => Category::query()
                ->withCount('products')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
            'units' => Unit::query()->orderBy('name')->get(),
        ]);
    }

    public function inventory(Request $request): Response
    {
        abort_unless($request->user()->canManageCatalog(), 403);

        $filters = $request->validate([
            'product_id' => ['nullable', 'exists:products,id'],
            'movement_type' => ['nullable', Rule::in([
                StockMovement::TYPE_IN,
                StockMovement::TYPE_OUT,
                StockMovement::TYPE_ADJUSTMENT,
                StockMovement::TYPE_SALE,
                StockMovement::TYPE_REFUND,
            ])],
        ]);

        $outlets = Outlet::query()->orderByDesc('is_primary')->orderBy('name')->get();
        $currentOutlet = $this->resolveCurrentOutlet($request);

        return Inertia::render('Inventory/Index', [
            'filters' => $filters,
            'outlets' => $outlets,
            'selectedOutletId' => $currentOutlet?->id,
            'products' => Product::query()
                ->with(['category:id,name', 'unit:id,name,short_name'])
                ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
                ->orderBy('name')
                ->get(),
            'movements' => StockMovement::query()
                ->with(['product:id,name', 'outlet:id,name', 'user:id,name'])
                ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
                ->when($filters['product_id'] ?? null, fn ($query, $value) => $query->where('product_id', $value))
                ->when($filters['movement_type'] ?? null, fn ($query, $value) => $query->where('type', $value))
                ->latest()
                ->limit(30)
                ->get(),
            'lowStockAlerts' => Product::query()
                ->with(['category:id,name', 'outlet:id,name'])
                ->when($currentOutlet, fn ($query) => $query->where('outlet_id', $currentOutlet->id))
                ->where('track_stock', true)
                ->where('minimum_stock', '>', 0)
                ->whereColumn('stock_quantity', '<', 'minimum_stock')
                ->orderBy('stock_quantity')
                ->get(),
        ]);
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManageCatalog(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
            'color' => ['required', 'string', 'max:20'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        Category::query()->create($validated);

        return back()->with('success', 'Category created.');
    }

    public function updateCategory(Request $request, Category $category): RedirectResponse
    {
        abort_unless($request->user()->canManageCatalog(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($category->id)],
            'description' => ['nullable', 'string'],
            'color' => ['required', 'string', 'max:20'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        $category->update($validated);

        return back()->with('success', 'Category updated.');
    }

    public function storeUnit(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManageCatalog(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:units,name'],
            'short_name' => ['required', 'string', 'max:20', 'unique:units,short_name'],
            'description' => ['nullable', 'string'],
        ]);

        Unit::query()->create($validated);

        return back()->with('success', 'Unit created.');
    }

    public function updateUnit(Request $request, Unit $unit): RedirectResponse
    {
        abort_unless($request->user()->canManageCatalog(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('units', 'name')->ignore($unit->id)],
            'short_name' => ['required', 'string', 'max:20', Rule::unique('units', 'short_name')->ignore($unit->id)],
            'description' => ['nullable', 'string'],
        ]);

        $unit->update($validated);

        return back()->with('success', 'Unit updated.');
    }

    public function storeProduct(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManageCatalog(), 403);

        $validated = $this->validateProduct($request);

        DB::transaction(function () use ($request, $validated): void {
            $product = Product::query()->create($validated);

            if ($product->track_stock && $product->stock_quantity > 0) {
                StockMovement::query()->create([
                    'product_id' => $product->id,
                    'outlet_id' => $product->outlet_id,
                    'user_id' => $request->user()->id,
                    'type' => StockMovement::TYPE_IN,
                    'quantity' => $product->stock_quantity,
                    'balance_after' => $product->stock_quantity,
                    'notes' => 'Initial stock balance.',
                ]);
            }
        });

        return to_route('catalog.index', ['outlet' => $validated['outlet_id']])->with('success', 'Product created.');
    }

    public function updateProduct(Request $request, Product $product): RedirectResponse
    {
        abort_unless($request->user()->canManageCatalog(), 403);

        $validated = $this->validateProduct($request, $product);
        $originalStock = $product->stock_quantity;

        DB::transaction(function () use ($request, $product, $validated, $originalStock): void {
            $product->update($validated);

            $difference = $product->stock_quantity - $originalStock;

            if ($product->track_stock && $difference !== 0) {
                StockMovement::query()->create([
                    'product_id' => $product->id,
                    'outlet_id' => $product->outlet_id,
                    'user_id' => $request->user()->id,
                    'type' => $difference > 0 ? StockMovement::TYPE_IN : StockMovement::TYPE_OUT,
                    'quantity' => abs($difference),
                    'balance_after' => $product->stock_quantity,
                    'notes' => 'Catalog stock adjustment.',
                ]);
            }
        });

        return to_route('catalog.index', ['outlet' => $product->outlet_id])->with('success', 'Product updated.');
    }

    public function storeMovement(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManageCatalog(), 403);

        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'type' => ['required', Rule::in([StockMovement::TYPE_IN, StockMovement::TYPE_OUT, StockMovement::TYPE_ADJUSTMENT])],
            'quantity' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        $product = Product::query()->findOrFail($validated['product_id']);

        DB::transaction(function () use ($request, $validated, $product): void {
            $balanceAfter = match ($validated['type']) {
                StockMovement::TYPE_IN => $product->stock_quantity + $validated['quantity'],
                StockMovement::TYPE_ADJUSTMENT => $validated['quantity'],
                default => $product->stock_quantity - $validated['quantity'],
            };

            if ($balanceAfter < 0) {
                throw ValidationException::withMessages([
                    'quantity' => 'Stock out movements may not reduce stock below zero.',
                ]);
            }

            if ($product->track_stock) {
                $product->update(['stock_quantity' => $balanceAfter]);
            }

            StockMovement::query()->create([
                'product_id' => $product->id,
                'outlet_id' => $product->outlet_id,
                'user_id' => $request->user()->id,
                'type' => $validated['type'],
                'quantity' => $validated['quantity'],
                'balance_after' => $product->track_stock ? $balanceAfter : $product->stock_quantity,
                'notes' => $validated['notes'] ?? null,
            ]);
        });

        return to_route('catalog.index', ['outlet' => $product->outlet_id])->with('success', 'Stock movement recorded.');
    }

    protected function validateProduct(Request $request, ?Product $product = null): array
    {
        return $request->validate([
            'outlet_id' => ['required', 'exists:outlets,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'unit_id' => ['nullable', 'exists:units,id'],
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:255', Rule::unique('products', 'sku')->ignore($product?->id)],
            'barcode' => ['nullable', 'string', 'max:255', Rule::unique('products', 'barcode')->ignore($product?->id)],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'cost_price' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'minimum_stock' => ['required', 'integer', 'min:0'],
            'image_path' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
            'track_stock' => ['required', 'boolean'],
        ]);
    }
}
