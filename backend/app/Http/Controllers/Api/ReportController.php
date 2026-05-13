<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponse;

    public function __construct(private ReportService $reportService) {}

    public function employees(Request $request): JsonResponse
    {
        return $this->success($this->reportService->employeesReport($request->all()));
    }

    public function payroll(Request $request): JsonResponse
    {
        return $this->success($this->reportService->payrollReport($request->all()));
    }

    public function timeRecords(Request $request): JsonResponse
    {
        return $this->success($this->reportService->timeRecordsReport($request->all()));
    }

    public function vacations(Request $request): JsonResponse
    {
        return $this->success($this->reportService->vacationsReport($request->all()));
    }

    public function benefits(Request $request): JsonResponse
    {
        return $this->success($this->reportService->benefitsReport($request->all()));
    }
}
