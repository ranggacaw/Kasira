<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Outlet;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OperationsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        abort_unless($user->canManageOperations() || $user->canManageCustomers(), 403);

        $subscription = Subscription::current();

        return Inertia::render('Operations/Index', [
            'canManageOperations' => $user->canManageOperations(),
            'canManageCustomers' => $user->canManageCustomers(),
            'outlets' => Outlet::query()->orderByDesc('is_primary')->orderBy('name')->get(),
            'staffUsers' => $user->canManageOperations()
                ? User::query()->with(['role:id,name', 'outlet:id,name'])->orderBy('name')->get()
                : [],
            'roles' => Role::query()->orderBy('name')->get(),
            'customers' => Customer::query()->orderBy('name')->get(),
            'subscription' => $subscription,
            'usage' => [
                'activeUsers' => User::query()->where('is_active', true)->count(),
                'activeOutlets' => Outlet::query()->where('is_active', true)->count(),
            ],
        ]);
    }

    public function storeOutlet(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManageOperations(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50', 'unique:outlets,code'],
            'address' => ['nullable', 'string'],
            'is_active' => ['required', 'boolean'],
            'is_primary' => ['required', 'boolean'],
        ]);

        if ($validated['is_active']) {
            $this->ensureOutletCapacity();
        }

        if ($validated['is_primary']) {
            Outlet::query()->update(['is_primary' => false]);
        }

        Outlet::query()->create($validated);

        return back()->with('success', 'Outlet created.');
    }

    public function updateOutlet(Request $request, Outlet $outlet): RedirectResponse
    {
        abort_unless($request->user()->canManageOperations(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('outlets', 'code')->ignore($outlet->id)],
            'address' => ['nullable', 'string'],
            'is_active' => ['required', 'boolean'],
            'is_primary' => ['required', 'boolean'],
        ]);

        if (! $outlet->is_active && $validated['is_active']) {
            $this->ensureOutletCapacity();
        }

        if ($validated['is_primary']) {
            Outlet::query()->whereKeyNot($outlet->id)->update(['is_primary' => false]);
        }

        $outlet->update($validated);

        return back()->with('success', 'Outlet updated.');
    }

    public function storeUser(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManageOperations(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role_id' => ['required', 'exists:roles,id'],
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'is_active' => ['required', 'boolean'],
        ]);

        if ($validated['is_active']) {
            $this->ensureUserCapacity();
        }

        User::query()->create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        return back()->with('success', 'Staff account created.');
    }

    public function updateUser(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()->canManageOperations(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role_id' => ['required', 'exists:roles,id'],
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'is_active' => ['required', 'boolean'],
        ]);

        if (! $user->is_active && $validated['is_active']) {
            $this->ensureUserCapacity();
        }

        if (blank($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return back()->with('success', 'Staff account updated.');
    }

    public function storeCustomer(Request $request): RedirectResponse
    {
        abort_unless($request->user()->canManageCustomers(), 403);

        $validated = $this->validateCustomer($request);
        Customer::query()->create($validated);

        return back()->with('success', 'Customer created.');
    }

    public function updateCustomer(Request $request, Customer $customer): RedirectResponse
    {
        abort_unless($request->user()->canManageCustomers(), 403);

        $customer->update($this->validateCustomer($request, $customer));

        return back()->with('success', 'Customer updated.');
    }

    protected function validateCustomer(Request $request, ?Customer $customer = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('customers', 'email')->ignore($customer?->id)],
            'phone' => ['nullable', 'string', 'max:50'],
            'membership_number' => ['nullable', 'string', 'max:100', Rule::unique('customers', 'membership_number')->ignore($customer?->id)],
            'membership_tier' => ['nullable', 'string', 'max:100'],
            'membership_discount_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'is_active' => ['required', 'boolean'],
        ]);
    }

    protected function ensureOutletCapacity(): void
    {
        $subscription = Subscription::current();
        $activeOutlets = Outlet::query()->where('is_active', true)->count();

        if ($activeOutlets >= $subscription->outlet_limit) {
            abort(422, 'Your current plan has reached the outlet limit.');
        }
    }

    protected function ensureUserCapacity(): void
    {
        $subscription = Subscription::current();
        $activeUsers = User::query()->where('is_active', true)->count();

        if ($activeUsers >= $subscription->user_limit) {
            abort(422, 'Your current plan has reached the active user limit.');
        }
    }
}
