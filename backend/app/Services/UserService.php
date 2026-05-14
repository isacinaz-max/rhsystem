<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(private UserRepository $userRepository) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->userRepository->all($filters);
    }

    public function find(int $id): ?User
    {
        return $this->userRepository->findById($id);
    }

    public function create(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }
        if (isset($data['permissions']) && is_array($data['permissions'])) {
            $data['permissions'] = json_encode($data['permissions']);
        }
        return $this->userRepository->create($data);
    }

    public function update(User $user, array $data): User
    {
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        if (isset($data['permissions']) && is_array($data['permissions'])) {
            $data['permissions'] = json_encode($data['permissions']);
        }
        $this->userRepository->update($user, $data);
        return $user->fresh('employee');
    }

    public function delete(User $user): bool
    {
        return $this->userRepository->delete($user);
    }

    public function getAll(): Collection
    {
        return $this->userRepository->getAll();
    }
}
