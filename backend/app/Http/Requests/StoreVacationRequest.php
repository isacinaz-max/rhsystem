<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVacationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|integer|exists:employees,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'days' => 'required|integer|min:1|max:30',
            'notes' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.required' => 'O funcionário é obrigatório',
            'employee_id.exists' => 'O funcionário informado não existe',
            'start_date.required' => 'A data de início é obrigatória',
            'start_date.date' => 'Informe uma data de início válida',
            'end_date.required' => 'A data de fim é obrigatória',
            'end_date.date' => 'Informe uma data de fim válida',
            'end_date.after' => 'A data de fim deve ser posterior à data de início',
            'days.required' => 'A quantidade de dias é obrigatória',
            'days.min' => 'A quantidade de dias deve ser no mínimo 1',
            'days.max' => 'A quantidade de dias deve ser no máximo 30',
        ];
    }
}
