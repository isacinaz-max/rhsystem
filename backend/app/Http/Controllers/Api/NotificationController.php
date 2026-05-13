<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()->notifications()
            ->orderByDesc('created_at')
            ->paginate(15);

        return $this->paginatedSuccess($notifications);
    }

    public function markAsRead(int $id, Request $request): JsonResponse
    {
        $notification = $request->user()->notifications()->find($id);

        if (!$notification) {
            return $this->error('Notificação não encontrada', 404);
        }

        $notification->markAsRead();

        return $this->success(null, 'Notificação marcada como lida');
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return $this->success(null, 'Todas as notificações marcadas como lidas');
    }
}
