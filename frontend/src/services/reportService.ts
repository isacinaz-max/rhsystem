import api from './api'

export const reportService = {
  employees: (params?: any) => api.get('/api/reports/employees', { params, responseType: 'blob' }),
  payroll: (params?: any) => api.get('/api/reports/payroll', { params, responseType: 'blob' }),
  timeRecords: (params?: any) => api.get('/api/reports/time-records', { params, responseType: 'blob' }),
  vacations: (params?: any) => api.get('/api/reports/vacations', { params, responseType: 'blob' }),
  benefits: (params?: any) => api.get('/api/reports/benefits', { params, responseType: 'blob' }),
}
