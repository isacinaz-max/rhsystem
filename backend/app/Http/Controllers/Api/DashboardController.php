<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(private DashboardService $dashboardService) {}

    public function indicators(): JsonResponse
    {
        return $this->success($this->dashboardService->getIndicators());
    }

    public function charts(): JsonResponse
    {
        return $this->success($this->dashboardService->getCharts());
    }
}
