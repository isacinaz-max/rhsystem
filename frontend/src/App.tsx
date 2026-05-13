import { useAuth } from './hooks/useAuth'
import { AppRoutes } from './routes'
import { Loader2 } from 'lucide-react'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  )
}
