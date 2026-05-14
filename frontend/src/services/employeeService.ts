import api from './api'

export const employeeService = {
  list: (params?: any) => api.get('/api/employees', { params }),
  find: (id: number) => api.get(`/api/employees/${id}`),
  create: (data: FormData) => api.post('/api/employees', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData) => {
    data.append('_method', 'PUT')
    return api.post(`/api/employees/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  delete: (id: number) => api.delete(`/api/employees/${id}`),
  export: (params?: any) => api.get('/api/employees/export', { params, responseType: 'blob' }),
  listAll: () => api.get('/api/employees/list-all'),
}
