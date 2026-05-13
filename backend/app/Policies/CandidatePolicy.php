<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Candidate;

class CandidatePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh', 'gestor']);
    }

    public function view(User $user, Candidate $candidate): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function update(User $user, Candidate $candidate): bool
    {
        return in_array($user->role, ['administrador', 'rh']);
    }

    public function delete(User $user, Candidate $candidate): bool
    {
        return $user->role === 'administrador';
    }
}
