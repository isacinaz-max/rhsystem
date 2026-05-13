<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Recruitment;

class RecruitmentPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh', 'gestor']);
    }

    public function view(User $user, Recruitment $recruitment): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function update(User $user, Recruitment $recruitment): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function delete(User $user, Recruitment $recruitment): bool
    {
        return $user->role === 'administrador';
    }
}
