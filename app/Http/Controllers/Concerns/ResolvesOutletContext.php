<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Outlet;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

trait ResolvesOutletContext
{
    protected function availableOutletsFor(User $user): Collection
    {
        $query = Outlet::query()->where('is_active', true)->orderByDesc('is_primary')->orderBy('name');

        if ($user->hasRole([Role::OWNER, Role::ADMIN, Role::MANAGER])) {
            return $query->get();
        }

        if ($user->outlet_id) {
            return $query->whereKey($user->outlet_id)->get();
        }

        return $query->limit(1)->get();
    }

    protected function resolveCurrentOutlet(Request $request): ?Outlet
    {
        $outlets = $this->availableOutletsFor($request->user());

        if ($request->filled('outlet')) {
            return $outlets->firstWhere('id', (int) $request->integer('outlet')) ?? $outlets->first();
        }

        return $outlets->first();
    }
}
