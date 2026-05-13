<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Loggable;
use App\Traits\MultiTenant;
class Recruitment extends Model
{
    use HasFactory, SoftDeletes, Loggable, MultiTenant;
    protected $fillable = [
        'position',
        'description',
        'requirements',
        'salary_range',
        'status',
        'open_date',
        'close_date',
        'company_id',
    ];
    protected $casts = [
        'open_date' => 'date',
        'close_date' => 'date',
    ];
    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }
}
