<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\MultiTenant;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, MultiTenant;
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'permissions',
        'is_active',
        'company_id',
        'employee_id',
        'is_super_admin',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'is_super_admin' => 'boolean',
        'password' => 'hashed',
        'permissions' => 'array',
    ];
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
    public function isAdmin(): bool
    {
        return $this->role === 'administrador';
    }
    public function isRh(): bool
    {
        return $this->role === 'rh';
    }
    public function isManager(): bool
    {
        return $this->role === 'gestor';
    }
    public function isEmployee(): bool
    {
        return $this->role === 'funcionario';
    }
}
