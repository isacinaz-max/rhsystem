<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Loggable;
use App\Traits\MultiTenant;
class Employee extends Model
{
    use HasFactory, SoftDeletes, Loggable, MultiTenant;

    protected $appends = ['photo_url'];

    protected $fillable = [
        'name',
        'cpf',
        'rg',
        'birth_date',
        'gender',
        'marital_status',
        'email',
        'phone',
        'address',
        'zip_code',
        'city',
        'state',
        'neighborhood',
        'street',
        'number',
        'complement',
        'position_id',
        'department_id',
        'company_id',
        'salary',
        'hire_date',
        'status',
        'photo',
        'notes',
    ];
    protected $casts = [
        'salary' => 'decimal:2',
        'birth_date' => 'date',
        'hire_date' => 'date',
    ];
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    public function position()
    {
        return $this->belongsTo(Position::class);
    }
    public function user()
    {
        return $this->hasOne(User::class);
    }
    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }
    public function vacations()
    {
        return $this->hasMany(Vacation::class);
    }
    public function timeRecords()
    {
        return $this->hasMany(TimeRecord::class);
    }
    public function benefits()
    {
        return $this->belongsToMany(Benefit::class, 'employee_benefit')
            ->withPivot('granted_date')
            ->withTimestamps();
    }
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    public function payrollItems()
    {
        return $this->hasMany(EmployeePayrollItem::class);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        if ($this->photo) {
            return \Illuminate\Support\Facades\Storage::disk('public')->url($this->photo);
        }
        return null;
    }
}
