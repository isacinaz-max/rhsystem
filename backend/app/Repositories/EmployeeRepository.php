<?php

namespace App\Repositories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EmployeeRepository
{
    public function __construct(private Employee $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['department', 'position']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('cpf', 'like', "%{$filters['search']}%")
                  ->orWhere('email', 'like', "%{$filters['search']}%");
            });
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }
        if (!empty($filters['position_id'])) {
            $query->where('position_id', $filters['position_id']);
        }
        if (!empty($filters['company_id'])) {
            $query->where('company_id', $filters['company_id']);
        }

        return $query->orderBy('name')->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): ?Employee
    {
        return $this->model->with(['department', 'position', 'user', 'company'])->find($id);
    }

    public function create(array $data): Employee
    {
        return $this->model->create($data);
    }

    public function update(Employee $employee, array $data): bool
    {
        return $employee->update($data);
    }

    public function delete(Employee $employee): bool
    {
        return $employee->delete();
    }

    public function activeCount(): int
    {
        return $this->model->where('status', 'ativo')->count();
    }

    public function totalCount(): int
    {
        return $this->model->count();
    }

    public function totalSalary(): float
    {
        return $this->model->where('status', 'ativo')->sum('salary');
    }

    public function birthdayCurrentMonth(): Collection
    {
        return $this->model->whereMonth('birth_date', now()->month)->get();
    }
}
