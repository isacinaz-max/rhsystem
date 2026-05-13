<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTimeRecordRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|integer|exists:employees,id',
            'record_date' => 'required|date',
            'entry_time' => 'nullable|string',
            'exit_time' => 'nullable|string',
            'lunch_start' => 'nullable|string',
            'lunch_end' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.required' => 'O funcionário é obrigatório',
            'employee_id.exists' => 'O funcionário informado não existe',
            'record_date.required' => 'A data do registro é obrigatória',
            'record_date.date' => 'Informe uma data válida',
        ];
    }
}
