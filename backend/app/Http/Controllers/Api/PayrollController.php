<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePayrollRequest;
use App\Models\Payroll;
use App\Services\PayrollCalculationService;
use App\Services\PayrollService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    use ApiResponse;

    public function __construct(
        private PayrollService $payrollService,
        private PayrollCalculationService $calculationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Payroll::class);
        $result = $this->payrollService->list($request->all());
        return $this->paginatedSuccess($result);
    }

    public function store(StorePayrollRequest $request): JsonResponse
    {
        $this->authorize('create', Payroll::class);
        $payroll = $this->payrollService->generate($request->validated());
        return $this->success($payroll, 'Holerite gerado com sucesso', 201);
    }

    public function show(int $id): JsonResponse
    {
        $payroll = $this->payrollService->find($id);
        if (!$payroll) {
            return $this->error('Holerite não encontrado', 404);
        }
        $this->authorize('view', $payroll);

        $detail = $this->calculationService->getPayrollDetail($payroll);
        return $this->success($detail);
    }

    public function destroy(int $id): JsonResponse
    {
        $payroll = $this->payrollService->find($id);
        if (!$payroll) {
            return $this->error('Holerite não encontrado', 404);
        }
        $this->authorize('delete', $payroll);
        $this->payrollService->delete($payroll);
        return $this->success(null, 'Holerite removido com sucesso');
    }

    public function generate(Request $request): JsonResponse
    {
        $this->authorize('create', Payroll::class);

        $data = $request->validate([
            'employee_id' => 'nullable|integer|exists:employees,id',
            'reference_month' => 'required|integer|between:1,12',
            'reference_year' => 'required|integer|min:2020',
        ]);

        if (!empty($data['employee_id'])) {
            $payroll = $this->payrollService->generate($data);
            return $this->success($payroll, 'Holerite gerado com sucesso', 201);
        }

        $payrolls = $this->payrollService->generateForAll($data['reference_month'], $data['reference_year']);
        return $this->success($payrolls, 'Folha gerada com sucesso', 201);
    }

    public function generatePdf(int $id): JsonResponse|\Illuminate\Http\Response
    {
        $payroll = $this->payrollService->find($id);
        if (!$payroll) {
            return $this->error('Holerite não encontrado', 404);
        }
        $this->authorize('view', $payroll);

        $pdf = $this->payrollService->generatePdf($id);
        return $pdf->download("holerite-{$payroll->employee->name}-{$payroll->reference_month}-{$payroll->reference_year}.pdf");
    }

    public function export(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Payroll::class);
        $data = $this->payrollService->export($request->all());
        return $this->success($data);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $payroll = $this->payrollService->find($id);
        if (!$payroll) {
            return $this->error('Holerite não encontrado', 404);
        }
        $this->authorize('update', $payroll);

        $validated = $request->validate([
            'items' => 'sometimes|array',
            'items.*.description' => 'required|string|max:255',
            'items.*.type' => 'required|string|in:credit,debit',
            'items.*.calculation_type' => 'sometimes|string|in:fixed,percentage',
            'items.*.amount' => 'required|numeric|min:0',
            'items.*.percentage' => 'nullable|numeric|min:0|max:100',
            'items.*.calculated_amount' => 'nullable|numeric|min:0',
        ]);

        if (isset($validated['items'])) {
            $payroll = $this->payrollService->updatePayrollItems($id, $validated['items']);
            return $this->success($payroll, 'Itens da folha atualizados com sucesso');
        }

        return $this->error('Nenhum dado para atualizar', 400);
    }

    public function markAsPaid(Request $request, int $id): JsonResponse
    {
        $payroll = $this->payrollService->find($id);
        if (!$payroll) {
            return $this->error('Holerite não encontrado', 404);
        }
        $this->authorize('update', $payroll);

        $validated = $request->validate([
            'payment_date' => 'sometimes|date',
        ]);

        $payroll = $this->payrollService->updateStatus(
            $id,
            'paid',
            $validated['payment_date'] ?? now()->toDateString()
        );

        return $this->success($payroll, 'Folha marcada como paga');
    }

    public function recalculate(int $id): JsonResponse
    {
        $payroll = $this->payrollService->find($id);
        if (!$payroll) {
            return $this->error('Holerite não encontrado', 404);
        }
        $this->authorize('update', $payroll);

        $payroll = $this->calculationService->recalculate($payroll);
        return $this->success($payroll, 'Folha recalculada com sucesso');
    }
}
