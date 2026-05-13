<?php

namespace App\Repositories;

use App\Models\Position;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PositionRepository
{
    public function __construct(private Position $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        return $query->orderBy('name')->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): ?Position
    {
        return $this->model->find($id);
    }

    public function create(array $data): Position
    {
        return $this->model->create($data);
    }

    public function update(Position $position, array $data): bool
    {
        return $position->update($data);
    }

    public function delete(Position $position): bool
    {
        return $position->delete();
    }

    public function getAll(): Collection
    {
        return $this->model->orderBy('name')->get();
    }
}
