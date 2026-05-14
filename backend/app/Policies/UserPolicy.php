<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function before(User $user): ?bool
    {
        if ($user->is_super_admin) {
            return true;
        }
        if ($user->role === 'administrador') {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function view(User $user, User $target): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function create(User $user): bool
    {
        return $user->role === 'administrador';
    }

    public function update(User $user, User $target): bool
    {
        return $user->role === 'administrador';
    }

    public function delete(User $user, User $target): bool
    {
        return $user->role === 'administrador' && $user->id !== $target->id;
    }
}
