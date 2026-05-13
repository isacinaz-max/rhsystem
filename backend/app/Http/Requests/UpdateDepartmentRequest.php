<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $departmentId = $this->route('department');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('departments', 'name')->ignore($departmentId)],
            'responsible' => 'nullable|integer|exists:users,id',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do departamento é obrigatório',
            'name.max' => 'O nome deve ter no máximo 255 caracteres',
            'name.unique' => 'Este departamento já existe',
            'responsible.exists' => 'O responsável informado não existe',
        ];
    }
}
