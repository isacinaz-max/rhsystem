<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Loggable;
use App\Traits\MultiTenant;
class Payroll extends Model
{
    use HasFactory, SoftDeletes, Loggable, MultiTenant;
    protected $fillable = [
        'employee_id',
        'company_id',
        'competence',
        'reference_month',
        'reference_year',
        'base_salary',
        'benefits_total',
        'discounts_total',
        'inss',
        'fgts',
        'irrf',
        'transportation_vouchers',
        'meal_vouchers',
        'net_salary',
        'total_credit',
        'total_debit',
        'payment_status',
        'payment_date',
        'observations',
        'status',
    ];
    protected $casts = [
        'base_salary' => 'decimal:2',
        'benefits_total' => 'decimal:2',
        'discounts_total' => 'decimal:2',
        'inss' => 'decimal:2',
        'fgts' => 'decimal:2',
        'irrf' => 'decimal:2',
        'transportation_vouchers' => 'decimal:2',
        'meal_vouchers' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'total_credit' => 'decimal:2',
        'total_debit' => 'decimal:2',
        'payment_date' => 'date',
    ];
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    public function items()
    {
        return $this->hasMany(PayrollItem::class);
    }
}
