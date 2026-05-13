import api from './api'

export const timeRecordService = {
  list: (params?: any) => api.get('/api/time-records', { params }),
  find: (id: number) => api.get(`/api/time-records/${id}`),
  clockIn: (data: any) => api.post('/api/time-records/clock-in', data),
  clockOut: (data: any) => api.post('/api/time-records/clock-out', data),
  lunchStart: (data: any) => api.post('/api/time-records/lunch-start', data),
  lunchEnd: (data: any) => api.post('/api/time-records/lunch-end', data),
  report: (params?: any) => api.get('/api/time-records/report', { params }),
}
