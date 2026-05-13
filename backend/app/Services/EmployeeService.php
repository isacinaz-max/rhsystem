<?php

namespace App\Services;

use App\Models\Employee;
use App\Repositories\EmployeeRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class EmployeeService
{
    public function __construct(private EmployeeRepository $employeeRepository) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->employeeRepository->all($filters);
    }

    public function find(int $id): ?Employee
    {
        return $this->employeeRepository->findById($id);
    }

    public function create(array $data): Employee
    {
        if (isset($data['photo']) && $data['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $data['photo'] = $data['photo']->store('employees/photos', 'public');
        }
        return $this->employeeRepository->create($data);
    }

    public function update(Employee $employee, array $data): Employee
    {
        if (isset($data['photo']) && $data['photo'] instanceof \Illuminate\Http\UploadedFile) {
            if ($employee->photo) {
                Storage::disk('public')->delete($employee->photo);
            }
            $data['photo'] = $data['photo']->store('employees/photos', 'public');
        }
        $this->employeeRepository->update($employee, $data);
        return $employee->fresh(['department', 'position']);
    }

    public function delete(Employee $employee): bool
    {
        if ($employee->photo) {
            Storage::disk('public')->delete($employee->photo);
        }
        return $this->employeeRepository->delete($employee);
    }

    public function getStats(): array
    {
        return [
            'total' => $this->employeeRepository->totalCount(),
            'active' => $this->employeeRepository->activeCount(),
            'inactive' => $this->employeeRepository->totalCount() - $this->employeeRepository->activeCount(),
            'total_salary' => $this->employeeRepository->totalSalary(),
        ];
    }

    public function getBirthdays(): array
    {
        return $this->employeeRepository->birthdayCurrentMonth()->toArray();
    }

    public function export(array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = \App\Models\Employee::with(['department', 'position']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        return $query->orderBy('name')->get();
    }
}
