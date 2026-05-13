<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Loggable;
use App\Traits\MultiTenant;
class Department extends Model
{
    use HasFactory, SoftDeletes, Loggable, MultiTenant;
    protected $fillable = [
        'name',
        'responsible',
        'description',
        'company_id',
    ];
    public function responsible()
    {
        return $this->belongsTo(User::class, 'responsible');
    }
    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
