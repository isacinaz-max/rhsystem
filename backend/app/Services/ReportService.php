<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\TimeRecord;
use App\Models\Vacation;
use App\Models\Benefit;
use App\Models\EmployeeBenefit;
use Illuminate\Database\Eloquent\Collection;

class ReportService
{
    public function employeesReport(array $filters = []): Collection
    {
        $query = Employee::with(['department', 'position', 'user']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }
        if (!empty($filters['position_id'])) {
            $query->where('position_id', $filters['position_id']);
        }
        if (!empty($filters['gender'])) {
            $query->where('gender', $filters['gender']);
        }
        if (!empty($filters['from'])) {
            $query->where('created_at', '>=', $filters['from']);
        }
        if (!empty($filters['to'])) {
            $query->where('created_at', '<=', $filters['to']);
        }

        return $query->orderBy('name')->get();
    }

    public function payrollReport(array $filters = []): Collection
    {
        $query = Payroll::with(['employee.department', 'employee.position']);

        if (!empty($filters['reference_month'])) {
            $query->where('reference_month', $filters['reference_month']);
        }
        if (!empty($filters['reference_year'])) {
            $query->where('reference_year', $filters['reference_year']);
        }
        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }
        if (!empty($filters['department_id'])) {
            $query->whereHas('employee', function ($q) use ($filters) {
                $q->where('department_id', $filters['department_id']);
            });
        }
        if (!empty($filters['from'])) {
            $query->where('created_at', '>=', $filters['from']);
        }
        if (!empty($filters['to'])) {
            $query->where('created_at', '<=', $filters['to']);
        }

        return $query->orderByDesc('created_at')->get();
    }

    public function timeRecordsReport(array $filters = []): Collection
    {
        $query = TimeRecord::with(['employee.department']);

        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }
        if (!empty($filters['department_id'])) {
            $query->whereHas('employee', function ($q) use ($filters) {
                $q->where('department_id', $filters['department_id']);
            });
        }
        if (!empty($filters['from'])) {
            $query->where('record_date', '>=', $filters['from']);
        }
        if (!empty($filters['to'])) {
            $query->where('record_date', '<=', $filters['to']);
        }

        return $query->orderByDesc('record_date')->get();
    }

    public function vacationsReport(array $filters = []): Collection
    {
        $query = Vacation::with(['employee.department', 'approvedBy']);

        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['from'])) {
            $query->where('start_date', '>=', $filters['from']);
        }
        if (!empty($filters['to'])) {
            $query->where('end_date', '<=', $filters['to']);
        }

        return $query->orderByDesc('start_date')->get();
    }

    public function benefitsReport(array $filters = []): Collection
    {
        $query = Benefit::with('employees');

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->orderBy('name')->get();
    }
}
