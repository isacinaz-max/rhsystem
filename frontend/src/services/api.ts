import axios from 'axios'

const api = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@rh:token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
