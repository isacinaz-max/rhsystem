<?php

namespace App\Services;

use App\Models\TimeRecord;
use App\Repositories\TimeRecordRepository;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class TimeRecordService
{
    public function __construct(private TimeRecordRepository $timeRecordRepository) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->timeRecordRepository->all($filters);
    }

    public function find(int $id): ?TimeRecord
    {
        return $this->timeRecordRepository->findById($id);
    }

    public function create(array $data): TimeRecord
    {
        return $this->timeRecordRepository->create($data);
    }

    public function clockIn(int $employeeId): TimeRecord
    {
        $existing = $this->timeRecordRepository->todayRecord($employeeId);
        if ($existing) {
            throw new \RuntimeException('Registro de hoje já existe');
        }

        return $this->timeRecordRepository->create([
            'employee_id' => $employeeId,
            'record_date' => today(),
            'entry_time' => now()->format('H:i:s'),
        ]);
    }

    public function clockOut(int $employeeId): TimeRecord
    {
        $record = $this->timeRecordRepository->todayRecord($employeeId);
        if (!$record) {
            throw new \RuntimeException('Nenhum registro de entrada encontrado');
        }
        if ($record->exit_time) {
            throw new \RuntimeException('Saída já registrada');
        }

        $this->timeRecordRepository->update($record, [
            'exit_time' => now()->format('H:i:s'),
        ]);

        $this->calculateDailyHours($record);

        return $record->fresh();
    }

    public function lunchStart(int $employeeId): TimeRecord
    {
        $record = $this->timeRecordRepository->todayRecord($employeeId);
        if (!$record) {
            throw new \RuntimeException('Nenhum registro de entrada encontrado');
        }
        if ($record->lunch_start) {
            throw new \RuntimeException('Almoço já iniciado');
        }

        $this->timeRecordRepository->update($record, [
            'lunch_start' => now()->format('H:i:s'),
        ]);

        return $record->fresh();
    }

    public function lunchEnd(int $employeeId): TimeRecord
    {
        $record = $this->timeRecordRepository->todayRecord($employeeId);
        if (!$record) {
            throw new \RuntimeException('Nenhum registro de entrada encontrado');
        }
        if (!$record->lunch_start) {
            throw new \RuntimeException('Almoço não iniciado');
        }
        if ($record->lunch_end) {
            throw new \RuntimeException('Almoço já finalizado');
        }

        $this->timeRecordRepository->update($record, [
            'lunch_end' => now()->format('H:i:s'),
        ]);

        return $record->fresh();
    }

    public function calculateDailyHours(TimeRecord $record): void
    {
        if (!$record->entry_time || !$record->exit_time) {
            return;
        }

        $entry = Carbon::parse($record->record_date . ' ' . $record->entry_time);
        $exit = Carbon::parse($record->record_date . ' ' . $record->exit_time);
        $totalMinutes = $entry->diffInMinutes($exit);

        if ($record->lunch_start && $record->lunch_end) {
            $lunchStart = Carbon::parse($record->record_date . ' ' . $record->lunch_start);
            $lunchEnd = Carbon::parse($record->record_date . ' ' . $record->lunch_end);
            $totalMinutes -= $lunchStart->diffInMinutes($lunchEnd);
        }

        $hours = intdiv($totalMinutes, 60);
        $minutes = $totalMinutes % 60;

        $this->timeRecordRepository->update($record, [
            'total_hours' => sprintf('%02d:%02d', $hours, $minutes),
        ]);
    }

    public function calculateOvertime(int $employeeId, int $month, int $year): array
    {
        $records = $this->timeRecordRepository->monthlyReport($employeeId, $month, $year);
        $expectedDailyMinutes = 480;
        $totalOvertimeMinutes = 0;
        $totalHoursMinutes = 0;

        foreach ($records as $record) {
            if (!$record->total_hours) continue;

            $parts = explode(':', $record->total_hours);
            $workedMinutes = ($parts[0] * 60) + $parts[1];
            $totalHoursMinutes += $workedMinutes;

            if ($workedMinutes > $expectedDailyMinutes) {
                $totalOvertimeMinutes += $workedMinutes - $expectedDailyMinutes;
            }
        }

        return [
            'total_hours' => sprintf('%02d:%02d', intdiv($totalHoursMinutes, 60), $totalHoursMinutes % 60),
            'overtime' => sprintf('%02d:%02d', intdiv($totalOvertimeMinutes, 60), $totalOvertimeMinutes % 60),
            'expected' => sprintf('%02d:%02d', intdiv($expectedDailyMinutes * count($records), 60), ($expectedDailyMinutes * count($records)) % 60),
        ];
    }

    public function getMonthlyReport(int $employeeId, int $month, int $year): Collection
    {
        return $this->timeRecordRepository->monthlyReport($employeeId, $month, $year);
    }

    public function update(TimeRecord $timeRecord, array $data): TimeRecord
    {
        $this->timeRecordRepository->update($timeRecord, $data);
        return $timeRecord->fresh();
    }

    public function delete(TimeRecord $timeRecord): bool
    {
        return $this->timeRecordRepository->delete($timeRecord);
    }
}
