<?php

namespace App\Services;

use App\Models\Recruitment;
use App\Repositories\RecruitmentRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RecruitmentService
{
    public function __construct(private RecruitmentRepository $recruitmentRepository) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->recruitmentRepository->all($filters);
    }

    public function find(int $id): ?Recruitment
    {
        return $this->recruitmentRepository->findById($id);
    }

    public function create(array $data): Recruitment
    {
        return $this->recruitmentRepository->create($data);
    }

    public function update(Recruitment $recruitment, array $data): Recruitment
    {
        $this->recruitmentRepository->update($recruitment, $data);
        return $recruitment->fresh('candidates');
    }

    public function delete(Recruitment $recruitment): bool
    {
        return $this->recruitmentRepository->delete($recruitment);
    }

    public function getActiveRecruitments(): array
    {
        return $this->recruitmentRepository->activeRecruitments()->toArray();
    }
}
