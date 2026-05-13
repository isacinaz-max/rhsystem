<?php

namespace App\Repositories;

use App\Models\Benefit;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BenefitRepository
{
    public function __construct(private Benefit $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->orderBy('name')->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): ?Benefit
    {
        return $this->model->with('employees')->find($id);
    }

    public function create(array $data): Benefit
    {
        return $this->model->create($data);
    }

    public function update(Benefit $benefit, array $data): bool
    {
        return $benefit->update($data);
    }

    public function delete(Benefit $benefit): bool
    {
        return $benefit->delete();
    }

    public function getAll(): Collection
    {
        return $this->model->orderBy('name')->get();
    }
}
