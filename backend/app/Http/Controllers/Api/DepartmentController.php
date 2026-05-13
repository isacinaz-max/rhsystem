<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Models\Department;
use App\Services\DepartmentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    use ApiResponse;

    public function __construct(private DepartmentService $departmentService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Department::class);
        $result = $this->departmentService->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $this->authorize('create', Department::class);
        $department = $this->departmentService->create($request->validated());
        return $this->success($department, 'Departamento cadastrado com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $department = $this->departmentService->find($id);
        if (!$department) {
            return $this->error('Departamento não encontrado', 404);
        }
        $this->authorize('view', $department);
        return $this->success($department);
    }

    public function update(UpdateDepartmentRequest $request, int $id): JsonResponse
    {
        $department = $this->departmentService->find($id);
        if (!$department) {
            return $this->error('Departamento não encontrado', 404);
        }
        $this->authorize('update', $department);
        $department = $this->departmentService->update($department, $request->validated());
        return $this->success($department, 'Departamento atualizado com sucesso');
    }

    public function destroy(int $id): JsonResponse
    {
        $department = $this->departmentService->find($id);
        if (!$department) {
            return $this->error('Departamento não encontrado', 404);
        }
        $this->authorize('delete', $department);
        $this->departmentService->delete($department);
        return $this->success(null, 'Departamento removido com sucesso');
    }
}
