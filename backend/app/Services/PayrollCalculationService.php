<?php
namespace App\Services;

use App\Models\Employee;
use App\Models\EmployeePayrollItem;
use App\Models\Payroll;
use App\Models\PayrollItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PayrollCalculationService
{
    public function calculateForEmployee(Employee $employee, int $month, int $year): array
    {
        $items = $this->getActiveItems($employee);
        $salary = $employee->salary;
        $creditItems = [];
        $debitItems = [];

        foreach ($items as $item) {
            $calculated = $this->calculateItem($item, $salary);
            if ($item->type === 'credit') {
                $creditItems[] = $calculated;
            } else {
                $debitItems[] = $calculated;
            }
        }

        $totalCredit = collect($creditItems)->sum('calculated_amount');
        $totalDebit = collect($debitItems)->sum('calculated_amount');
        $netSalary = $salary + $totalCredit - $totalDebit;

        $inss = $this->calculateINSS($salary);
        $irrf = $this->calculateIRRF($salary - $inss);
        $fgts = $this->calculateFGTS($salary);

        return [
            'employee_id' => $employee->id,
            'company_id' => $employee->company_id,
            'competence' => sprintf('%02d/%d', $month, $year),
            'reference_month' => $month,
            'reference_year' => $year,
            'base_salary' => $salary,
            'total_credit' => $totalCredit,
            'total_debit' => $totalDebit,
            'net_salary' => max($netSalary, 0),
            'inss' => $inss,
            'irrf' => $irrf,
            'fgts' => $fgts,
            'payment_status' => 'pending',
            'status' => 'pendente',
            'items' => array_merge($creditItems, $debitItems),
        ];
    }

    public function recalculate(Payroll $payroll): Payroll
    {
        $employee = $payroll->employee;
        $items = $this->getActiveItems($employee);
        $salary = $employee->salary;
        $creditItems = [];
        $debitItems = [];

        foreach ($items as $item) {
            $calculated = $this->calculateItem($item, $salary);
            if ($item->type === 'credit') {
                $creditItems[] = $calculated;
            } else {
                $debitItems[] = $calculated;
            }
        }

        $totalCredit = collect($creditItems)->sum('calculated_amount');
        $totalDebit = collect($debitItems)->sum('calculated_amount');
        $inss = $this->calculateINSS($salary);
        $irrf = $this->calculateIRRF($salary - $inss);
        $fgts = $this->calculateFGTS($salary);
        $netSalary = $salary + $totalCredit - $totalDebit;

        $payroll->update([
            'base_salary' => $salary,
            'total_credit' => $totalCredit,
            'total_debit' => $totalDebit,
            'net_salary' => max($netSalary, 0),
            'inss' => $inss,
            'irrf' => $irrf,
            'fgts' => $fgts,
        ]);

        $payroll->items()->delete();

        foreach (array_merge($creditItems, $debitItems) as $itemData) {
            $payroll->items()->create($itemData);
        }

        return $payroll->fresh(['items', 'employee']);
    }

    public function calculateItem(EmployeePayrollItem $item, float $salary): array
    {
        $calculatedAmount = 0;

        if ($item->calculation_type === 'fixed') {
            $calculatedAmount = $item->amount;
        } elseif ($item->calculation_type === 'percentage') {
            $base = $item->reference_salary ? $salary : $item->amount;
            $calculatedAmount = $base * ($item->percentage / 100);
        }

        return [
            'employee_payroll_item_id' => $item->id,
            'description' => $item->description,
            'type' => $item->type,
            'calculation_type' => $item->calculation_type,
            'amount' => $item->amount,
            'percentage' => $item->percentage,
            'calculated_amount' => round($calculatedAmount, 2),
        ];
    }

    private function getActiveItems(Employee $employee): Collection
    {
        return $employee->payrollItems()
            ->where('active', true)
            ->get();
    }

    public function getPayrollDetail(Payroll $payroll): array
    {
        $payroll->load(['items', 'employee.department', 'employee.position']);
        $credits = $payroll->items->where('type', 'credit');
        $debits = $payroll->items->where('type', 'debit');

        return [
            'payroll' => $payroll,
            'credits' => $credits,
            'debits' => $debits,
            'total_credit' => $credits->sum('calculated_amount'),
            'total_debit' => $debits->sum('calculated_amount'),
            'net_salary' => $payroll->net_salary,
            'employee' => $payroll->employee,
        ];
    }

    public function calculateINSS(float $salary): float
    {
        $brackets = [
            ['limit' => 1412.00, 'rate' => 0.075],
            ['limit' => 2666.68, 'rate' => 0.09],
            ['limit' => 4000.03, 'rate' => 0.12],
            ['limit' => 7786.02, 'rate' => 0.14],
        ];

        $inss = 0;
        $previousLimit = 0;

        foreach ($brackets as $bracket) {
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

    public function calculateIRRF(float $base): float
    {
        $brackets = [
            ['limit' => 2112.00, 'rate' => 0.0, 'deduction' => 0],
            ['limit' => 2826.65, 'rate' => 0.075, 'deduction' => 158.40],
            ['limit' => 3751.05, 'rate' => 0.15, 'deduction' => 370.40],
            ['limit' => 4664.68, 'rate' => 0.225, 'deduction' => 651.73],
            ['limit' => PHP_FLOAT_MAX, 'rate' => 0.275, 'deduction' => 884.96],
        ];

        foreach ($brackets as $bracket) {
            if ($base <= $bracket['limit']) {
                $irrf = ($base * $bracket['rate']) - $bracket['deduction'];
                return round(max($irrf, 0), 2);
            }
        }
        return 0;
    }

    public function calculateFGTS(float $salary): float
    {
        return round($salary * 0.08, 2);
    }
}
