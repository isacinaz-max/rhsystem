<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Loggable;
use App\Traits\MultiTenant;
class Position extends Model
{
    use HasFactory, SoftDeletes, Loggable, MultiTenant;
    protected $fillable = [
        'name',
        'base_salary',
        'description',
        'company_id',
    ];
    protected $casts = [
        'base_salary' => 'decimal:2',
    ];
    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
