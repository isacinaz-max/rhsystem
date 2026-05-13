<?php
namespace App\Repositories;

use App\Models\Company;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CompanyRepository
{
    public function __construct(private Company $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('nome_fantasia', 'like', "%{$filters['search']}%")
                  ->orWhere('razao_social', 'like', "%{$filters['search']}%")
                  ->orWhere('cnpj', 'like', "%{$filters['search']}%");
            });
        }
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        return $query->orderBy('nome_fantasia')->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): ?Company
    {
        return $this->model->withCount('employees')->find($id);
    }

    public function create(array $data): Company
    {
        return $this->model->create($data);
    }

    public function update(Company $company, array $data): bool
    {
        return $company->update($data);
    }

    public function delete(Company $company): bool
    {
        return $company->delete();
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->where('is_active', true)->orderBy('nome_fantasia')->get();
    }
}
