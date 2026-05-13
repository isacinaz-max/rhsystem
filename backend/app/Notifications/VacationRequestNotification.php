<?php

namespace App\Notifications;

use App\Models\Vacation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class VacationRequestNotification extends Notification
{
    use Queueable;

    public function __construct(private Vacation $vacation) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => "{$this->vacation->employee->name} solicitou férias de {$this->vacation->start_date} a {$this->vacation->end_date}",
            'vacation_id' => $this->vacation->id,
            'type' => 'vacation_request',
        ];
    }
}
