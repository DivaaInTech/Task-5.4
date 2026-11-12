import axios from 'axios'

// `withCredentials: true` makes the browser send the httpOnly auth cookie on
// every request to the API — including requests triggered by a different site.
// That convenience is exactly what leaves this app open to CSRF: there is no
// second proof that a state-changing request actually came from our own UI.
export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true
})

api.interceptors.request.use(async config => {
  const method = (config.method || 'get').toLowerCase()
  const safe = ['get', 'head', 'options'].includes(method)
  const preAuth = ['/auth/login', '/auth/register'].includes(config.url)
  if (!safe && !preAuth) {
    const { data } = await api.get('/csrf-token')
    config.headers = axios.AxiosHeaders.from(config.headers)
    config.headers.set('x-csrf-token', data.csrfToken)
  }
  return config
})
