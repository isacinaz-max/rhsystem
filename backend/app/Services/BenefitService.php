<?php

namespace App\Services;

use App\Models\Benefit;
use App\Models\Employee;
use App\Repositories\BenefitRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BenefitService
{
    public function __construct(private BenefitRepository $benefitRepository) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->benefitRepository->all($filters);
    }

    public function find(int $id): ?Benefit
    {
        return $this->benefitRepository->findById($id);
    }

    public function create(array $data): Benefit
    {
        return $this->benefitRepository->create($data);
    }

    public function update(Benefit $benefit, array $data): Benefit
    {
        $this->benefitRepository->update($benefit, $data);
        return $benefit->fresh();
    }

    public function delete(Benefit $benefit): bool
    {
        return $this->benefitRepository->delete($benefit);
    }

    public function assignBenefits(int $employeeId, array $benefitIds): Employee
    {
        $employee = Employee::findOrFail($employeeId);
        $employee->benefits()->sync($benefitIds);
        return $employee->load('benefits');
    }

    public function getEmployeeBenefits(int $employeeId): Collection
    {
        $employee = Employee::with('benefits')->findOrFail($employeeId);
        return $employee->benefits;
    }
}
