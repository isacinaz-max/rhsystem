<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\MultiTenant;
class AuditLog extends Model
{
    use HasFactory, MultiTenant;
    protected $fillable = [
        'user_id',
        'company_id',
        'action',
        'model_type',
        'model_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];
    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
