<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePositionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:positions,name',
            'base_salary' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do cargo é obrigatório',
            'name.max' => 'O nome deve ter no máximo 255 caracteres',
            'name.unique' => 'Este cargo já existe',
            'base_salary.numeric' => 'O salário base deve ser um valor numérico',
            'base_salary.min' => 'O salário base não pode ser negativo',
        ];
    }
}
