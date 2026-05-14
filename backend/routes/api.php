<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\TimeRecordController;
use App\Http\Controllers\Api\VacationController;
use App\Http\Controllers\Api\PayrollController;
use App\Http\Controllers\Api\BenefitController;
use App\Http\Controllers\Api\RecruitmentController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\EmployeePayrollItemController;
use App\Http\Controllers\Api\UserController;



Route::get('/debug', function () {
    $pdo = DB::connection()->getPdo();
    $raw1 = new PDO('mysql:host=mysql;dbname=rh_system;port=3306', 'rh_user', 'rh_password');
    $raw2 = new PDO('mysql:host=172.18.0.2;dbname=rh_system;port=3306', 'rh_user', 'rh_password');
    return response()->json([
        'laravel' => [
            'hostname' => $pdo->query('SELECT @@hostname')->fetchColumn(),
            'db' => $pdo->query('SELECT DATABASE()')->fetchColumn(),
            'tables' => $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN),
        ],
        'raw_mysql' => [
            'hostname' => $raw1->query('SELECT @@hostname')->fetchColumn(),
            'tables' => $raw1->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN),
        ],
        'raw_ip' => [
            'hostname' => $raw2->query('SELECT @@hostname')->fetchColumn(),
            'tables' => $raw2->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN),
        ],
    ]);
});
Route::post('/auth/login', [AuthController::class, 'login']);

Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/change-password', [AuthController::class, 'changePassword']);

    Route::get('/dashboard/indicators', [DashboardController::class, 'indicators']);
    Route::get('/dashboard/charts', [DashboardController::class, 'charts']);

    Route::get('/employees/export', [EmployeeController::class, 'export']);
    Route::get('/employees/list-all', [EmployeeController::class, 'listAll']);
    Route::apiResource('/employees', EmployeeController::class);

    Route::apiResource('/departments', DepartmentController::class);

    Route::apiResource('/positions', PositionController::class);

    Route::get('/time-records/report', [TimeRecordController::class, 'report']);
    Route::post('/time-records/clock-in', [TimeRecordController::class, 'clockIn']);
    Route::post('/time-records/clock-out', [TimeRecordController::class, 'clockOut']);
    Route::post('/time-records/lunch-start', [TimeRecordController::class, 'lunchStart']);
    Route::post('/time-records/lunch-end', [TimeRecordController::class, 'lunchEnd']);
    Route::apiResource('/time-records', TimeRecordController::class);

    Route::put('/vacations/{id}/approve', [VacationController::class, 'approve']);
    Route::put('/vacations/{id}/reject', [VacationController::class, 'reject']);
    Route::get('/vacations/report', [VacationController::class, 'report']);
    Route::apiResource('/vacations', VacationController::class);

    Route::post('/payrolls/generate', [PayrollController::class, 'generate']);
    Route::get('/payrolls/{id}/pdf', [PayrollController::class, 'generatePdf']);
    Route::get('/payrolls/export', [PayrollController::class, 'export']);
    Route::put('/payrolls/{id}/pay', [PayrollController::class, 'markAsPaid']);
    Route::post('/payrolls/{id}/recalculate', [PayrollController::class, 'recalculate']);
    Route::apiResource('/payrolls', PayrollController::class);

    Route::apiResource('/benefits', BenefitController::class);
    Route::post('/employees/{id}/benefits', [BenefitController::class, 'assignBenefits']);
    Route::get('/employees/{id}/benefits', [BenefitController::class, 'employeeBenefits']);

    Route::apiResource('/recruitments', RecruitmentController::class);

    Route::apiResource('/candidates', CandidateController::class);

    Route::get('/reports/employees', [ReportController::class, 'employees']);
    Route::get('/reports/payroll', [ReportController::class, 'payroll']);
    Route::get('/reports/time-records', [ReportController::class, 'timeRecords']);
    Route::get('/reports/vacations', [ReportController::class, 'vacations']);
    Route::get('/reports/benefits', [ReportController::class, 'benefits']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    Route::get('/companies/list-all', [CompanyController::class, 'listAll']);
    Route::post('/companies/{id}/logo', [CompanyController::class, 'uploadLogo']);
    Route::apiResource('/companies', CompanyController::class);

    Route::get('/employee-payroll-items/by-employee/{employeeId}', [EmployeePayrollItemController::class, 'byEmployee']);
    Route::patch('/employee-payroll-items/{id}/toggle-active', [EmployeePayrollItemController::class, 'toggleActive']);
    Route::apiResource('/employee-payroll-items', EmployeePayrollItemController::class);

    Route::apiResource('/users', UserController::class);
});
