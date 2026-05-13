<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Loggable;
use App\Traits\MultiTenant;
class Candidate extends Model
{
    use HasFactory, SoftDeletes, Loggable, MultiTenant;
    protected $fillable = [
        'recruitment_id',
        'name',
        'email',
        'phone',
        'resume',
        'status',
        'interview_date',
        'interview_notes',
        'observations',
        'company_id',
    ];
    protected $casts = [
        'interview_date' => 'datetime',
    ];
    public function recruitment()
    {
        return $this->belongsTo(Recruitment::class);
    }
}
