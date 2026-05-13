<?php
namespace Database\Seeders;
use App\Models\Benefit;
use App\Models\Company;
use Illuminate\Database\Seeder;
class BenefitSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $companyId = $company ? $company->id : null;
        $benefits = [
            ['name' => 'Vale Transporte', 'value' => 250.00, 'type' => 'transporte', 'description' => 'Vale Transporte mensal', 'is_active' => true],
            ['name' => 'Vale Alimentação', 'value' => 500.00, 'type' => 'alimentacao', 'description' => 'Vale Alimentação mensal', 'is_active' => true],
            ['name' => 'Plano de Saúde', 'value' => 400.00, 'type' => 'saude', 'description' => 'Plano de Saúde empresarial', 'is_active' => true],
            ['name' => 'Plano Odontológico', 'value' => 100.00, 'type' => 'odontologico', 'description' => 'Plano Odontológico empresarial', 'is_active' => true],
            ['name' => 'Seguro de Vida', 'value' => 50.00, 'type' => 'seguro', 'description' => 'Seguro de Vida em grupo', 'is_active' => true],
            ['name' => 'Auxílio Creche', 'value' => 300.00, 'type' => 'creche', 'description' => 'Auxílio Creche mensal', 'is_active' => true],
        ];
        foreach ($benefits as $benefit) {
            $benefit['company_id'] = $companyId;
            Benefit::create($benefit);
        }
    }
}
