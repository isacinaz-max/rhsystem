<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $employeeId = $this->route('employee');

        return [
            'name' => 'required|string|max:255',
            'cpf' => ['required', 'string', 'max:14', Rule::unique('employees', 'cpf')->ignore($employeeId)],
            'rg' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|in:masculino,feminino,outro',
            'marital_status' => 'nullable|string|max:30',
            'email' => ['nullable', 'email', 'max:255', Rule::unique('employees', 'email')->ignore($employeeId)],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'company_id' => 'sometimes|required|integer|exists:companies,id',
            'position_id' => 'nullable|integer|exists:positions,id',
            'department_id' => 'nullable|integer|exists:departments,id',
            'salary' => 'nullable|numeric|min:0',
            'hire_date' => 'nullable|date',
            'status' => 'nullable|string|in:ativo,afastado,ferias,desligado',
            'photo' => 'nullable|image|max:2048',
            'notes' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'name.max' => 'O nome deve ter no máximo 255 caracteres',
            'cpf.required' => 'O CPF é obrigatório',
            'cpf.unique' => 'Este CPF já está cadastrado',
            'cpf.max' => 'O CPF deve ter no máximo 14 caracteres',
            'rg.max' => 'O RG deve ter no máximo 20 caracteres',
            'birth_date.date' => 'Informe uma data de nascimento válida',
            'gender.in' => 'O gênero deve ser masculino, feminino ou outro',
            'marital_status.max' => 'O estado civil deve ter no máximo 30 caracteres',
            'email.email' => 'Informe um email válido',
            'email.unique' => 'Este email já está cadastrado',
            'email.max' => 'O email deve ter no máximo 255 caracteres',
            'phone.max' => 'O telefone deve ter no máximo 20 caracteres',
            'position_id.exists' => 'O cargo informado não existe',
            'department_id.exists' => 'O departamento informado não existe',
            'salary.numeric' => 'O salário deve ser um valor numérico',
            'salary.min' => 'O salário não pode ser negativo',
            'hire_date.date' => 'Informe uma data de admissão válida',
            'status.in' => 'O status deve ser: ativo, afastado, férias ou desligado',
            'photo.image' => 'A foto deve ser uma imagem',
            'photo.max' => 'A foto deve ter no máximo 2MB',
        ];
    }
}
