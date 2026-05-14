<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Department;
use App\Models\Payroll;
use App\Models\TimeRecord;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getIndicators(): array
    {
        $activeEmployees = Employee::where('status', 'ativo')->count();
        $totalEmployees = Employee::count();
        $inactiveEmployees = $totalEmployees - $activeEmployees;

        $birthdays = Employee::whereMonth('birth_date', now()->month)->count();

        $currentMonth = now()->month;
        $currentYear = now()->year;

        $totalCosts = Payroll::where('reference_month', $currentMonth)
            ->where('reference_year', $currentYear)
            ->sum('base_salary');

        $totalBenefits = Payroll::where('reference_month', $currentMonth)
            ->where('reference_year', $currentYear)
            ->sum('benefits_total');

        $totalDiscounts = Payroll::where('reference_month', $currentMonth)
            ->where('reference_year', $currentYear)
            ->sum('discounts_total');

        $overtimeHours = TimeRecord::whereMonth('record_date', $currentMonth)
            ->whereYear('record_date', $currentYear)
            ->sum('overtime') * 60;

        $turnover = $this->calculateTurnover();

        return [
            'total_employees' => $totalEmployees,
            'active_employees' => $activeEmployees,
            'inactive_employees' => $inactiveEmployees,
            'birthdays_current_month' => $birthdays,
            'total_costs' => (float) $totalCosts,
            'total_benefits' => (float) $totalBenefits,
            'total_discounts' => (float) $totalDiscounts,
            'overtime_minutes' => $overtimeHours,
            'turnover_rate' => $turnover,
        ];
    }

    public function getCharts(): array
    {
        $employeesByDepartment = Department::withCount('employees')
            ->get()
            ->map(fn ($dept) => [
                'department' => $dept->name,
                'count' => $dept->employees_count,
            ]);

        $salaryDistribution = [
            ['range' => 'Até R$ 2.000', 'count' => Employee::where('salary', '<=', 2000)->count()],
            ['range' => 'R$ 2.001 - R$ 4.000', 'count' => Employee::whereBetween('salary', [2000.01, 4000])->count()],
            ['range' => 'R$ 4.001 - R$ 7.000', 'count' => Employee::whereBetween('salary', [4000.01, 7000])->count()],
            ['range' => 'Acima de R$ 7.000', 'count' => Employee::where('salary', '>', 7000)->count()],
        ];

        $monthlyHires = Employee::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('YEAR(created_at) as year'),
            DB::raw('COUNT(*) as count')
        )
            ->whereYear('created_at', now()->year)
            ->groupBy(DB::raw('MONTH(created_at)'), DB::raw('YEAR(created_at)'))
            ->orderBy('month')
            ->get();

        $currentMonth = now()->month;
        $currentYear = now()->year;

        $spendingByDepartment = Department::with(['employees' => function ($q) {
            $q->where('status', 'ativo');
        }])->get()->map(fn ($dept) => [
            'department' => $dept->name,
            'total' => (float) $dept->employees->sum('salary'),
        ])->filter(fn ($item) => $item['total'] > 0)->values();

        $spendingByPosition = \App\Models\Position::with(['employees' => function ($q) {
            $q->where('status', 'ativo');
        }])->get()->map(fn ($pos) => [
            'position' => $pos->name,
            'total' => (float) $pos->employees->sum('salary'),
        ])->filter(fn ($item) => $item['total'] > 0)->values();

        return [
            'employees_by_department' => $employeesByDepartment,
            'salary_distribution' => $salaryDistribution,
            'monthly_hires' => $monthlyHires,
            'spending_by_department' => $spendingByDepartment,
            'spending_by_position' => $spendingByPosition,
        ];
    }

    private function calculateTurnover(): float
    {
        $total = Employee::count();
        if ($total === 0) return 0;

        $currentYear = now()->year;
        $previousYear = $currentYear - 1;

        $hiredThisYear = Employee::whereYear('created_at', $currentYear)->count();
        $leftThisYear = Employee::where('status', 'desligado')
            ->whereYear('updated_at', $currentYear)
            ->count();

        return round((($hiredThisYear + $leftThisYear) / 2) / $total * 100, 2);
    }
}
