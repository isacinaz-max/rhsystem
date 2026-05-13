import api from './api'

export const dashboardService = {
  getIndicators: () => api.get('/api/dashboard/indicators'),
  getCharts: () => api.get('/api/dashboard/charts'),
}
