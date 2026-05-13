<?php

namespace App\Repositories;

use App\Models\Department;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class DepartmentRepository
{
    public function __construct(private Department $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with('responsible');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        return $query->orderBy('name')->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): ?Department
    {
        return $this->model->with('responsible')->find($id);
    }

    public function create(array $data): Department
    {
        return $this->model->create($data);
    }

    public function update(Department $department, array $data): bool
    {
        return $department->update($data);
    }

    public function delete(Department $department): bool
    {
        return $department->delete();
    }

    public function getAll(): Collection
    {
        return $this->model->orderBy('name')->get();
    }
}
