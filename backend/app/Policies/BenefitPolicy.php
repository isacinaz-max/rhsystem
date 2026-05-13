<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Benefit;

class BenefitPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh', 'gestor', 'funcionario']);
    }

    public function view(User $user, Benefit $benefit): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function update(User $user, Benefit $benefit): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function delete(User $user, Benefit $benefit): bool
    {
        return $user->role === 'administrador';
    }
}
