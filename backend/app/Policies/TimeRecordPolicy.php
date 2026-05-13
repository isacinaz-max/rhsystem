<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TimeRecord;

class TimeRecordPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh', 'gestor']);
    }

    public function view(User $user, TimeRecord $timeRecord): bool
    {
        if (in_array($user->role, ['administrador', 'rh'])) return true;
        if ($user->role === 'gestor') {
            return $timeRecord->employee->department_id === $user->employee?->department_id;
        }
        return $timeRecord->employee_id === $user->employee_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh', 'gestor', 'funcionario']);
    }

    public function update(User $user, TimeRecord $timeRecord): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function delete(User $user, TimeRecord $timeRecord): bool
    {
        return $user->role === 'administrador';
    }
}
