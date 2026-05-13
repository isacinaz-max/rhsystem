<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecruitmentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'position' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'salary_range' => 'nullable|string',
            'status' => 'required|string|in:aberta,andamento,fechada,cancelada',
        ];
    }

    public function messages(): array
    {
        return [
            'position.required' => 'O cargo/posição é obrigatório',
            'position.max' => 'O cargo deve ter no máximo 255 caracteres',
            'description.required' => 'A descrição é obrigatória',
            'status.required' => 'O status é obrigatório',
            'status.in' => 'O status deve ser: aberta, andamento, fechada ou cancelada',
        ];
    }
}
