<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCandidateRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'recruitment_id' => 'required|integer|exists:recruitments,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'status' => 'nullable|string|in:pendente,analisado,entrevistado,aprovado,reprovado',
        ];
    }

    public function messages(): array
    {
        return [
            'recruitment_id.required' => 'O processo seletivo é obrigatório',
            'recruitment_id.exists' => 'O processo seletivo informado não existe',
            'name.required' => 'O nome do candidato é obrigatório',
            'name.max' => 'O nome deve ter no máximo 255 caracteres',
            'email.required' => 'O email é obrigatório',
            'email.email' => 'Informe um email válido',
            'email.max' => 'O email deve ter no máximo 255 caracteres',
            'phone.required' => 'O telefone é obrigatório',
            'phone.max' => 'O telefone deve ter no máximo 20 caracteres',
            'resume.mimes' => 'O currículo deve ser PDF, DOC ou DOCX',
            'resume.max' => 'O currículo deve ter no máximo 5MB',
            'status.in' => 'O status deve ser: pendente, analisado, entrevistado, aprovado ou reprovado',
        ];
    }
}
