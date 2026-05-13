<?php
namespace Database\Seeders;
use App\Models\Department;
use Illuminate\Database\Seeder;
class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Recursos Humanos', 'description' => 'Departamento de Gestão de Pessoas'],
            ['name' => 'Tecnologia da Informação', 'description' => 'Departamento de TI e Sistemas'],
            ['name' => 'Financeiro', 'description' => 'Departamento Financeiro e Contábil'],
            ['name' => 'Comercial', 'description' => 'Departamento de Vendas e Comercial'],
            ['name' => 'Operações', 'description' => 'Departamento de Operações e Logística'],
        ];
        foreach ($departments as $dept) {
            Department::create($dept);
        }
    }
}
