<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Customer;
use App\Models\Outlet;
use App\Models\Payment;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->canManageSettings(), 403);

        $subscription = Subscription::current();

        return Inertia::render('Settings/Index', [
            'settings' => AppSetting::current(),
            'paymentMethods' => Payment::methods(),
            'outlets' => Outlet::query()->orderByDesc('is_primary')->orderBy('name')->get(),
            'staffUsers' => User::query()->with(['role:id,name', 'outlet:id,name'])->orderBy('name')->get(),
            'roles' => Role::query()->orderBy('name')->get(),
            'customers' => Customer::query()->orderBy('name')->get(),
            'subscription' => $subscription,
            'usage' => [
                'activeUsers' => User::query()->where('is_active', true)->count(),
                'activeOutlets' => Outlet::query()->where('is_active', true)->count(),
            ],
        ]);
    }

    public function updateBusiness(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManageSettings(), 403);

        $validated = $request->validate([
            'business_name' => ['required', 'string', 'max:255'],
            'business_phone' => ['nullable', 'string', 'max:50'],
            'business_address' => ['nullable', 'string'],
            'logo_path' => ['nullable', 'string', 'max:255'],
            'currency' => ['required', 'string', 'max:10'],
            'timezone' => ['required', 'string', 'max:100'],
        ]);

        AppSetting::current()->update($validated);

        return back()->with('success', 'Business settings updated.');
    }

    public function updateReceipt(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManageSettings(), 403);

        $validated = $request->validate([
            'receipt_header' => ['nullable', 'string'],
            'receipt_footer' => ['nullable', 'string'],
            'show_cashier_on_receipt' => ['required', 'boolean'],
            'show_tax_breakdown_on_receipt' => ['required', 'boolean'],
        ]);

        AppSetting::current()->update($validated);

        return back()->with('success', 'Receipt settings updated.');
    }

    public function updatePayments(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManageSettings(), 403);

        $validated = $request->validate([
            'enabled_payment_methods' => ['required', 'array', 'min:1'],
            'enabled_payment_methods.*' => ['required', Rule::in(Payment::methods())],
        ]);

        AppSetting::current()->update($validated);

        return back()->with('success', 'Payment methods updated.');
    }

    public function updatePwa(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManageSettings(), 403);

        $validated = $request->validate([
            'pwa_name' => ['required', 'string', 'max:255'],
            'pwa_short_name' => ['required', 'string', 'max:50'],
            'pwa_theme_color' => ['required', 'string', 'max:20'],
            'pwa_description' => ['nullable', 'string'],
        ]);

        $settings = AppSetting::current();
        $settings->update($validated);

        File::put(
            public_path('manifest.webmanifest'),
            json_encode([
                'name' => $settings->pwa_name,
                'short_name' => $settings->pwa_short_name,
                'id' => '/?source=pwa',
                'start_url' => '/dashboard?source=pwa',
                'scope' => '/',
                'display_override' => ['window-controls-overlay', 'standalone'],
                'display' => 'standalone',
                'orientation' => 'portrait',
                'background_color' => '#ffffff',
                'theme_color' => $settings->pwa_theme_color,
                'description' => $settings->pwa_description ?: 'Kasira business operations and POS workspace.',
                'categories' => ['business', 'productivity', 'shopping'],
                'icons' => [
                    [
                        'src' => '/icons/kasira-icon.svg',
                        'sizes' => 'any',
                        'type' => 'image/svg+xml',
                        'purpose' => 'any',
                    ],
                    [
                        'src' => '/icons/kasira-maskable.svg',
                        'sizes' => 'any',
                        'type' => 'image/svg+xml',
                        'purpose' => 'maskable',
                    ],
                ],
                'shortcuts' => [
                    [
                        'name' => 'Open dashboard',
                        'short_name' => 'Dashboard',
                        'url' => '/dashboard',
                    ],
                    [
                        'name' => 'Start sale',
                        'short_name' => 'POS',
                        'url' => '/pos',
                    ],
                ],
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        );

        return back()->with('success', 'PWA appearance updated.');
    }
}
