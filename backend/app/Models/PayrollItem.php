<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\MultiTenant;
class PayrollItem extends Model
{
    use HasFactory, MultiTenant;
    protected $fillable = [
        'payroll_id',
        'company_id',
        'employee_payroll_item_id',
        'description',
        'type',
        'calculation_type',
        'amount',
        'percentage',
        'calculated_amount',
    ];
    protected $casts = [
        'amount' => 'decimal:2',
        'percentage' => 'decimal:2',
        'calculated_amount' => 'decimal:2',
    ];
    public function payroll()
    {
        return $this->belongsTo(Payroll::class);
    }
    public function employeePayrollItem()
    {
        return $this->belongsTo(EmployeePayrollItem::class);
    }
}
