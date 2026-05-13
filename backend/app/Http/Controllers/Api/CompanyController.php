<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Services\CompanyService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    use ApiResponse;

    public function __construct(private CompanyService $companyService) {}

    public function index(Request $request): JsonResponse
    {
        $result = $this->companyService->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'razao_social' => 'required|string|max:255',
            'nome_fantasia' => 'nullable|string|max:255',
            'cnpj' => 'required|string|max:18|unique:companies,cnpj',
            'inscricao_estadual' => 'nullable|string|max:20',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'cep' => 'nullable|string|max:10',
            'endereco' => 'nullable|string|max:255',
            'numero' => 'nullable|string|max:10',
            'bairro' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:2',
            'status' => 'nullable|string|in:ativo,inativo',
            'is_active' => 'nullable|boolean',
        ]);

        $company = $this->companyService->create($validated);
        return $this->success($company, 'Empresa cadastrada com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $company = $this->companyService->find($id);
        if (!$company) {
            return $this->error('Empresa não encontrada', 404);
        }
        return $this->success($company);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $company = $this->companyService->find($id);
        if (!$company) {
            return $this->error('Empresa não encontrada', 404);
        }

        $validated = $request->validate([
            'razao_social' => 'sometimes|required|string|max:255',
            'nome_fantasia' => 'nullable|string|max:255',
            'cnpj' => 'sometimes|required|string|max:18|unique:companies,cnpj,' . $id,
            'inscricao_estadual' => 'nullable|string|max:20',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'cep' => 'nullable|string|max:10',
            'endereco' => 'nullable|string|max:255',
            'numero' => 'nullable|string|max:10',
            'bairro' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:2',
            'status' => 'nullable|string|in:ativo,inativo',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('companies/logos', 'public');
        }

        $company = $this->companyService->update($company, $validated);
        return $this->success($company, 'Empresa atualizada com sucesso');
    }

    public function destroy(int $id): JsonResponse
    {
        $company = $this->companyService->find($id);
        if (!$company) {
            return $this->error('Empresa não encontrada', 404);
        }
        $this->companyService->delete($company);
        return $this->success(null, 'Empresa removida com sucesso');
    }

    public function uploadLogo(Request $request, int $id): JsonResponse
    {
        $company = $this->companyService->find($id);
        if (!$company) {
            return $this->error('Empresa não encontrada', 404);
        }

        $request->validate(['logo' => 'required|image|max:2048']);
        $path = $request->file('logo')->store('companies/logos', 'public');

        if ($company->logo) {
            Storage::disk('public')->delete($company->logo);
        }

        $this->companyService->update($company, ['logo' => $path]);
        return $this->success(['logo' => $path], 'Logo atualizada com sucesso');
    }

    public function listAll(): JsonResponse
    {
        $companies = $this->companyService->getAll();
        return $this->success($companies);
    }
}
