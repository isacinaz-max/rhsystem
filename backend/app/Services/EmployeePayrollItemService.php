<?php
namespace App\Services;

use App\Models\Employee;
use App\Models\EmployeePayrollItem;
use App\Repositories\EmployeePayrollItemRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EmployeePayrollItemService
{
    public function __construct(
        private EmployeePayrollItemRepository $repository
    ) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->repository->all($filters);
    }

    public function find(int $id): ?EmployeePayrollItem
    {
        return $this->repository->findById($id);
    }

    public function create(array $data): EmployeePayrollItem
    {
        return $this->repository->create($data);
    }

    public function update(EmployeePayrollItem $item, array $data): EmployeePayrollItem
    {
        $this->repository->update($item, $data);
        return $item->fresh();
    }

    public function delete(EmployeePayrollItem $item): bool
    {
        return $this->repository->delete($item);
    }

    public function getByEmployee(int $employeeId): Collection
    {
        return $this->repository->findByEmployee($employeeId);
    }

    public function toggleActive(int $id): ?EmployeePayrollItem
    {
        $item = $this->repository->findById($id);
        if (!$item) return null;

        $item->update(['active' => !$item->active]);
        return $item->fresh();
    }
}
