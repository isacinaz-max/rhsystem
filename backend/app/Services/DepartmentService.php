<?php

namespace App\Services;

use App\Models\Department;
use App\Repositories\DepartmentRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class DepartmentService
{
    public function __construct(private DepartmentRepository $departmentRepository) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->departmentRepository->all($filters);
    }

    public function find(int $id): ?Department
    {
        return $this->departmentRepository->findById($id);
    }

    public function create(array $data): Department
    {
        return $this->departmentRepository->create($data);
    }

    public function update(Department $department, array $data): Department
    {
        $this->departmentRepository->update($department, $data);
        return $department->fresh('responsible');
    }

    public function delete(Department $department): bool
    {
        return $this->departmentRepository->delete($department);
    }

    public function getAll(): Collection
    {
        return $this->departmentRepository->getAll();
    }
}
