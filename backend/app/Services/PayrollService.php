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
    private const INSS_BRACKETS = [
        ['limit' => 1412.00, 'rate' => 0.075],
        ['limit' => 2666.68, 'rate' => 0.09],
        ['limit' => 4000.03, 'rate' => 0.12],
        ['limit' => 7786.02, 'rate' => 0.14],
    ];

    private const IRRF_BRACKETS = [
        ['limit' => 2112.00, 'rate' => 0.0, 'deduction' => 0],
        ['limit' => 2826.65, 'rate' => 0.075, 'deduction' => 158.40],
        ['limit' => 3751.05, 'rate' => 0.15, 'deduction' => 370.40],
        ['limit' => 4664.68, 'rate' => 0.225, 'deduction' => 651.73],
        ['limit' => PHP_FLOAT_MAX, 'rate' => 0.275, 'deduction' => 884.96],
    ];

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

        $grossSalary = $calculation['base_salary'];
        $inss = $this->calculateINSS($grossSalary);
        $irrfBase = $grossSalary - $inss;
        $irrf = $this->calculateIRRF($irrfBase);
        $fgts = $this->calculateFGTS($grossSalary);

        DB::beginTransaction();
        try {
            $payroll = $this->payrollRepository->create([
                'employee_id' => $employee->id,
                'company_id' => $employee->company_id,
                'competence' => $calculation['competence'],
                'reference_month' => $calculation['reference_month'],
                'reference_year' => $calculation['reference_year'],
                'base_salary' => $grossSalary,
                'total_credit' => $calculation['total_credit'],
                'total_debit' => $calculation['total_debit'],
                'net_salary' => $calculation['net_salary'],
                'inss' => $inss,
                'irrf' => $irrf,
                'fgts' => $fgts,
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

    public function generateForAll(int $month, int $year): array
    {
        $employees = Employee::where('status', 'ativo')->get();
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

        $data = ['payment_status' => $status, 'status' => $status];
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

            $payroll->update([
                'total_credit' => $totalCredit,
                'total_debit' => $totalDebit,
                'net_salary' => max($totalCredit - $totalDebit, 0),
            ]);

            DB::commit();
            return $payroll->fresh(['items', 'employee']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function calculateINSS(float $salary): float
    {
        $inss = 0;
        $previousLimit = 0;

        foreach (self::INSS_BRACKETS as $bracket) {
            if ($salary > $previousLimit) {
                $base = min($salary, $bracket['limit']) - $previousLimit;
                $inss += $base * $bracket['rate'];
                $previousLimit = $bracket['limit'];
            } else {
                break;
            }
        }

        return round(min($inss, $salary * 0.14), 2);
    }

    private function calculateIRRF(float $base): float
    {
        foreach (self::IRRF_BRACKETS as $bracket) {
            if ($base <= $bracket['limit']) {
                $irrf = ($base * $bracket['rate']) - $bracket['deduction'];
                return round(max($irrf, 0), 2);
            }
        }
        return 0;
    }

    private function calculateFGTS(float $salary): float
    {
        return round($salary * 0.08, 2);
    }
}
