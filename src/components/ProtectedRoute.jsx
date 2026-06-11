import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

/**
 * Wraps admin routes. Redirects unauthenticated (or non-staff) users to /login.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
