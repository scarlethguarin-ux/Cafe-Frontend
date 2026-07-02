import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Coffee, Eye, EyeOff, Sun, Moon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const { register } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await register(form)
      toast(`Cuenta creada, bienvenido ${user.nombre}`)
      navigate("/")
    } catch (err) {
      toast(err.message || "Error al registrarse", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <div className="absolute right-4 top-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-full bg-background/50 backdrop-blur shadow-sm border"
          aria-label="Cambiar tema"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Link to="/" className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Coffee className="h-6 w-6" />
          </Link>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>Registrate para comprar nuestro cafe</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" required value={form.nombre} onChange={set("nombre")} />
            </div>
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input id="email" type="email" required value={form.email} onChange={set("email")} />
            </div>
            <div>
              <Label htmlFor="password">Contrasena</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={set("password")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando..." : "Registrarme"}
            </Button>
          </form>
          <div className="mt-4 flex flex-col gap-2 text-center text-sm text-muted-foreground">
            <Link to="/" className="font-medium text-primary hover:underline">
              Volver al inicio
            </Link>
            <p>
              Ya tienes cuenta?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Inicia sesion
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
