<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Services\EmployeeService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    use ApiResponse;

    public function __construct(private EmployeeService $employeeService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', \App\Models\Employee::class);
        $result = $this->employeeService->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $this->authorize('create', \App\Models\Employee::class);
        $employee = $this->employeeService->create($request->validated());
        return $this->success($employee, 'Funcionário cadastrado com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $employee = $this->employeeService->find($id);
        if (!$employee) {
            return $this->error('Funcionário não encontrado', 404);
        }
        $this->authorize('view', $employee);
        return $this->success($employee);
    }

    public function update(UpdateEmployeeRequest $request, int $id): JsonResponse
    {
        $employee = $this->employeeService->find($id);
        if (!$employee) {
            return $this->error('Funcionário não encontrado', 404);
        }
        $this->authorize('update', $employee);
        $employee = $this->employeeService->update($employee, $request->validated());
        return $this->success($employee, 'Funcionário atualizado com sucesso');
    }

    public function destroy(int $id): JsonResponse
    {
        $employee = $this->employeeService->find($id);
        if (!$employee) {
            return $this->error('Funcionário não encontrado', 404);
        }
        $this->authorize('delete', $employee);
        $this->employeeService->delete($employee);
        return $this->success(null, 'Funcionário removido com sucesso');
    }

    public function export(Request $request): JsonResponse
    {
        $this->authorize('viewAny', \App\Models\Employee::class);
        return $this->employeeService->export($request->all());
    }

    public function listAll(): JsonResponse
    {
        $employees = \App\Models\Employee::withoutGlobalScopes()
            ->with(['department', 'position'])
            ->where('status', 'ativo')
            ->orderBy('name')
            ->get(['id', 'name', 'cpf']);
        return $this->success($employees);
    }
}
