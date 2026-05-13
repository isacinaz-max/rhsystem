<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePositionRequest;
use App\Http\Requests\UpdatePositionRequest;
use App\Models\Position;
use App\Services\PositionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    use ApiResponse;

    public function __construct(private PositionService $positionService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Position::class);
        $result = $this->positionService->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(StorePositionRequest $request): JsonResponse
    {
        $this->authorize('create', Position::class);
        $position = $this->positionService->create($request->validated());
        return $this->success($position, 'Cargo cadastrado com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $position = $this->positionService->find($id);
        if (!$position) {
            return $this->error('Cargo não encontrado', 404);
        }
        $this->authorize('view', $position);
        return $this->success($position);
    }

    public function update(UpdatePositionRequest $request, int $id): JsonResponse
    {
        $position = $this->positionService->find($id);
        if (!$position) {
            return $this->error('Cargo não encontrado', 404);
        }
        $this->authorize('update', $position);
        $position = $this->positionService->update($position, $request->validated());
        return $this->success($position, 'Cargo atualizado com sucesso');
    }

    public function destroy(int $id): JsonResponse
    {
        $position = $this->positionService->find($id);
        if (!$position) {
            return $this->error('Cargo não encontrado', 404);
        }
        $this->authorize('delete', $position);
        $this->positionService->delete($position);
        return $this->success(null, 'Cargo removido com sucesso');
    }
}
