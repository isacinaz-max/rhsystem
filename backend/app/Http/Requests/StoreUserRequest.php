<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:administrador,rh,gestor,funcionario',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|in:create,update,delete,reports',
            'is_active' => 'nullable|boolean',
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
            'password.required' => 'A senha é obrigatória',
            'password.min' => 'A senha deve ter no mínimo 6 caracteres',
            'role.required' => 'O perfil é obrigatório',
            'role.in' => 'Perfil inválido',
        ];
    }
}
