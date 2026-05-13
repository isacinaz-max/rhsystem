<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Payroll;

class PayrollPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh', 'gestor']);
    }

    public function view(User $user, Payroll $payroll): bool
    {
        if (in_array($user->role, ['administrador', 'rh'])) return true;
        if ($user->role === 'gestor') {
            return $payroll->employee->department_id === $user->employee?->department_id;
        }
        return $payroll->employee_id === $user->employee_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function update(User $user, Payroll $payroll): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function delete(User $user, Payroll $payroll): bool
    {
        return $user->role === 'administrador';
    }
}
