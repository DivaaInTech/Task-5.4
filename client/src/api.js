import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true
})

// Fetch the CSRF token through the SAME Axios instance as the write request.
// This preserves the adapter used by the test suite (no real network calls).
api.interceptors.request.use(async config => {
  const method = (config.method || 'get').toLowerCase()
  const url = config.url || ''
  const isSafe = ['get', 'head', 'options'].includes(method)
  const isPreAuth = ['/auth/login', '/auth/register'].includes(url)

  if (!isSafe && !isPreAuth) {
    const tokenResponse = await api.get('/csrf-token')
    config.headers = axios.AxiosHeaders.from(config.headers)
    config.headers.set('x-csrf-token', tokenResponse.data.csrfToken)
  }

  return config
})
