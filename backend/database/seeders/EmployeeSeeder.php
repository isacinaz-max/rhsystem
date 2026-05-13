<?php
namespace Database\Seeders;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Position;
use App\Models\Company;
use Illuminate\Database\Seeder;
class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $companyId = $company ? $company->id : null;
        $departments = Department::pluck('id')->toArray();
        $positions = Position::pluck('id')->toArray();
        $employees = [
            ['name' => 'Ana Silva', 'cpf' => '529.982.247-25', 'rg' => '12.345.678-9', 'email' => 'ana.silva@empresa.com', 'phone' => '(11) 99999-0001', 'salary' => 4500.00, 'status' => 'ativo'],
            ['name' => 'Carlos Santos', 'cpf' => '123.456.789-09', 'rg' => '98.765.432-1', 'email' => 'carlos.santos@empresa.com', 'phone' => '(11) 99999-0002', 'salary' => 6000.00, 'status' => 'ativo'],
            ['name' => 'Mariana Oliveira', 'cpf' => '987.654.321-00', 'rg' => '11.222.333-4', 'email' => 'mariana.oliveira@empresa.com', 'phone' => '(11) 99999-0003', 'salary' => 5000.00, 'status' => 'ativo'],
            ['name' => 'Pedro Costa', 'cpf' => '111.222.333-44', 'rg' => '55.666.777-8', 'email' => 'pedro.costa@empresa.com', 'phone' => '(11) 99999-0004', 'salary' => 2500.00, 'status' => 'ativo'],
            ['name' => 'Juliana Lima', 'cpf' => '555.666.777-88', 'rg' => '99.888.777-6', 'email' => 'juliana.lima@empresa.com', 'phone' => '(11) 99999-0005', 'salary' => 2000.00, 'status' => 'ativo'],
            ['name' => 'Roberto Almeida', 'cpf' => '444.555.666-77', 'rg' => '33.444.555-6', 'email' => 'roberto.almeida@empresa.com', 'phone' => '(11) 99999-0006', 'salary' => 10000.00, 'status' => 'ativo'],
            ['name' => 'Fernanda Souza', 'cpf' => '777.888.999-00', 'rg' => '77.888.999-0', 'email' => 'fernanda.souza@empresa.com', 'phone' => '(11) 99999-0007', 'salary' => 7000.00, 'status' => 'ativo'],
            ['name' => 'Lucas Pereira', 'cpf' => '222.333.444-55', 'rg' => '44.555.666-7', 'email' => 'lucas.pereira@empresa.com', 'phone' => '(11) 99999-0008', 'salary' => 3000.00, 'status' => 'ativo'],
            ['name' => 'Amanda Rodrigues', 'cpf' => '888.999.000-11', 'rg' => '66.777.888-9', 'email' => 'amanda.rodrigues@empresa.com', 'phone' => '(11) 99999-0009', 'salary' => 4500.00, 'status' => 'ativo'],
            ['name' => 'Gabriel Martins', 'cpf' => '333.444.555-66', 'rg' => '22.333.444-5', 'email' => 'gabriel.martins@empresa.com', 'phone' => '(11) 99999-0010', 'salary' => 6000.00, 'status' => 'ativo'],
            ['name' => 'Larissa Barbosa', 'cpf' => '666.777.888-99', 'rg' => '88.999.000-1', 'email' => 'larissa.barbosa@empresa.com', 'phone' => '(11) 99999-0011', 'salary' => 5000.00, 'status' => 'ativo'],
            ['name' => 'Thiago Rocha', 'cpf' => '999.000.111-22', 'rg' => '11.222.333-4', 'email' => 'thiago.rocha@empresa.com', 'phone' => '(11) 99999-0012', 'salary' => 2500.00, 'status' => 'afastado'],
            ['name' => 'Patrícia Dias', 'cpf' => '000.111.222-33', 'rg' => '55.666.777-8', 'email' => 'patricia.dias@empresa.com', 'phone' => '(11) 99999-0013', 'salary' => 2000.00, 'status' => 'ativo'],
            ['name' => 'Felipe Nunes', 'cpf' => '111.222.333-55', 'rg' => '99.888.777-6', 'email' => 'felipe.nunes@empresa.com', 'phone' => '(11) 99999-0014', 'salary' => 10000.00, 'status' => 'ativo'],
            ['name' => 'Camila Freitas', 'cpf' => '222.333.444-66', 'rg' => '33.444.555-6', 'email' => 'camila.freitas@empresa.com', 'phone' => '(11) 99999-0015', 'salary' => 7000.00, 'status' => 'ferias'],
            ['name' => 'Rafael Campos', 'cpf' => '333.444.555-77', 'rg' => '77.888.999-0', 'email' => 'rafael.campos@empresa.com', 'phone' => '(11) 99999-0016', 'salary' => 3000.00, 'status' => 'ativo'],
            ['name' => 'Letícia Moreira', 'cpf' => '444.555.666-88', 'rg' => '44.555.666-7', 'email' => 'leticia.moreira@empresa.com', 'phone' => '(11) 99999-0017', 'salary' => 4500.00, 'status' => 'desligado'],
            ['name' => 'Diego Carvalho', 'cpf' => '555.666.777-99', 'rg' => '66.777.888-9', 'email' => 'diego.carvalho@empresa.com', 'phone' => '(11) 99999-0018', 'salary' => 6000.00, 'status' => 'ativo'],
            ['name' => 'Vanessa Teixeira', 'cpf' => '666.777.888-00', 'rg' => '22.333.444-5', 'email' => 'vanessa.teixeira@empresa.com', 'phone' => '(11) 99999-0019', 'salary' => 5000.00, 'status' => 'ativo'],
            ['name' => 'Bruno Araújo', 'cpf' => '777.888.999-11', 'rg' => '88.999.000-1', 'email' => 'bruno.araujo@empresa.com', 'phone' => '(11) 99999-0020', 'salary' => 2500.00, 'status' => 'ativo'],
        ];
        foreach ($employees as $index => $data) {
            $data['birth_date'] = now()->subYears(rand(22, 55))->subDays(rand(1, 365))->format('Y-m-d');
            $data['gender'] = ['masculino', 'feminino', 'outro'][array_rand(['masculino', 'feminino', 'outro'])];
            $data['marital_status'] = ['solteiro', 'casado', 'divorciado', 'viúvo'][array_rand(['solteiro', 'casado', 'divorciado', 'viúvo'])];
            $data['department_id'] = $departments[array_rand($departments)];
            $data['position_id'] = $positions[array_rand($positions)];
            $data['company_id'] = $companyId;
            $data['hire_date'] = now()->subMonths(rand(1, 60))->format('Y-m-d');
            $data['address'] = 'Rua Exemplo, ' . (100 + $index);
            $data['city'] = 'São Paulo';
            $data['state'] = 'SP';
            $data['zip_code'] = '01000-000';
            Employee::create($data);
        }
    }
}
