<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmployeePayrollItem;
use App\Services\EmployeePayrollItemService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeePayrollItemController extends Controller
{
    use ApiResponse;

    public function __construct(private EmployeePayrollItemService $service) {}

    public function index(Request $request): JsonResponse
    {
        $result = $this->service->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|integer|exists:employees,id',
            'benefit_id' => 'nullable|integer|exists:benefits,id',
            'description' => 'required|string|max:255',
            'type' => 'required|string|in:credit,debit',
            'calculation_type' => 'required|string|in:fixed,percentage',
            'amount' => 'required|numeric|min:0',
            'percentage' => 'nullable|numeric|min:0|max:100',
            'reference_salary' => 'nullable|boolean',
            'active' => 'nullable|boolean',
        ]);

        $item = $this->service->create($validated);
        return $this->success($item, 'Lançamento cadastrado com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $item = $this->service->find($id);
        if (!$item) {
            return $this->error('Lançamento não encontrado', 404);
        }
        return $this->success($item);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = $this->service->find($id);
        if (!$item) {
            return $this->error('Lançamento não encontrado', 404);
        }

        $validated = $request->validate([
            'benefit_id' => 'nullable|integer|exists:benefits,id',
            'description' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|in:credit,debit',
            'calculation_type' => 'sometimes|required|string|in:fixed,percentage',
            'amount' => 'sometimes|required|numeric|min:0',
            'percentage' => 'nullable|numeric|min:0|max:100',
            'reference_salary' => 'nullable|boolean',
            'active' => 'nullable|boolean',
        ]);

        $item = $this->service->update($item, $validated);
        return $this->success($item, 'Lançamento atualizado com sucesso');
    }

    public function destroy(int $id): JsonResponse
    {
        $item = $this->service->find($id);
        if (!$item) {
            return $this->error('Lançamento não encontrado', 404);
        }
        $this->service->delete($item);
        return $this->success(null, 'Lançamento removido com sucesso');
    }

    public function byEmployee(int $employeeId): JsonResponse
    {
        $items = $this->service->getByEmployee($employeeId);
        return $this->success($items);
    }

    public function toggleActive(int $id): JsonResponse
    {
        $item = $this->service->toggleActive($id);
        if (!$item) {
            return $this->error('Lançamento não encontrado', 404);
        }
        return $this->success($item, 'Status atualizado com sucesso');
    }
}
