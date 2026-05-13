<?php

namespace App\Jobs;

use App\Models\Employee;
use App\Services\PayrollService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GeneratePayrollJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private Employee $employee,
        private int $month,
        private int $year
    ) {}

    public function handle(PayrollService $payrollService): void
    {
        $payrollService->generateForEmployee($this->employee, $this->month, $this->year);
    }
}
