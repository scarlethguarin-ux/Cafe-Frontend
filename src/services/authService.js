import api from "./api"

/**
 * Auth service vv -> POST /api/auth/login  &  POST /api/auth/register
 */
export const authService = {
  async login(email, password) {
    try {
      const { data } = await api.post("/auth/login", { email, password })
      // Strip 'Bearer ' if present, as the request interceptor already prepends it
      const token = data.token && data.token.startsWith("Bearer ") ? data.token.slice(7) : data.token
      
      // Map backend user response properties to what frontend expects
      const user = data.user ? {
        id: data.user.id_usuario,
        nombre: data.user.email.split("@")[0],
        email: data.user.email,
        rol: data.user.nombre_rol
      } : null

      return {
        token,
        user
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || "Error al iniciar sesión.")
    }
  },

  async register(payload) {
    try {
      // Backend expects: id_rol, email, password, activo
      const registerPayload = {
        id_rol: 3, // Cliente
        email: payload.email,
        password: payload.password,
        activo: true
      }
      const { data } = await api.post("/auth/register", registerPayload)
      
      // Auto login after successful registration
      return await this.login(payload.email, payload.password)
    } catch (err) {
      throw new Error(err.response?.data?.message || "Error al registrarse.")
    }
  },
}
