<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Repositories\PayrollRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PayrollService
{
    public function __construct(
        private PayrollRepository $payrollRepository,
        private PayrollCalculationService $calculationService
    ) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->payrollRepository->all($filters);
    }

    public function find(int $id): ?Payroll
    {
        return $this->payrollRepository->findById($id);
    }

    public function findForEmployee(int $employeeId): Collection
    {
        return $this->payrollRepository->findByEmployee($employeeId);
    }

    public function generate(array $data): Payroll
    {
        $employee = Employee::findOrFail($data['employee_id']);
        $calculation = $this->calculationService->calculateForEmployee(
            $employee,
            $data['reference_month'],
            $data['reference_year']
        );

        DB::beginTransaction();
        try {
            $existing = $this->payrollRepository->findByEmployeeAndPeriod(
                $employee->id,
                $data['reference_month'],
                $data['reference_year']
            );
            if ($existing) {
                $existing->items()->delete();
                $existing->delete();
            }

            $payroll = $this->payrollRepository->create([
                'employee_id' => $employee->id,
                'company_id' => $employee->company_id,
                'competence' => $calculation['competence'],
                'reference_month' => $calculation['reference_month'],
                'reference_year' => $calculation['reference_year'],
                'base_salary' => $calculation['base_salary'],
                'total_credit' => $calculation['total_credit'],
                'total_debit' => $calculation['total_debit'],
                'net_salary' => $calculation['net_salary'],
                'inss' => $calculation['inss'],
                'irrf' => $calculation['irrf'],
                'fgts' => $calculation['fgts'],
                'status' => 'pendente',
                'payment_status' => 'pending',
            ]);

            foreach ($calculation['items'] as $itemData) {
                $payroll->items()->create($itemData);
            }

            DB::commit();
            return $payroll->fresh(['items', 'employee.department', 'employee.position']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function generateForAll(int $month, int $year, ?int $companyId = null): array
    {
        $query = Employee::where('status', 'ativo');
        if ($companyId) {
            $query->where('company_id', $companyId);
        }
        $employees = $query->get();
        $payrolls = [];

        foreach ($employees as $employee) {
            $payrolls[] = $this->generate([
                'employee_id' => $employee->id,
                'reference_month' => $month,
                'reference_year' => $year,
            ]);
        }

        return $payrolls;
    }

    public function generateForEmployee(Employee $employee, int $month, int $year): Payroll
    {
        return $this->generate([
            'employee_id' => $employee->id,
            'reference_month' => $month,
            'reference_year' => $year,
        ]);
    }

    public function generatePdf(int $id)
    {
        $payroll = $this->payrollRepository->findById($id);
        abort_if(!$payroll, 404, 'Holerite não encontrado');

        return Pdf::loadView('pdfs.payroll', ['payroll' => $payroll]);
    }

    public function export(array $filters = []): Collection
    {
        return $this->payrollRepository->generateReport($filters);
    }

    public function getStats(): array
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $payrolls = $this->payrollRepository->findByPeriod($currentMonth, $currentYear);

        return [
            'total_gross' => $payrolls->sum('base_salary'),
            'total_net' => $payrolls->sum('net_salary'),
            'total_inss' => $payrolls->sum('inss'),
            'total_irrf' => $payrolls->sum('irrf'),
            'total_fgts' => $payrolls->sum('fgts'),
            'total_benefits' => $payrolls->sum('benefits_total'),
            'total_discounts' => $payrolls->sum('discounts_total'),
            'count' => $payrolls->count(),
        ];
    }

    public function delete(Payroll $payroll): bool
    {
        $payroll->items()->delete();
        return $this->payrollRepository->delete($payroll);
    }

    public function updateStatus(int $id, string $status, ?string $paymentDate = null): ?Payroll
    {
        $payroll = $this->payrollRepository->findById($id);
        if (!$payroll) return null;

        $statusMap = [
            'paid' => 'pago',
            'pending' => 'pendente',
            'canceled' => 'cancelado',
            'processing' => 'processado',
        ];

        $data = [
            'payment_status' => $status,
            'status' => $statusMap[$status] ?? 'pendente',
        ];
        if ($paymentDate) {
            $data['payment_date'] = $paymentDate;
        }

        $this->payrollRepository->update($payroll, $data);
        return $payroll->fresh(['items', 'employee']);
    }

    public function updatePayrollItems(int $id, array $items): Payroll
    {
        $payroll = $this->payrollRepository->findById($id);
        if (!$payroll) throw new \Exception('Folha não encontrada');

        DB::beginTransaction();
        try {
            $payroll->items()->delete();

            $totalCredit = 0;
            $totalDebit = 0;

            foreach ($items as $itemData) {
                $payrollItem = $payroll->items()->create([
                    'description' => $itemData['description'],
                    'type' => $itemData['type'],
                    'calculation_type' => $itemData['calculation_type'] ?? 'fixed',
                    'amount' => $itemData['amount'] ?? 0,
                    'percentage' => $itemData['percentage'] ?? null,
                    'calculated_amount' => $itemData['calculated_amount'] ?? $itemData['amount'] ?? 0,
                ]);

                if ($payrollItem->type === 'credit') {
                    $totalCredit += $payrollItem->calculated_amount;
                } else {
                    $totalDebit += $payrollItem->calculated_amount;
                }
            }

            $salary = $payroll->base_salary;
            $inss = $this->calculationService->calculateINSS($salary);
            $irrf = $this->calculationService->calculateIRRF($salary - $inss);
            $fgts = $this->calculationService->calculateFGTS($salary);
            $netSalary = $salary + $totalCredit - $totalDebit;

            $payroll->update([
                'total_credit' => $totalCredit,
                'total_debit' => $totalDebit,
                'net_salary' => max($netSalary, 0),
                'inss' => $inss,
                'irrf' => $irrf,
                'fgts' => $fgts,
            ]);

            DB::commit();
            return $payroll->fresh(['items', 'employee']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
