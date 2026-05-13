<?php
namespace Database\Seeders;
use App\Models\Company;
use Illuminate\Database\Seeder;
class CompanySeeder extends Seeder
{
    public function run(): void
    {
        Company::create([
            'razao_social' => 'Empresa Principal LTDA',
            'nome_fantasia' => 'Empresa Principal',
            'cnpj' => '00.000.000/0001-91',
            'inscricao_estadual' => '123.456.789',
            'telefone' => '(11) 99999-8888',
            'email' => 'contato@empresaprincipal.com.br',
            'cep' => '01001-000',
            'endereco' => 'Av. Paulista',
            'numero' => '1000',
            'bairro' => 'Bela Vista',
            'cidade' => 'São Paulo',
            'estado' => 'SP',
            'status' => 'ativo',
            'is_active' => true,
        ]);
    }
}
