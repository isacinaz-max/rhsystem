<?php

namespace App\Repositories;

use App\Models\Recruitment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class RecruitmentRepository
{
    public function __construct(private Recruitment $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $query->where('position', 'like', "%{$filters['search']}%");
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderByDesc('created_at')->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): ?Recruitment
    {
        return $this->model->with('candidates')->find($id);
    }

    public function create(array $data): Recruitment
    {
        return $this->model->create($data);
    }

    public function update(Recruitment $recruitment, array $data): bool
    {
        return $recruitment->update($data);
    }

    public function delete(Recruitment $recruitment): bool
    {
        return $recruitment->delete();
    }

    public function activeRecruitments(): Collection
    {
        return $this->model->whereIn('status', ['aberta', 'andamento'])
            ->orderByDesc('created_at')
            ->get();
    }
}
