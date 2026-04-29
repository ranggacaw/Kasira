<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OperationsController;
use App\Http\Controllers\Pos\CheckoutController;
use App\Http\Controllers\PremiumController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', DashboardController::class)->middleware(['auth', 'active'])->name('dashboard');

Route::middleware(['auth', 'active'])->group(function () {
    Route::get('/pos', [CheckoutController::class, 'index'])->name('pos.index');
    Route::post('/pos', [CheckoutController::class, 'store'])->name('pos.store');
    Route::get('/pos/success/{transaction}', [CheckoutController::class, 'success'])->name('pos.success');
    Route::post('/pos/drafts', [CheckoutController::class, 'storeDraft'])->name('pos.drafts.store');
    Route::delete('/pos/drafts/{draftOrder}', [CheckoutController::class, 'destroyDraft'])->name('pos.drafts.destroy');

    Route::get('/pos/checkout', fn () => redirect()->route('pos.index'))->name('pos.checkout');
    Route::post('/pos/checkout', [CheckoutController::class, 'store'])->name('pos.checkout.store');

    Route::get('/products', [CatalogController::class, 'products'])->name('products.index');
    Route::post('/products', [CatalogController::class, 'storeProduct'])->name('products.store');
    Route::patch('/products/{product}', [CatalogController::class, 'updateProduct'])->name('products.update');
    Route::get('/categories', [CatalogController::class, 'categories'])->name('categories.index');
    Route::post('/categories', [CatalogController::class, 'storeCategory'])->name('categories.store');
    Route::patch('/categories/{category}', [CatalogController::class, 'updateCategory'])->name('categories.update');
    Route::post('/categories/units', [CatalogController::class, 'storeUnit'])->name('units.store');
    Route::patch('/categories/units/{unit}', [CatalogController::class, 'updateUnit'])->name('units.update');
    Route::get('/inventory', [CatalogController::class, 'inventory'])->name('inventory.index');
    Route::post('/inventory/movements', [CatalogController::class, 'storeMovement'])->name('inventory.movements.store');

    Route::get('/catalog', fn () => redirect()->route('products.index'))->name('catalog.index');
    Route::post('/catalog/categories', [CatalogController::class, 'storeCategory'])->name('catalog.categories.store');
    Route::patch('/catalog/categories/{category}', [CatalogController::class, 'updateCategory'])->name('catalog.categories.update');
    Route::post('/catalog/products', [CatalogController::class, 'storeProduct'])->name('catalog.products.store');
    Route::patch('/catalog/products/{product}', [CatalogController::class, 'updateProduct'])->name('catalog.products.update');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::post('/transactions/{transaction}/receipts', [TransactionController::class, 'queueReceipt'])->name('transactions.receipts.store');
    Route::get('/transactions/{transaction}/download', [TransactionController::class, 'downloadReceipt'])->name('transactions.download');
    Route::post('/transactions/{transaction}/refund', [TransactionController::class, 'refund'])->name('transactions.refund');

    Route::get('/operations', [OperationsController::class, 'index'])->name('operations.index');
    Route::post('/operations/outlets', [OperationsController::class, 'storeOutlet'])->name('operations.outlets.store');
    Route::patch('/operations/outlets/{outlet}', [OperationsController::class, 'updateOutlet'])->name('operations.outlets.update');
    Route::post('/operations/users', [OperationsController::class, 'storeUser'])->name('operations.users.store');
    Route::patch('/operations/users/{user}', [OperationsController::class, 'updateUser'])->name('operations.users.update');
    Route::post('/operations/customers', [OperationsController::class, 'storeCustomer'])->name('operations.customers.store');
    Route::patch('/operations/customers/{customer}', [OperationsController::class, 'updateCustomer'])->name('operations.customers.update');

    Route::get('/reports', [PremiumController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [PremiumController::class, 'exportReport'])->name('reports.export');
    Route::get('/premium', fn () => redirect()->route('reports.index'))->name('premium.index');
    Route::get('/premium/reports/export', [PremiumController::class, 'exportReport'])->name('premium.reports.export');
    Route::post('/premium/promotions', [PremiumController::class, 'storePromotion'])->name('premium.promotions.store');
    Route::post('/premium/vouchers', [PremiumController::class, 'storeVoucher'])->name('premium.vouchers.store');
    Route::post('/premium/shifts/open', [PremiumController::class, 'openShift'])->name('premium.shifts.open');
    Route::patch('/premium/shifts/{shift}/close', [PremiumController::class, 'closeShift'])->name('premium.shifts.close');
    Route::patch('/premium/subscription', [PremiumController::class, 'updateSubscription'])->name('premium.subscription.update');

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::patch('/settings/business', [SettingsController::class, 'updateBusiness'])->name('settings.business.update');
    Route::patch('/settings/receipt', [SettingsController::class, 'updateReceipt'])->name('settings.receipt.update');
    Route::patch('/settings/payments', [SettingsController::class, 'updatePayments'])->name('settings.payments.update');
    Route::patch('/settings/pwa', [SettingsController::class, 'updatePwa'])->name('settings.pwa.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
