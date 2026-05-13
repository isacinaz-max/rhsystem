<?php

namespace App\Services;

use App\Models\Position;
use App\Repositories\PositionRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PositionService
{
    public function __construct(private PositionRepository $positionRepository) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->positionRepository->all($filters);
    }

    public function find(int $id): ?Position
    {
        return $this->positionRepository->findById($id);
    }

    public function create(array $data): Position
    {
        return $this->positionRepository->create($data);
    }

    public function update(Position $position, array $data): Position
    {
        $this->positionRepository->update($position, $data);
        return $position->fresh();
    }

    public function delete(Position $position): bool
    {
        return $this->positionRepository->delete($position);
    }

    public function getAll(): Collection
    {
        return $this->positionRepository->getAll();
    }
}
