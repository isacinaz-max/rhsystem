<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTimeRecordRequest;
use App\Models\TimeRecord;
use App\Services\TimeRecordService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimeRecordController extends Controller
{
    use ApiResponse;

    public function __construct(private TimeRecordService $timeRecordService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', TimeRecord::class);
        $result = $this->timeRecordService->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(StoreTimeRecordRequest $request): JsonResponse
    {
        $this->authorize('create', TimeRecord::class);
        $record = $this->timeRecordService->create($request->validated());
        return $this->success($record, 'Registro criado com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->timeRecordService->find($id);
        if (!$record) {
            return $this->error('Registro não encontrado', 404);
        }
        $this->authorize('view', $record);
        return $this->success($record);
    }

    public function update(StoreTimeRecordRequest $request, int $id): JsonResponse
    {
        $record = $this->timeRecordService->find($id);
        if (!$record) {
            return $this->error('Registro não encontrado', 404);
        }
        $this->authorize('update', $record);
        $record = $this->timeRecordService->update($record, $request->validated());
        return $this->success($record, 'Registro atualizado com sucesso');
    }

    public function destroy(int $id): JsonResponse
    {
        $record = $this->timeRecordService->find($id);
        if (!$record) {
            return $this->error('Registro não encontrado', 404);
        }
        $this->authorize('delete', $record);
        $this->timeRecordService->delete($record);
        return $this->success(null, 'Registro removido com sucesso');
    }

    public function clockIn(Request $request): JsonResponse
    {
        try {
            $employeeId = $request->user()->employee_id;
            if (!$employeeId) {
                return $this->error('Funcionário não vinculado ao usuário', 400);
            }
            $record = $this->timeRecordService->clockIn($employeeId);
            return $this->success($record, 'Entrada registrada com sucesso');
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function clockOut(Request $request): JsonResponse
    {
        try {
            $employeeId = $request->user()->employee_id;
            if (!$employeeId) {
                return $this->error('Funcionário não vinculado ao usuário', 400);
            }
            $record = $this->timeRecordService->clockOut($employeeId);
            return $this->success($record, 'Saída registrada com sucesso');
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function lunchStart(Request $request): JsonResponse
    {
        try {
            $employeeId = $request->user()->employee_id;
            if (!$employeeId) {
                return $this->error('Funcionário não vinculado ao usuário', 400);
            }
            $record = $this->timeRecordService->lunchStart($employeeId);
            return $this->success($record, 'Início do almoço registrado');
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function lunchEnd(Request $request): JsonResponse
    {
        try {
            $employeeId = $request->user()->employee_id;
            if (!$employeeId) {
                return $this->error('Funcionário não vinculado ao usuário', 400);
            }
            $record = $this->timeRecordService->lunchEnd($employeeId);
            return $this->success($record, 'Fim do almoço registrado');
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function report(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'employee_id' => 'nullable|integer|exists:employees,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2020',
        ]);

        $employeeId = $filters['employee_id'] ?? $request->user()->employee_id;
        if (!$employeeId) {
            return $this->error('Funcionário não informado', 400);
        }

        $records = $this->timeRecordService->getMonthlyReport($employeeId, $filters['month'], $filters['year']);
        $hours = $this->timeRecordService->calculateOvertime($employeeId, $filters['month'], $filters['year']);

        return $this->success([
            'records' => $records,
            'summary' => $hours,
        ]);
    }
}
