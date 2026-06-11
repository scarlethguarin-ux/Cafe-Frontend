import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Coffee } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(email, password)
      toast(`Bienvenido, ${user.nombre}`)
      const dest = location.state?.from || (user.rol !== "Cliente" ? "/admin" : "/")
      navigate(dest, { replace: true })
    } catch (err) {
      toast(err.message || "Error al iniciar sesion", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Link to="/" className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Coffee className="h-6 w-6" />
          </Link>
          <CardTitle className="text-2xl">Iniciar Sesion</CardTitle>
          <CardDescription>Accede a tu cuenta o al panel administrativo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@cafe.com" />
            </div>
            <div>
              <Label htmlFor="password">Contrasena</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin123" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            No tienes cuenta?{" "}
            <Link to="/registro" className="font-medium text-primary hover:underline">
              Registrate
            </Link>
          </p>
          <p className="mt-4 rounded-md bg-muted p-3 text-center text-xs text-muted-foreground">
            Demo admin: admin@cafe.com / admin123
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
