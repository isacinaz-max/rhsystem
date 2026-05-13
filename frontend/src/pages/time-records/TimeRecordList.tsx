import { useEffect, useState, useCallback } from 'react'
import { Clock, Coffee, LogIn, LogOut, Loader2 } from 'lucide-react'
import { timeRecordService } from '../../services/timeRecordService'
import DataTable from '../../components/ui/DataTable'
import PageContainer from '../../components/ui/PageContainer'
import Card from '../../components/ui/Card'
import { TimeRecord } from '../../types'
import toast from 'react-hot-toast'

export default function TimeRecordList() {
  const [records, setRecords] = useState<TimeRecord[]>([])
  const [todayRecord, setTodayRecord] = useState<TimeRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [clockLoading, setClockLoading] = useState(false)
  const [month, setMonth] = useState(now().month)
  const [year, setYear] = useState(now().year)

  function now() {
    const d = new Date()
    return { month: d.getMonth() + 1, year: d.getFullYear() }
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await timeRecordService.report({ month, year })
      setRecords(res.data.data || [])
      const today = res.data.data?.find((r: TimeRecord) => r.record_date === new Date().toISOString().split('T')[0])
      setTodayRecord(today || null)
    } catch { toast.error('Erro ao carregar registros') }
    finally { setLoading(false) }
  }, [month, year])

  useEffect(() => { loadData() }, [loadData])

  async function handleClockIn() {
    setClockLoading(true)
    try { await timeRecordService.clockIn({}); toast.success('Ponto registrado!'); loadData() }
    catch (e: any) { toast.error(e.response?.data?.message || 'Erro') }
    finally { setClockLoading(false) }
  }

  async function handleClockOut() {
    setClockLoading(true)
    try { await timeRecordService.clockOut({}); toast.success('Saída registrada!'); loadData() }
    catch (e: any) { toast.error(e.response?.data?.message || 'Erro') }
    finally { setClockLoading(false) }
  }

  async function handleLunchStart() {
    setClockLoading(true)
    try { await timeRecordService.lunchStart({}); toast.success('Início do almoço registrado!'); loadData() }
    catch (e: any) { toast.error(e.response?.data?.message || 'Erro') }
    finally { setClockLoading(false) }
  }

  async function handleLunchEnd() {
    setClockLoading(true)
    try { await timeRecordService.lunchEnd({}); toast.success('Fim do almoço registrado!'); loadData() }
    catch (e: any) { toast.error(e.response?.data?.message || 'Erro') }
    finally { setClockLoading(false) }
  }

  const totalHours = records.reduce((acc, r) => {
    if (r.entry_time && r.exit_time) {
      const entry = new Date(`2000-01-01T${r.entry_time}`)
      const exit = new Date(`2000-01-01T${r.exit_time}`)
      return acc + (exit.getTime() - entry.getTime()) / 3600000
    }
    return acc
  }, 0)

  const totalOvertime = records.reduce((acc, r) => acc + (r.overtime || 0), 0)

  return (
    <PageContainer
      title="Controle de Ponto"
      subtitle="Registre e acompanhe sua jornada de trabalho"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Registrar Ponto</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button onClick={handleClockIn} disabled={clockLoading || !!todayRecord?.entry_time} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <LogIn className="w-6 h-6" />
              <span className="text-sm font-medium">Entrada</span>
              {todayRecord?.entry_time && <span className="text-xs text-slate-400">{todayRecord.entry_time}</span>}
            </button>
            <button onClick={handleLunchStart} disabled={clockLoading || !todayRecord?.entry_time || !!todayRecord?.lunch_start} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-900/30 text-amber-400 hover:bg-amber-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <Coffee className="w-6 h-6" />
              <span className="text-sm font-medium">Almoço</span>
              {todayRecord?.lunch_start && <span className="text-xs text-slate-400">{todayRecord.lunch_start}</span>}
            </button>
            <button onClick={handleLunchEnd} disabled={clockLoading || !todayRecord?.lunch_start || !!todayRecord?.lunch_end} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <Coffee className="w-6 h-6" />
              <span className="text-sm font-medium">Volta</span>
              {todayRecord?.lunch_end && <span className="text-xs text-slate-400">{todayRecord.lunch_end}</span>}
            </button>
            <button onClick={handleClockOut} disabled={clockLoading || !todayRecord?.entry_time || !!todayRecord?.exit_time} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-900/30 text-red-400 hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <LogOut className="w-6 h-6" />
              <span className="text-sm font-medium">Saída</span>
              {todayRecord?.exit_time && <span className="text-xs text-slate-400">{todayRecord.exit_time}</span>}
            </button>
          </div>
          {clockLoading && (
            <div className="flex items-center justify-center mt-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              <span className="ml-2 text-sm text-slate-400">Registrando...</span>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Resumo do Mês</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400">Total de Horas</p>
              <p className="text-2xl font-bold text-white">{totalHours.toFixed(1)}h</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Horas Extras</p>
              <p className="text-2xl font-bold text-amber-400">{totalOvertime.toFixed(1)}h</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Dias Trabalhados</p>
              <p className="text-2xl font-bold text-white">{records.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Registros do Mês</h3>
          <div className="flex gap-2">
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="input-field w-32 text-sm">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</option>
              ))}
            </select>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="input-field w-24 text-sm">
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <DataTable
            columns={[
              { key: 'record_date', header: 'Data' },
              { key: 'entry_time', header: 'Entrada', render: (item: TimeRecord) => item.entry_time || '-' },
              { key: 'lunch_start', header: 'Almoço (início)', render: (item: TimeRecord) => item.lunch_start || '-' },
              { key: 'lunch_end', header: 'Almoço (fim)', render: (item: TimeRecord) => item.lunch_end || '-' },
              { key: 'exit_time', header: 'Saída', render: (item: TimeRecord) => item.exit_time || '-' },
              { key: 'overtime', header: 'H. Extras', render: (item: TimeRecord) => item.overtime ? `${item.overtime}h` : '-' },
              { key: 'bank_hours', header: 'Banco Horas', render: (item: TimeRecord) => item.bank_hours ? `${item.bank_hours}h` : '-' },
            ]}
            data={records}
            loading={loading}
          />
        </div>
      </Card>
    </PageContainer>
  )
}
