<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBenefitRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'value' => 'required|numeric|min:0',
            'type' => 'required|string|in:vale_transporte,vale_alimentacao,plano_saude,plano_odontologico,seguro_vida,auxilio_creche,outro',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do benefício é obrigatório',
            'name.max' => 'O nome deve ter no máximo 255 caracteres',
            'value.required' => 'O valor é obrigatório',
            'value.numeric' => 'O valor deve ser numérico',
            'value.min' => 'O valor não pode ser negativo',
            'type.required' => 'O tipo do benefício é obrigatório',
            'type.in' => 'O tipo deve ser: vale_transporte, vale_alimentacao, plano_saude, plano_odontologico, seguro_vida, auxilio_creche ou outro',
        ];
    }
}
