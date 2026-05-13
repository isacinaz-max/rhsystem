<?php
namespace App\Repositories;

use App\Models\EmployeePayrollItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EmployeePayrollItemRepository
{
    public function __construct(private EmployeePayrollItem $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with(['employee', 'benefit']);

        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        if (!empty($filters['active'])) {
            $query->where('active', $filters['active'] === 'true' || $filters['active'] === true);
        }

        return $query->orderByDesc('created_at')->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): ?EmployeePayrollItem
    {
        return $this->model->with(['employee', 'benefit'])->find($id);
    }

    public function create(array $data): EmployeePayrollItem
    {
        return $this->model->create($data);
    }

    public function update(EmployeePayrollItem $item, array $data): bool
    {
        return $item->update($data);
    }

    public function delete(EmployeePayrollItem $item): bool
    {
        return $item->delete();
    }

    public function findByEmployee(int $employeeId): Collection
    {
        return $this->model->where('employee_id', $employeeId)
            ->orderByDesc('created_at')
            ->get();
    }
}
