import axios from "axios"

// an Base URL of the REST API. Override with VITE_API_URL when deploying.
const API_URL = "https://cafe-backend-18ad.onrender.com/api"

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000, // 15 segundos de timeout para evitar que se quede cargando infinito
})

// Attach JWT token (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cafe_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global response handling (e.g. auto-logout on 401)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cafe_token")
      localStorage.removeItem("cafe_user")
    }
    return Promise.reject(error)
  },
)

export default api
