import { createContext, useContext, useState, useCallback } from "react"
import { authService } from "@/services/authService"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cafe_user")
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (email, password) => {
    const { token, user } = await authService.login(email, password)
    localStorage.setItem("cafe_token", token)
    localStorage.setItem("cafe_user", JSON.stringify(user))
    setUser(user)
    return user
  }, [])

  const register = useCallback(async (payload) => {
    const { token, user } = await authService.register(payload)
    localStorage.setItem("cafe_token", token)
    localStorage.setItem("cafe_user", JSON.stringify(user))
    setUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("cafe_token")
    localStorage.removeItem("cafe_user")
    setUser(null)
  }, [])

  const isAuthenticated = !!user
  const isAdmin = user?.rol && user.rol !== "Cliente"

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
