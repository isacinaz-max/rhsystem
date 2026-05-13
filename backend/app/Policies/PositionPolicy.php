<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Position;

class PositionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Position $position): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function update(User $user, Position $position): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function delete(User $user, Position $position): bool
    {
        return $user->role === 'administrador';
    }
}
