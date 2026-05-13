<?php
namespace App\Providers;
use App\Models\Employee;
use App\Policies\EmployeePolicy;
use App\Models\Department;
use App\Policies\DepartmentPolicy;
use App\Models\Position;
use App\Policies\PositionPolicy;
use App\Models\Payroll;
use App\Policies\PayrollPolicy;
use App\Models\Vacation;
use App\Policies\VacationPolicy;
use App\Models\TimeRecord;
use App\Policies\TimeRecordPolicy;
use App\Models\Benefit;
use App\Policies\BenefitPolicy;
use App\Models\Recruitment;
use App\Policies\RecruitmentPolicy;
use App\Models\Candidate;
use App\Policies\CandidatePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Employee::class => EmployeePolicy::class,
        Department::class => DepartmentPolicy::class,
        Position::class => PositionPolicy::class,
        Payroll::class => PayrollPolicy::class,
        Vacation::class => VacationPolicy::class,
        TimeRecord::class => TimeRecordPolicy::class,
        Benefit::class => BenefitPolicy::class,
        Recruitment::class => RecruitmentPolicy::class,
        Candidate::class => CandidatePolicy::class,
    ];
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
