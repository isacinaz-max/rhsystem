interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    ativo: 'status-badge status-active',
    afastado: 'status-badge bg-orange-900/50 text-orange-300',
    ferias: 'status-badge status-pending',
    desligado: 'status-badge status-inactive',
    aprovado: 'status-badge status-active',
    rejeitado: 'status-badge status-inactive',
    pendente: 'status-badge status-pending',
    aberta: 'status-badge status-active',
    andamento: 'status-badge status-pending',
    fechada: 'status-badge status-inactive',
    cancelada: 'status-badge bg-slate-700 text-slate-300',
    analisado: 'status-badge bg-blue-900/50 text-blue-300',
    entrevistado: 'status-badge status-pending',
    reprovado: 'status-badge status-inactive',
  }

  return (
    <span className={styles[status.toLowerCase()] || 'status-badge bg-slate-700 text-slate-300'}>
      {status}
    </span>
  )
}
