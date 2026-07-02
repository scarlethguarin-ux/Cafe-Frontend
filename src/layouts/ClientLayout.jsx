import { Outlet, Link, useNavigate } from "react-router-dom"
import { Coffee, ShoppingCart, LayoutDashboard, LogIn, LogOut, Sun, Moon } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

export default function ClientLayout() {
  const { count, clearCart } = useCart()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    clearCart()
    toast("Sesión cerrada correctamente")
    navigate("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Coffee className="h-5 w-5" />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight">Café El Coronado</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-full"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {isAdmin && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Panel</span>
              </Button>
            )}
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-sm text-muted-foreground">Hola, {user.nombre}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Cerrar sesión</span>
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Ingresar</span>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate("/carrito")} className="relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Carrito</span>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                  {count}
                </span>
              )}
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-accent" />
            <span className="font-heading font-semibold">Café El Coronado</span>
          </div>
          <p className="text-sm text-sidebar-foreground/70">
            Cafe de origen cultivado con dedicacion. {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
