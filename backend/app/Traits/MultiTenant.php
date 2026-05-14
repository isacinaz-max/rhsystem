<?php
namespace App\Traits;
use Illuminate\Database\Eloquent\Builder;
trait MultiTenant
{
    protected static function bootMultiTenant(): void
    {
        static::addGlobalScope('company', function (Builder $builder) {
            if (auth()->check() && !auth()->user()->is_super_admin) {
                $builder->where($builder->getModel()->getTable() . '.company_id', auth()->user()->company_id);
            }
        });
        static::creating(function ($model) {
            if (auth()->check() && !auth()->user()->is_super_admin) {
                $model->company_id = auth()->user()->company_id;
            }
        });
    }
    public function company()
    {
        return $this->belongsTo(\App\Models\Company::class);
    }
}
