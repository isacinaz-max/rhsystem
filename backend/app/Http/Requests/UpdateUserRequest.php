<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|required|string|in:administrador,rh,gestor,funcionario',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|in:create,update,delete,reports',
            'is_active' => 'nullable|boolean',
            'is_super_admin' => 'nullable|boolean',
            'company_id' => 'nullable|integer|exists:companies,id',
            'employee_id' => 'nullable|integer|exists:employees,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'email.required' => 'O email é obrigatório',
            'email.unique' => 'Este email já está em uso',
            'password.min' => 'A senha deve ter no mínimo 6 caracteres',
            'role.required' => 'O perfil é obrigatório',
            'role.in' => 'Perfil inválido',
        ];
    }
}
