import api from './api'

export const authService = {
  login: (data: { email: string; password: string }) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
  changePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) =>
    api.put('/api/auth/change-password', data),
}
