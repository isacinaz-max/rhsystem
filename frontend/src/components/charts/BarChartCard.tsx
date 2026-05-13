import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../ui/Card'

interface BarChartCardProps {
  title: string
  data: { name: string; value: number }[]
}

export default function BarChartCard({ title, data }: BarChartCardProps) {
  return (
    <Card title={title}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} stroke="#475569" />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} stroke="#475569" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#F8FAFC',
              }}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
