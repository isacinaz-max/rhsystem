<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Loggable;
use App\Traits\MultiTenant;
class TimeRecord extends Model
{
    use HasFactory, SoftDeletes, Loggable, MultiTenant;
    protected $fillable = [
        'employee_id',
        'record_date',
        'entry_time',
        'exit_time',
        'lunch_start',
        'lunch_end',
        'overtime',
        'bank_hours',
        'notes',
        'company_id',
    ];
    protected $casts = [
        'record_date' => 'date',
    ];
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
