<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePayrollRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|integer|exists:employees,id',
            'reference_month' => 'required|integer|between:1,12',
            'reference_year' => 'required|integer|min:2020',
            'base_salary' => 'required|numeric|min:0',
            'benefits' => 'required|numeric|min:0',
            'discounts' => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.required' => 'O funcionário é obrigatório',
            'employee_id.exists' => 'O funcionário informado não existe',
            'reference_month.required' => 'O mês de referência é obrigatório',
            'reference_month.between' => 'O mês de referência deve ser entre 1 e 12',
            'reference_year.required' => 'O ano de referência é obrigatório',
            'reference_year.min' => 'O ano de referência deve ser a partir de 2020',
            'base_salary.required' => 'O salário base é obrigatório',
            'base_salary.numeric' => 'O salário base deve ser um valor numérico',
            'base_salary.min' => 'O salário base não pode ser negativo',
            'benefits.required' => 'O valor de benefícios é obrigatório',
            'benefits.numeric' => 'O valor de benefícios deve ser numérico',
            'benefits.min' => 'O valor de benefícios não pode ser negativo',
            'discounts.required' => 'O valor de descontos é obrigatório',
            'discounts.numeric' => 'O valor de descontos deve ser numérico',
            'discounts.min' => 'O valor de descontos não pode ser negativo',
        ];
    }
}
