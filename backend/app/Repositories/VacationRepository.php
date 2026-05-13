<?php

namespace App\Repositories;

use App\Models\Vacation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class VacationRepository
{
    public function __construct(private Vacation $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with(['employee.department', 'approvedBy']);

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

        return $query->orderByDesc('created_at')->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): ?Vacation
    {
        return $this->model->with(['employee.department', 'approvedBy'])->find($id);
    }

    public function create(array $data): Vacation
    {
        return $this->model->create($data);
    }

    public function update(Vacation $vacation, array $data): bool
    {
        return $vacation->update($data);
    }

    public function delete(Vacation $vacation): bool
    {
        return $vacation->delete();
    }

    public function findByEmployee(int $employeeId): Collection
    {
        return $this->model->where('employee_id', $employeeId)
            ->orderByDesc('start_date')
            ->get();
    }

    public function findByPeriod(string $startDate, string $endDate): Collection
    {
        return $this->model->whereBetween('start_date', [$startDate, $endDate])
            ->orWhereBetween('end_date', [$startDate, $endDate])
            ->with('employee')
            ->get();
    }

    public function pendingApprovals(): LengthAwarePaginator
    {
        return $this->model->where('status', 'pendente')
            ->with('employee')
            ->orderBy('created_at')
            ->paginate(15);
    }

    public function approvedByPeriod(int $month, int $year): Collection
    {
        return $this->model->where('status', 'aprovado')
            ->whereYear('start_date', $year)
            ->whereMonth('start_date', $month)
            ->with('employee')
            ->get();
    }
}
