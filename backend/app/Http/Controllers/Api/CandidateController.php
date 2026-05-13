<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCandidateRequest;
use App\Models\Candidate;
use App\Services\CandidateService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    use ApiResponse;

    public function __construct(private CandidateService $candidateService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Candidate::class);
        $result = $this->candidateService->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(StoreCandidateRequest $request): JsonResponse
    {
        $this->authorize('create', Candidate::class);
        $candidate = $this->candidateService->create($request->validated());
        return $this->success($candidate, 'Candidato cadastrado com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $candidate = $this->candidateService->find($id);
        if (!$candidate) {
            return $this->error('Candidato não encontrado', 404);
        }
        $this->authorize('view', $candidate);
        return $this->success($candidate);
    }

    public function update(StoreCandidateRequest $request, int $id): JsonResponse
    {
        $candidate = $this->candidateService->find($id);
        if (!$candidate) {
            return $this->error('Candidato não encontrado', 404);
        }
        $this->authorize('update', $candidate);
        $candidate = $this->candidateService->update($candidate, $request->validated());
        return $this->success($candidate, 'Candidato atualizado com sucesso');
    }

    public function destroy(int $id): JsonResponse
    {
        $candidate = $this->candidateService->find($id);
        if (!$candidate) {
            return $this->error('Candidato não encontrado', 404);
        }
        $this->authorize('delete', $candidate);
        $this->candidateService->delete($candidate);
        return $this->success(null, 'Candidato removido com sucesso');
    }
}
