<?php

namespace App\Http\Middleware;

use App\Models\Subscription;
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
}
