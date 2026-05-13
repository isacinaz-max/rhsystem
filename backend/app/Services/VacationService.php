<?php

namespace App\Services;

use App\Models\Vacation;
use App\Repositories\VacationRepository;
use App\Notifications\VacationRequestNotification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Notification;

class VacationService
{
    public function __construct(private VacationRepository $vacationRepository) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->vacationRepository->all($filters);
    }

    public function find(int $id): ?Vacation
    {
        return $this->vacationRepository->findById($id);
    }

    public function create(array $data): Vacation
    {
        $vacation = $this->vacationRepository->create($data);

        $rhUsers = \App\Models\User::whereIn('role', ['administrador', 'rh'])->get();
        Notification::send($rhUsers, new VacationRequestNotification($vacation));

        return $vacation->load(['employee.department', 'approvedBy']);
    }

    public function update(Vacation $vacation, array $data): Vacation
    {
        $this->vacationRepository->update($vacation, $data);
        return $vacation->fresh(['employee.department', 'approvedBy']);
    }

    public function delete(Vacation $vacation): bool
    {
        return $this->vacationRepository->delete($vacation);
    }

    public function approve(int $id, int $userId): ?Vacation
    {
        $vacation = $this->vacationRepository->findById($id);
        if (!$vacation || $vacation->status !== 'pendente') {
            return null;
        }

        $this->vacationRepository->update($vacation, [
            'status' => 'aprovado',
            'approved_by' => $userId,
            'approved_at' => now(),
        ]);

        return $vacation->fresh(['employee', 'approvedBy']);
    }

    public function reject(int $id, int $userId, ?string $reason = null): ?Vacation
    {
        $vacation = $this->vacationRepository->findById($id);
        if (!$vacation || $vacation->status !== 'pendente') {
            return null;
        }

        $this->vacationRepository->update($vacation, [
            'status' => 'rejeitado',
            'approved_by' => $userId,
            'approved_at' => now(),
            'notes' => $reason,
        ]);

        return $vacation->fresh(['employee', 'approvedBy']);
    }

    public function getReport(array $filters = []): Collection
    {
        return $this->vacationRepository->approvedByPeriod(
            $filters['month'] ?? now()->month,
            $filters['year'] ?? now()->year
        );
    }

    public function getPendingApprovals(): LengthAwarePaginator
    {
        return $this->vacationRepository->pendingApprovals();
    }
}
