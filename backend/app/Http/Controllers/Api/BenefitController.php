<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBenefitRequest;
use App\Models\Benefit;
use App\Services\BenefitService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BenefitController extends Controller
{
    use ApiResponse;

    public function __construct(private BenefitService $benefitService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Benefit::class);
        $result = $this->benefitService->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(StoreBenefitRequest $request): JsonResponse
    {
        $this->authorize('create', Benefit::class);
        $benefit = $this->benefitService->create($request->validated());
        return $this->success($benefit, 'Benefício cadastrado com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $benefit = $this->benefitService->find($id);
        if (!$benefit) {
            return $this->error('Benefício não encontrado', 404);
        }
        $this->authorize('view', $benefit);
        return $this->success($benefit);
    }

    public function update(StoreBenefitRequest $request, int $id): JsonResponse
    {
        $benefit = $this->benefitService->find($id);
        if (!$benefit) {
            return $this->error('Benefício não encontrado', 404);
        }
        $this->authorize('update', $benefit);
        $benefit = $this->benefitService->update($benefit, $request->validated());
        return $this->success($benefit, 'Benefício atualizado com sucesso');
    }

    public function destroy(int $id): JsonResponse
    {
        $benefit = $this->benefitService->find($id);
        if (!$benefit) {
            return $this->error('Benefício não encontrado', 404);
        }
        $this->authorize('delete', $benefit);
        $this->benefitService->delete($benefit);
        return $this->success(null, 'Benefício removido com sucesso');
    }

    public function assignBenefits(Request $request, int $id): JsonResponse
    {
        $this->authorize('create', Benefit::class);

        $data = $request->validate([
            'benefit_ids' => 'required|array',
            'benefit_ids.*' => 'integer|exists:benefits,id',
        ]);

        $employee = $this->benefitService->assignBenefits($id, $data['benefit_ids']);
        return $this->success($employee->load('benefits'), 'Benefícios vinculados com sucesso');
    }

    public function employeeBenefits(int $id): JsonResponse
    {
        $benefits = $this->benefitService->getEmployeeBenefits($id);
        return $this->success($benefits);
    }
}
