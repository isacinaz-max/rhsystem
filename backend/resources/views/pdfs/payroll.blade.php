<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Holerite</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10px;
            color: #333;
            padding: 15px;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #222;
            padding-bottom: 10px;
        }
        .header h1 {
            font-size: 16px;
            text-transform: uppercase;
            font-weight: bold;
        }
        .header p {
            font-size: 10px;
            color: #555;
        }
        .info-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .info-grid td {
            padding: 3px 5px;
            font-size: 10px;
            vertical-align: top;
        }
        .info-grid .label {
            font-weight: bold;
            width: 20%;
        }
        .info-grid .value {
            width: 30%;
        }
        table.data {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        table.data th {
            background: #222;
            color: #fff;
            padding: 5px 6px;
            font-size: 9px;
            text-align: left;
            text-transform: uppercase;
        }
        table.data td {
            padding: 4px 6px;
            font-size: 9px;
            border-bottom: 1px solid #ddd;
        }
        table.data .credit { color: #059669; }
        table.data .debit { color: #dc2626; }
        table.data .right { text-align: right; }
        table.data .center { text-align: center; }
        .summary {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .summary td {
            padding: 5px 8px;
            font-size: 10px;
            border: 1px solid #222;
        }
        .summary .label {
            font-weight: bold;
            background: #f3f4f6;
            width: 25%;
        }
        .summary .value {
            font-weight: bold;
            width: 25%;
        }
        .summary .total { font-size: 12px; }
        .footer {
            margin-top: 30px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
        }
        .footer .date-line {
            font-size: 9px;
            margin-bottom: 30px;
        }
        .footer .signature-line {
            width: 300px;
            border-top: 1px solid #333;
            margin: 0 auto 5px auto;
        }
        .footer .signature-label {
            font-size: 9px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Holerite</h1>
        <p>{{ $payroll->competence }}</p>
    </div>

    <table class="info-grid">
        <tr>
            <td class="label">Colaborador:</td>
            <td class="value">{{ $payroll->employee->name }}</td>
            <td class="label">Empresa:</td>
            <td class="value">{{ $payroll->company->nome_fantasia ?? $payroll->company->razao_social ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Cargo:</td>
            <td class="value">{{ $payroll->employee->position->name ?? '-' }}</td>
            <td class="label">Cidade:</td>
            <td class="value">{{ $payroll->employee->city ?? '-' }}</td>
        </tr>
    </table>

    <table class="data">
        <thead>
            <tr>
                <th style="width:5%">Tipo</th>
                <th style="width:35%">Histórico</th>
                <th style="width:20%">Referência</th>
                <th style="width:10%">Obs</th>
                <th style="width:15%" class="right">Valor (R$)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="5" style="font-weight:bold; background:#f9fafb; font-size:9px;">Vencimentos</td>
            </tr>
            <tr>
                <td class="credit">C</td>
                <td>Salário Base</td>
                <td class="center">{{ $payroll->competence }}</td>
                <td></td>
                <td class="right">{{ number_format($payroll->base_salary, 2, ',', '.') }}</td>
            </tr>
            @foreach($payroll->items->where('type', 'credit') as $item)
            <tr>
                <td class="credit">C</td>
                <td>{{ $item->description }}</td>
                <td class="center">{{ $payroll->competence }}</td>
                <td></td>
                <td class="right">{{ number_format($item->calculated_amount, 2, ',', '.') }}</td>
            </tr>
            @endforeach
            <tr>
                <td colspan="5" style="font-weight:bold; background:#f9fafb; font-size:9px;">Descontos</td>
            </tr>
            @foreach($payroll->items->where('type', 'debit') as $item)
            <tr>
                <td class="debit">D</td>
                <td>{{ $item->description }}</td>
                <td class="center">{{ $payroll->competence }}</td>
                <td></td>
                <td class="right">{{ number_format($item->calculated_amount, 2, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table class="summary">
        <tr>
            <td class="label">Base</td>
            <td class="value">{{ number_format($payroll->base_salary, 2, ',', '.') }}</td>
            <td class="label">Créditos</td>
            <td class="value">{{ number_format($payroll->total_credit ?? 0, 2, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="label">Débitos</td>
            <td class="value">{{ number_format($payroll->total_debit ?? 0, 2, ',', '.') }}</td>
            <td class="label total">Líquido</td>
            <td class="value total">{{ number_format($payroll->net_salary, 2, ',', '.') }}</td>
        </tr>
    </table>

    <div class="footer">
        <div class="date-line">Data: ____/____/________</div>
        <div class="signature-line"></div>
        <div class="signature-label">Assinatura</div>
    </div>

</body>
</html>
