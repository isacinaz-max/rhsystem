<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Department;

class DepartmentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Department $department): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function update(User $user, Department $department): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function delete(User $user, Department $department): bool
    {
        return $user->role === 'administrador';
    }
}
