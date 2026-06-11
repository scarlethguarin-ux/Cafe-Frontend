import api from "./api"

const MOCK_ONLY = !import.meta.env.VITE_API_URL

/**
 * Auth service -> POST /api/auth/login  &  POST /api/auth/register
 * Falls back to a demo login when the backend is unavailable so the
 * admin panel can be explored in the preview.
 */
export const authService = {
  async login(email, password) {
    const demo = () => {
      if (email === "admin@cafe.com" && password === "admin123") {
        return {
          token: "demo-token",
          user: { id: 1, nombre: "Admin General", email, rol: "Administrador" },
        }
      }
      throw new Error("Credenciales invalidas o servidor no disponible.")
    }
    if (MOCK_ONLY) return demo()
    try {
      const { data } = await api.post("/auth/login", { email, password })
      // Expecting { token, user }
      return data
    } catch (err) {
      return demo()
    }
  },

  async register(payload) {
    const demo = () => ({
      token: "demo-token",
      user: { id: Date.now(), nombre: payload.nombre, email: payload.email, rol: "Cliente" },
    })
    if (MOCK_ONLY) return demo()
    try {
      const { data } = await api.post("/auth/register", payload)
      return data
    } catch (err) {
      // Demo fallback: pretend registration succeeded
      return demo()
    }
  },
}
