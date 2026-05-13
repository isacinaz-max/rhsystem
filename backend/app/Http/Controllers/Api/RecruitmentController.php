<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRecruitmentRequest;
use App\Models\Recruitment;
use App\Services\RecruitmentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecruitmentController extends Controller
{
    use ApiResponse;

    public function __construct(private RecruitmentService $recruitmentService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Recruitment::class);
        $result = $this->recruitmentService->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(StoreRecruitmentRequest $request): JsonResponse
    {
        $this->authorize('create', Recruitment::class);
        $recruitment = $this->recruitmentService->create($request->validated());
        return $this->success($recruitment, 'Processo seletivo cadastrado com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $recruitment = $this->recruitmentService->find($id);
        if (!$recruitment) {
            return $this->error('Processo seletivo não encontrado', 404);
        }
        $this->authorize('view', $recruitment);
        return $this->success($recruitment);
    }

    public function update(StoreRecruitmentRequest $request, int $id): JsonResponse
    {
        $recruitment = $this->recruitmentService->find($id);
        if (!$recruitment) {
            return $this->error('Processo seletivo não encontrado', 404);
        }
        $this->authorize('update', $recruitment);
        $recruitment = $this->recruitmentService->update($recruitment, $request->validated());
        return $this->success($recruitment, 'Processo seletivo atualizado com sucesso');
    }

    public function destroy(int $id): JsonResponse
    {
        $recruitment = $this->recruitmentService->find($id);
        if (!$recruitment) {
            return $this->error('Processo seletivo não encontrado', 404);
        }
        $this->authorize('delete', $recruitment);
        $this->recruitmentService->delete($recruitment);
        return $this->success(null, 'Processo seletivo removido com sucesso');
    }
}
