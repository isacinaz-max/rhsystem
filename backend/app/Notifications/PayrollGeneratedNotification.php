<?php

namespace App\Notifications;

use App\Models\Payroll;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PayrollGeneratedNotification extends Notification
{
    use Queueable;

    public function __construct(private Payroll $payroll) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => "Holerite de {$this->payroll->reference_month}/{$this->payroll->reference_year} gerado para {$this->payroll->employee->name}",
            'payroll_id' => $this->payroll->id,
            'employee_id' => $this->payroll->employee_id,
            'net_salary' => $this->payroll->net_salary,
            'type' => 'payroll_generated',
        ];
    }
}
