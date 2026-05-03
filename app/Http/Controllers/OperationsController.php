<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Outlet;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OperationsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        abort_unless($user->canManageOperations() || $user->canManageCustomers(), 403);

        $subscription = Subscription::current();
        $manageableRoleNames = $this->manageableStaffRoleNames($user);
        $customers = Customer::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'email',
                'phone',
                'membership_number',
                'membership_tier',
                'membership_discount_rate',
                'is_active',
            ]);
        $recentTransactionsByCustomer = Transaction::query()
            ->with('outlet:id,name')
            ->whereIn('customer_id', $customers->pluck('id'))
            ->orderByDesc('paid_at')
            ->get([
                'id',
                'customer_id',
                'outlet_id',
                'invoice_number',
                'total',
                'status',
                'paid_at',
            ])
            ->groupBy('customer_id');

        return Inertia::render('Operations/Index', [
            'canManageOperations' => $user->canManageOperations(),
            'canManageCustomers' => $user->canManageCustomers(),
            'outlets' => Outlet::query()->orderByDesc('is_primary')->orderBy('name')->get(),
            'staffUsers' => $user->canManageOperations()
                ? User::query()
                    ->with(['role:id,name', 'outlet:id,name'])
                    ->whereHas('role', fn ($query) => $query->whereIn('name', $manageableRoleNames))
                    ->orderBy('name')
                    ->get()
                : [],
            'roles' => Role::query()->whereIn('name', $manageableRoleNames)->orderBy('name')->get(),
            'customers' => $customers
                ->map(function (Customer $customer) use ($recentTransactionsByCustomer): array {
                    return [
                        'id' => $customer->id,
                        'name' => $customer->name,
                        'email' => $customer->email,
                        'phone' => $customer->phone,
                        'membership_number' => $customer->membership_number,
                        'membership_tier' => $customer->membership_tier,
                        'membership_discount_rate' => $customer->membership_discount_rate,
                        'is_active' => $customer->is_active,
                        'recent_transactions' => $recentTransactionsByCustomer
                            ->get($customer->id, collect())
                            ->take(5)
                            ->map(fn (Transaction $transaction) => [
                                'id' => $transaction->id,
                                'invoice_number' => $transaction->invoice_number,
                                'outlet' => $transaction->outlet,
                                'total' => $transaction->total,
                                'status' => $transaction->status,
                                'paid_at' => optional($transaction->paid_at)->toDateTimeString(),
                            ])
                            ->values()
                            ->all(),
                    ];
                })
                ->values(),
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

        $validated = $this->validateStaffUser($request);

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
        $this->ensureCanManageStaffUser($request->user(), $user);

        $validated = $this->validateStaffUser($request, $user);

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

    protected function validateStaffUser(Request $request, ?User $staffUser = null): array
    {
        $manageableRoleIds = Role::query()
            ->whereIn('name', $this->manageableStaffRoleNames($request->user()))
            ->pluck('id')
            ->all();

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($staffUser?->id)],
            'password' => [$staffUser ? 'nullable' : 'required', 'string', 'min:8'],
            'role_id' => ['required', Rule::exists('roles', 'id')->where(fn ($query) => $query->whereIn('id', $manageableRoleIds))],
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'is_active' => ['required', 'boolean'],
        ]);
    }

    protected function manageableStaffRoleNames(User $user): array
    {
        if ($user->hasRole(Role::ADMIN)) {
            return [Role::CASHIER];
        }

        return Role::names();
    }

    protected function ensureCanManageStaffUser(User $actor, User $staffUser): void
    {
        if ($actor->hasRole(Role::ADMIN) && ! $staffUser->hasRole(Role::CASHIER)) {
            abort(403);
        }
    }

    protected function ensureOutletCapacity(): void
    {
        $subscription = Subscription::current();
        $activeOutlets = Outlet::query()->where('is_active', true)->count();

        if ($activeOutlets >= $subscription->outlet_limit) {
            throw ValidationException::withMessages([
                'is_active' => 'Your current plan has reached the outlet limit.',
            ]);
        }
    }

    protected function ensureUserCapacity(): void
    {
        $subscription = Subscription::current();
        $activeUsers = User::query()->where('is_active', true)->count();

        if ($activeUsers >= $subscription->user_limit) {
            throw ValidationException::withMessages([
                'is_active' => 'Your current plan has reached the active user limit.',
            ]);
        }
    }
}
