<?php

namespace App\Http\Middleware;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user()?->loadMissing('role');
        $subscription = Schema::hasTable('subscriptions') ? Subscription::current() : null;
        $settings = Schema::hasTable('app_settings') ? \App\Models\AppSetting::current() : null;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'role' => $user->role ? [
                        'id' => $user->role->id,
                        'name' => $user->role->name,
                    ] : null,
                    'outlet_id' => $user->outlet_id,
                    'abilities' => [
                        'checkout' => $user->canUseCheckout(),
                        'catalog' => $user->canManageCatalog(),
                        'dashboard' => $user->canViewDashboard(),
                        'transactions' => $user->canViewTransactions(),
                        'operations' => $user->canManageOperations(),
                        'customers' => $user->canManageCustomers(),
                        'reports' => $user->canViewReports(),
                        'premium' => $user->canManagePremium(),
                        'settings' => $user->canManageSettings(),
                    ],
                    'navigationGroups' => $this->buildNavigationGroups($user),
                ] : null,
            ],
            'subscription' => [
                'plan' => $subscription?->plan,
                'status' => $subscription?->status,
                'features' => $subscription?->features() ?? [],
                'outlet_limit' => $subscription?->outlet_limit,
                'user_limit' => $subscription?->user_limit,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
            ],
            'settings' => [
                'businessName' => $settings?->business_name,
                'themeColor' => $settings?->pwa_theme_color,
                'receiptFooter' => $settings?->receipt_footer,
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function buildNavigationGroups(?User $user): array
    {
        if (! $user) {
            return [];
        }

        return array_values(array_filter([
            $this->makeNavigationGroup('dashboard', 'Dashboard', [
                $user->canViewDashboard() ? $this->makeNavigationItem(
                    'dashboard-overview',
                    'Overview',
                    'dashboard',
                    ['dashboard'],
                    'M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-10h8V3h-8v8z',
                ) : null,
            ]),
            $this->makeNavigationGroup('pos', 'POS', [
                $user->canUseCheckout() ? $this->makeNavigationItem(
                    'pos-new-sale',
                    'New Sale',
                    'pos.index',
                    ['pos.index', 'pos.success'],
                    'M4 6h16M4 12h16M4 18h16',
                ) : null,
            ]),
            $this->makeNavigationGroup('catalog', 'Catalog', [
                $user->canManageCatalog() ? $this->makeNavigationItem(
                    'catalog-products',
                    'Products',
                    'products.index',
                    ['products.index'],
                    'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
                ) : null,
                $user->canManageCatalog() ? $this->makeNavigationItem(
                    'catalog-categories',
                    'Categories',
                    'categories.index',
                    ['categories.index'],
                    'M7 7h10M7 12h6m-6 5h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z',
                ) : null,
            ]),
            $this->makeNavigationGroup('inventory', 'Inventory', [
                $user->canManageCatalog() ? $this->makeNavigationItem(
                    'inventory-stock',
                    'Stock',
                    'inventory.index',
                    ['inventory.index'],
                    'M4 7h16M4 12h16M4 17h16',
                    ['section' => 'stock'],
                    'stock',
                ) : null,
                $user->canManageCatalog() ? $this->makeNavigationItem(
                    'inventory-movements',
                    'Movements',
                    'inventory.index',
                    ['inventory.index'],
                    'M5 12h14M12 5l7 7-7 7',
                    ['section' => 'movements'],
                    'movements',
                ) : null,
            ]),
            $this->makeNavigationGroup('sales', 'Sales', [
                $user->canViewTransactions() ? $this->makeNavigationItem(
                    'sales-transactions',
                    'Transactions',
                    'transactions.index',
                    ['transactions.index', 'transactions.show'],
                    'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                ) : null,
                $user->canViewReports() ? $this->makeNavigationItem(
                    'sales-reports',
                    'Reports',
                    'reports.index',
                    ['reports.index', 'reports.cogs'],
                    'M9 17v-6m4 6V7m4 10v-3M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z',
                ) : null,
            ]),
            $this->makeNavigationGroup('operations', 'Operations', [
                $user->canManageOperations() ? $this->makeNavigationItem(
                    'operations-admin',
                    'Outlets & Staff',
                    'operations.index',
                    ['operations.index'],
                    'M4 6h16M4 12h16M4 18h10',
                    ['section' => 'operations'],
                    'operations',
                ) : null,
                $user->canViewReports() ? $this->makeNavigationItem(
                    'operations-shifts',
                    'Shifts',
                    'reports.index',
                    ['reports.index', 'reports.cogs'],
                    'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                    ['section' => 'shifts'],
                    'shifts',
                ) : null,
            ]),
            $this->makeNavigationGroup('customers', 'Customers', [
                $user->canManageCustomers() ? $this->makeNavigationItem(
                    'customers-directory',
                    'Customer Directory',
                    'operations.index',
                    ['operations.index'],
                    'M17 20h5V4H2v16h5m10 0v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m12 0H7m10-10a4 4 0 11-8 0 4 4 0 018 0z',
                    ['section' => 'customers'],
                    'customers',
                ) : null,
            ]),
            $this->makeNavigationGroup('settings', 'Settings', [
                $user->canManageSettings() ? $this->makeNavigationItem(
                    'settings-business',
                    'Business Settings',
                    'settings.index',
                    ['settings.index'],
                    'M10.325 4.317a1 1 0 011.35-.936l.566.226a1 1 0 00.758 0l.566-.226a1 1 0 011.35.936l.093.615a1 1 0 00.57.746l.552.276a1 1 0 01.447 1.341l-.248.574a1 1 0 000 .791l.248.574a1 1 0 01-.447 1.341l-.552.276a1 1 0 00-.57.746l-.093.615a1 1 0 01-1.35.936l-.566-.226a1 1 0 00-.758 0l-.566.226a1 1 0 01-1.35-.936l-.093-.615a1 1 0 00-.57-.746l-.552-.276a1 1 0 01-.447-1.341l.248-.574a1 1 0 000-.791l-.248-.574a1 1 0 01.447-1.341l.552-.276a1 1 0 00.57-.746l.093-.615z M12 15.5A3.5 3.5 0 1012 8.5a3.5 3.5 0 000 7z',
                    ['section' => 'business'],
                    'business',
                ) : null,
                $user->canManageSettings() ? $this->makeNavigationItem(
                    'settings-checkout-defaults',
                    'Checkout Defaults',
                    'settings.index',
                    ['settings.index'],
                    'M12 8c-1.657 0-3 1.12-3 2.5S10.343 13 12 13s3 1.12 3 2.5S13.657 18 12 18m0-10V6m0 12v-2',
                    ['section' => 'checkout-defaults'],
                    'checkout-defaults',
                ) : null,
            ]),
        ], fn (array $group) => $group['items'] !== []));
    }

    /**
     * @param  array<int, array<string, mixed>|null>  $items
     * @return array<string, mixed>
     */
    protected function makeNavigationGroup(string $key, string $label, array $items): array
    {
        return [
            'key' => $key,
            'label' => $label,
            'items' => array_values(array_filter($items)),
        ];
    }

    /**
     * @param  array<int, string>  $matches
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    protected function makeNavigationItem(
        string $key,
        string $label,
        string $routeName,
        array $matches,
        string $icon,
        array $params = [],
        ?string $section = null,
    ): array {
        return [
            'key' => $key,
            'label' => $label,
            'routeName' => $routeName,
            'matches' => $matches,
            'icon' => $icon,
            'params' => $params,
            'section' => $section,
        ];
    }
}
