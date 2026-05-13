<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVacationRequest;
use App\Models\Vacation;
use App\Services\VacationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VacationController extends Controller
{
    use ApiResponse;

    public function __construct(private VacationService $vacationService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Vacation::class);
        $result = $this->vacationService->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(StoreVacationRequest $request): JsonResponse
    {
        $this->authorize('create', Vacation::class);
        $vacation = $this->vacationService->create($request->validated());
        return $this->success($vacation, 'Solicitação de férias criada com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $vacation = $this->vacationService->find($id);
        if (!$vacation) {
            return $this->error('Solicitação de férias não encontrada', 404);
        }
        $this->authorize('view', $vacation);
        return $this->success($vacation);
    }

    public function update(StoreVacationRequest $request, int $id): JsonResponse
    {
        $vacation = $this->vacationService->find($id);
        if (!$vacation) {
            return $this->error('Solicitação de férias não encontrada', 404);
        }
        $this->authorize('update', $vacation);
        $vacation = $this->vacationService->update($vacation, $request->validated());
        return $this->success($vacation, 'Solicitação de férias atualizada com sucesso');
    }

    public function destroy(int $id): JsonResponse
    {
        $vacation = $this->vacationService->find($id);
        if (!$vacation) {
            return $this->error('Solicitação de férias não encontrada', 404);
        }
        $this->authorize('delete', $vacation);
        $this->vacationService->delete($vacation);
        return $this->success(null, 'Solicitação de férias removida com sucesso');
    }

    public function approve(int $id, Request $request): JsonResponse
    {
        $vacation = $this->vacationService->approve($id, $request->user()->id);
        if (!$vacation) {
            return $this->error('Não foi possível aprovar a solicitação', 400);
        }
        return $this->success($vacation, 'Férias aprovadas com sucesso');
    }

    public function reject(int $id, Request $request): JsonResponse
    {
        $reason = $request->input('reason');
        $vacation = $this->vacationService->reject($id, $request->user()->id, $reason);
        if (!$vacation) {
            return $this->error('Não foi possível rejeitar a solicitação', 400);
        }
        return $this->success($vacation, 'Férias rejeitadas');
    }

    public function report(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'month' => 'nullable|integer|between:1,12',
            'year' => 'nullable|integer|min:2020',
        ]);
        $result = $this->vacationService->getReport($filters);
        return $this->success($result);
    }
}
