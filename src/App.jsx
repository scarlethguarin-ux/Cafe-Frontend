import { Routes, Route } from "react-router-dom"
import { ToastProvider } from "@/components/ui/toast"
import ProtectedRoute from "@/components/ProtectedRoute"

// Layouts
import ClientLayout from "@/layouts/ClientLayout"
import AdminLayout from "@/layouts/AdminLayout"

// Public / e-commerce pages
import LandingPage from "@/pages/public/LandingPage"
import CartPage from "@/pages/public/CartPage"
import CheckoutPage from "@/pages/public/CheckoutPage"
import LoginPage from "@/pages/auth/LoginPage"
import RegisterPage from "@/pages/auth/RegisterPage"

// Admin pages
import DashboardHome from "@/pages/admin/DashboardHome"
import UsuariosPage from "@/pages/admin/UsuariosPage"
import TrabajadoresPage from "@/pages/admin/TrabajadoresPage"
import ClientesPage from "@/pages/admin/ClientesPage"
import ProveedoresPage from "@/pages/admin/ProveedoresPage"
import InsumosPage from "@/pages/admin/InsumosPage"
import ComprasInsumosPage from "@/pages/admin/ComprasInsumosPage"
import LotesPage from "@/pages/admin/LotesPage"
import ProduccionPage from "@/pages/admin/ProduccionPage"
import ProductosFinalesPage from "@/pages/admin/ProductosFinalesPage"
import EmpaquetadoPage from "@/pages/admin/EmpaquetadoPage"
import PedidosPage from "@/pages/admin/PedidosPage"
import NotFound from "@/pages/NotFound"

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* Public storefront */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* Protected admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="trabajadores" element={<TrabajadoresPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="proveedores" element={<ProveedoresPage />} />
          <Route path="insumos" element={<InsumosPage />} />
          <Route path="compras-insumos" element={<ComprasInsumosPage />} />
          <Route path="lotes" element={<LotesPage />} />
          <Route path="produccion" element={<ProduccionPage />} />
          <Route path="productos-finales" element={<ProductosFinalesPage />} />
          <Route path="empaquetado" element={<EmpaquetadoPage />} />
          <Route path="pedidos" element={<PedidosPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  )
}
