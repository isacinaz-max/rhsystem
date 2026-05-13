<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Loggable;
class Company extends Model
{
    use HasFactory, SoftDeletes, Loggable;
    protected $fillable = [
        'razao_social',
        'nome_fantasia',
        'cnpj',
        'inscricao_estadual',
        'telefone',
        'email',
        'cep',
        'endereco',
        'numero',
        'bairro',
        'cidade',
        'estado',
        'logo',
        'status',
        'is_active',
    ];
    protected $casts = [
        'is_active' => 'boolean',
    ];
    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
    public function departments()
    {
        return $this->hasMany(Department::class);
    }
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }
}
