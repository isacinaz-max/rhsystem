<?php

namespace App\Repositories;

use App\Models\TimeRecord;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Carbon\Carbon;

class TimeRecordRepository
{
    public function __construct(private TimeRecord $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with(['employee.department']);

        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }
        if (!empty($filters['from'])) {
            $query->where('record_date', '>=', $filters['from']);
        }
        if (!empty($filters['to'])) {
            $query->where('record_date', '<=', $filters['to']);
        }

        return $query->orderByDesc('record_date')->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): ?TimeRecord
    {
        return $this->model->with('employee')->find($id);
    }

    public function create(array $data): TimeRecord
    {
        return $this->model->create($data);
    }

    public function update(TimeRecord $timeRecord, array $data): bool
    {
        return $timeRecord->update($data);
    }

    public function delete(TimeRecord $timeRecord): bool
    {
        return $timeRecord->delete();
    }

    public function findByEmployee(int $employeeId): Collection
    {
        return $this->model->where('employee_id', $employeeId)
            ->orderByDesc('record_date')
            ->get();
    }

    public function findByPeriod(int $employeeId, string $startDate, string $endDate): Collection
    {
        return $this->model->where('employee_id', $employeeId)
            ->whereBetween('record_date', [$startDate, $endDate])
            ->orderBy('record_date')
            ->get();
    }

    public function todayRecord(int $employeeId): ?TimeRecord
    {
        return $this->model->where('employee_id', $employeeId)
            ->whereDate('record_date', today())
            ->first();
    }

    public function monthlyReport(int $employeeId, int $month, int $year): Collection
    {
        return $this->model->where('employee_id', $employeeId)
            ->whereYear('record_date', $year)
            ->whereMonth('record_date', $month)
            ->orderBy('record_date')
            ->get();
    }

    public function departmentMonthlyReport(int $departmentId, int $month, int $year): Collection
    {
        return $this->model->whereHas('employee', function ($q) use ($departmentId) {
                $q->where('department_id', $departmentId);
            })
            ->whereYear('record_date', $year)
            ->whereMonth('record_date', $month)
            ->with('employee')
            ->orderBy('record_date')
            ->get();
    }
}
