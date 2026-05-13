<?php

namespace App\Repositories;

use App\Models\Payroll;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PayrollRepository
{
    public function __construct(private Payroll $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with(['employee.department', 'employee.position', 'company']);

        if (!empty($filters['company_id'])) {
            $query->where('company_id', $filters['company_id']);
        }
        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }
        if (!empty($filters['reference_month'])) {
            $query->where('reference_month', $filters['reference_month']);
        }
        if (!empty($filters['reference_year'])) {
            $query->where('reference_year', $filters['reference_year']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }
        if (!empty($filters['competence'])) {
            $query->where('competence', $filters['competence']);
        }

        return $query->orderByDesc('created_at')->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): ?Payroll
    {
        return $this->model->with([
            'employee.department',
            'employee.position',
            'employee.payrollItems',
            'company',
            'items',
        ])->find($id);
    }

    public function create(array $data): Payroll
    {
        return $this->model->create($data);
    }

    public function update(Payroll $payroll, array $data): bool
    {
        return $payroll->update($data);
    }

    public function delete(Payroll $payroll): bool
    {
        return $payroll->delete();
    }

    public function findByEmployee(int $employeeId): Collection
    {
        return $this->model->where('employee_id', $employeeId)
            ->orderByDesc('reference_year')
            ->orderByDesc('reference_month')
            ->get();
    }

    public function findByPeriod(int $month, int $year): Collection
    {
        return $this->model->where('reference_month', $month)
            ->where('reference_year', $year)
            ->with('employee')
            ->get();
    }

    public function generateReport(array $filters = []): Collection
    {
        $query = $this->model->with(['employee.department', 'employee.position', 'company']);

        if (!empty($filters['reference_month'])) {
            $query->where('reference_month', $filters['reference_month']);
        }
        if (!empty($filters['reference_year'])) {
            $query->where('reference_year', $filters['reference_year']);
        }
        if (!empty($filters['department_id'])) {
            $query->whereHas('employee', function ($q) use ($filters) {
                $q->where('department_id', $filters['department_id']);
            });
        }
        if (!empty($filters['company_id'])) {
            $query->where('company_id', $filters['company_id']);
        }

        return $query->orderByDesc('created_at')->get();
    }
}
