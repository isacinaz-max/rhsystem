import { Loader2 } from 'lucide-react'

interface LoadingProps {
  text?: string
}

export default function Loading({ text = 'Carregando...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      <p className="text-slate-400">{text}</p>
    </div>
  )
}
