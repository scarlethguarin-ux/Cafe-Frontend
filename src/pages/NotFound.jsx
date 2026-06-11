import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-heading text-6xl font-bold text-primary">404</p>
      <h1 className="mt-2 font-heading text-2xl font-semibold">Pagina no encontrada</h1>
      <p className="mt-2 text-muted-foreground">La pagina que buscas no existe o fue movida.</p>
      <Button className="mt-6" onClick={() => navigate("/")}>
        Volver al inicio
      </Button>
    </div>
  )
}
