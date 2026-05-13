<?php
namespace Database\Seeders;
use App\Models\Position;
use Illuminate\Database\Seeder;
class PositionSeeder extends Seeder
{
    public function run(): void
    {
        $positions = [
            ['name' => 'Analista de RH', 'base_salary' => 4500.00, 'description' => 'Analista de Recursos Humanos'],
            ['name' => 'Desenvolvedor', 'base_salary' => 6000.00, 'description' => 'Desenvolvedor de Software'],
            ['name' => 'Analista Financeiro', 'base_salary' => 5000.00, 'description' => 'Analista do Departamento Financeiro'],
            ['name' => 'Vendedor', 'base_salary' => 2500.00, 'description' => 'Vendedor Comercial'],
            ['name' => 'Auxiliar Administrativo', 'base_salary' => 2000.00, 'description' => 'Auxiliar Administrativo'],
            ['name' => 'Gerente de TI', 'base_salary' => 10000.00, 'description' => 'Gerente de Tecnologia da Informação'],
            ['name' => 'Coordenador de RH', 'base_salary' => 7000.00, 'description' => 'Coordenador de Recursos Humanos'],
            ['name' => 'Assistente de DP', 'base_salary' => 3000.00, 'description' => 'Assistente de Departamento Pessoal'],
        ];
        foreach ($positions as $pos) {
            Position::create($pos);
        }
    }
}
