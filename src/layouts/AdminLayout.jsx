import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import {
  Coffee,
  LayoutDashboard,
  Users,
  UserCog,
  Contact,
  Truck,
  Package,
  ShoppingBasket,
  Sprout,
  Factory,
  Boxes,
  Box,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Store,
  Sun,
  Moon,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navGroups = [
  {
    label: "General",
    items: [{ to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Administracion",
    items: [
      { to: "/admin/usuarios", label: "Usuarios y Roles", icon: UserCog },
      { to: "/admin/trabajadores", label: "Trabajadores", icon: Users },
      { to: "/admin/clientes", label: "Clientes", icon: Contact },
    ],
  },
  {
    label: "Abastecimiento",
    items: [
      { to: "/admin/proveedores", label: "Proveedores", icon: Truck },
      { to: "/admin/insumos", label: "Insumos", icon: Package },
      { to: "/admin/compras-insumos", label: "Compras de Insumos", icon: ShoppingBasket },
    ],
  },
  {
    label: "Produccion Agricola",
    items: [
      { to: "/admin/lotes", label: "Lotes", icon: Sprout },
      { to: "/admin/produccion", label: "Produccion", icon: Factory },
    ],
  },
  {
    label: "Inventario",
    items: [
      { to: "/admin/productos-finales", label: "Productos Finales", icon: Boxes },
      { to: "/admin/empaquetado", label: "Empaquetado", icon: Box },
    ],
  },
  {
    label: "Ventas",
    items: [{ to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList }],
  },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
              <Coffee className="h-5 w-5" />
            </span>
            <span className="font-heading font-bold">Cafe Admin</span>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Cerrar menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <NavLink
            to="/"
            className="mb-1 flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Store className="h-4 w-4" />
            Ver tienda
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Backdrop on mobile */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-full"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="text-right">
              <p className="text-sm font-medium leading-tight">{user?.nombre}</p>
              <p className="text-xs text-muted-foreground">{user?.rol}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground">
              {user?.nombre?.charAt(0) || "A"}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
