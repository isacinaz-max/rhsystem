<?php

namespace App\Repositories;

use App\Models\Candidate;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CandidateRepository
{
    public function __construct(private Candidate $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with('recruitment');

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('email', 'like', "%{$filters['search']}%");
            });
        }
        if (!empty($filters['recruitment_id'])) {
            $query->where('recruitment_id', $filters['recruitment_id']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderByDesc('created_at')->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): ?Candidate
    {
        return $this->model->with('recruitment')->find($id);
    }

    public function create(array $data): Candidate
    {
        return $this->model->create($data);
    }

    public function update(Candidate $candidate, array $data): bool
    {
        return $candidate->update($data);
    }

    public function delete(Candidate $candidate): bool
    {
        return $candidate->delete();
    }

    public function findByRecruitment(int $recruitmentId): Collection
    {
        return $this->model->where('recruitment_id', $recruitmentId)
            ->orderByDesc('created_at')
            ->get();
    }
}
