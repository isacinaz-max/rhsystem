<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vacation;

class VacationPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh', 'gestor']);
    }

    public function view(User $user, Vacation $vacation): bool
    {
        if (in_array($user->role, ['administrador', 'rh'])) return true;
        if ($user->role === 'gestor') {
            return $vacation->employee->department_id === $user->employee?->department_id;
        }
        return $vacation->employee_id === $user->employee_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh', 'gestor', 'funcionario']);
    }

    public function update(User $user, Vacation $vacation): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function delete(User $user, Vacation $vacation): bool
    {
        return $user->role === 'administrador';
    }
}
