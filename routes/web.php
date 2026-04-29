<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OperationsController;
use App\Http\Controllers\Pos\CheckoutController;
use App\Http\Controllers\PremiumController;
use App\Http\Controllers\ProfileController;
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
    Route::get('/pos/checkout', [CheckoutController::class, 'index'])->name('pos.checkout');
    Route::post('/pos/checkout', [CheckoutController::class, 'store'])->name('pos.checkout.store');

    Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');
    Route::post('/catalog/categories', [CatalogController::class, 'storeCategory'])->name('catalog.categories.store');
    Route::patch('/catalog/categories/{category}', [CatalogController::class, 'updateCategory'])->name('catalog.categories.update');
    Route::post('/catalog/products', [CatalogController::class, 'storeProduct'])->name('catalog.products.store');
    Route::patch('/catalog/products/{product}', [CatalogController::class, 'updateProduct'])->name('catalog.products.update');
    Route::post('/inventory/movements', [CatalogController::class, 'storeMovement'])->name('inventory.movements.store');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::post('/transactions/{transaction}/receipts', [TransactionController::class, 'queueReceipt'])->name('transactions.receipts.store');

    Route::get('/operations', [OperationsController::class, 'index'])->name('operations.index');
    Route::post('/operations/outlets', [OperationsController::class, 'storeOutlet'])->name('operations.outlets.store');
    Route::patch('/operations/outlets/{outlet}', [OperationsController::class, 'updateOutlet'])->name('operations.outlets.update');
    Route::post('/operations/users', [OperationsController::class, 'storeUser'])->name('operations.users.store');
    Route::patch('/operations/users/{user}', [OperationsController::class, 'updateUser'])->name('operations.users.update');
    Route::post('/operations/customers', [OperationsController::class, 'storeCustomer'])->name('operations.customers.store');
    Route::patch('/operations/customers/{customer}', [OperationsController::class, 'updateCustomer'])->name('operations.customers.update');

    Route::get('/premium', [PremiumController::class, 'index'])->name('premium.index');
    Route::get('/premium/reports/export', [PremiumController::class, 'exportReport'])->name('premium.reports.export');
    Route::post('/premium/promotions', [PremiumController::class, 'storePromotion'])->name('premium.promotions.store');
    Route::post('/premium/vouchers', [PremiumController::class, 'storeVoucher'])->name('premium.vouchers.store');
    Route::post('/premium/shifts/open', [PremiumController::class, 'openShift'])->name('premium.shifts.open');
    Route::patch('/premium/shifts/{shift}/close', [PremiumController::class, 'closeShift'])->name('premium.shifts.close');
    Route::patch('/premium/subscription', [PremiumController::class, 'updateSubscription'])->name('premium.subscription.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
