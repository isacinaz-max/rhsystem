<?php

namespace App\Services;

use App\Models\Company;
use App\Repositories\CompanyRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CompanyService
{
    public function __construct(private CompanyRepository $companyRepository) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->companyRepository->all($filters);
    }

    public function find(int $id): ?Company
    {
        return $this->companyRepository->findById($id);
    }

    public function create(array $data): Company
    {
        return $this->companyRepository->create($data);
    }

    public function update(Company $company, array $data): Company
    {
        $this->companyRepository->update($company, $data);
        return $company->fresh();
    }

    public function delete(Company $company): bool
    {
        return $this->companyRepository->delete($company);
    }

    public function getAll(): Collection
    {
        return $this->companyRepository->getAll();
    }
}
