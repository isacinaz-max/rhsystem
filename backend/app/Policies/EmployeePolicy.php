<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Employee;

class EmployeePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh', 'gestor']);
    }

    public function view(User $user, Employee $employee): bool
    {
        if ($user->role === 'administrador') return true;
        if ($user->role === 'rh') return true;
        if ($user->role === 'gestor') return $employee->department_id === $user->employee?->department_id;
        return $user->employee_id === $employee->id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function update(User $user, Employee $employee): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function delete(User $user, Employee $employee): bool
    {
        return $user->role === 'administrador';
    }
}
