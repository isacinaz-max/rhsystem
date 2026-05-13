<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Loggable;
class EmployeePayrollItem extends Model
{
    use HasFactory, Loggable;
    protected $fillable = [
        'employee_id',
        'benefit_id',
        'description',
        'type',
        'calculation_type',
        'amount',
        'percentage',
        'reference_salary',
        'active',
    ];
    protected $casts = [
        'amount' => 'decimal:2',
        'percentage' => 'decimal:2',
        'reference_salary' => 'boolean',
        'active' => 'boolean',
    ];
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
    public function benefit()
    {
        return $this->belongsTo(Benefit::class);
    }
}
