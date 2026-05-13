<?php
namespace Database\Seeders;
use App\Models\User;
use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class UserSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $companyId = $company ? $company->id : null;
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@rhsystem.com',
            'password' => Hash::make('123456'),
            'role' => 'administrador',
            'is_active' => true,
            'company_id' => $companyId,
        ]);
        User::create([
            'name' => 'Usuário RH',
            'email' => 'rh@rhsystem.com',
            'password' => Hash::make('123456'),
            'role' => 'rh',
            'is_active' => true,
            'company_id' => $companyId,
        ]);
        User::create([
            'name' => 'Gestor',
            'email' => 'gestor@rhsystem.com',
            'password' => Hash::make('123456'),
            'role' => 'gestor',
            'is_active' => true,
            'company_id' => $companyId,
        ]);
        User::create([
            'name' => 'Funcionário',
            'email' => 'funcionario@rhsystem.com',
            'password' => Hash::make('123456'),
            'role' => 'funcionario',
            'is_active' => true,
            'company_id' => $companyId,
        ]);
    }
}
