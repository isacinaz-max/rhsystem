<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Loggable;
use App\Traits\MultiTenant;
class Benefit extends Model
{
    use HasFactory, SoftDeletes, Loggable, MultiTenant;
    protected $fillable = [
        'name',
        'value',
        'type',
        'description',
        'is_active',
        'company_id',
    ];
    protected $casts = [
        'value' => 'decimal:2',
        'is_active' => 'boolean',
    ];
    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_benefit')
            ->withPivot('granted_date')
            ->withTimestamps();
    }
}
