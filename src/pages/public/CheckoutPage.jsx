import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle2 } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { pedidosService } from "@/services/crudService"
import { useToast } from "@/components/ui/toast"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", direccion: "" })
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    // Register the order (pedido) and its detalles_pedidos
    await pedidosService.create({
      cliente: form.nombre,
      email: form.email,
      telefono: form.telefono,
      direccion: form.direccion,
      total,
      items: items.reduce((n, i) => n + i.cantidad, 0),
      estado: "Pendiente",
      fecha: new Date().toISOString().slice(0, 10),
      detalles: items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad, precio: i.precio })),
    })
    setSaving(false)
    setDone(true)
    clearCart()
    toast("Pedido registrado correctamente")
  }

  if (items.length === 0 && !done) {
    navigate("/carrito")
    return null
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-600" />
        <h1 className="font-heading text-2xl font-bold">Gracias por tu pedido</h1>
        <p className="mt-2 text-muted-foreground">
          Hemos registrado tu pedido en estado Pendiente. Te contactaremos para coordinar el pago y envio.
        </p>
        <Button className="mt-6" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-heading text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="font-heading text-lg font-semibold">Datos de entrega</h2>
              <div>
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input id="nombre" required value={form.nombre} onChange={set("nombre")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Correo</Label>
                  <Input id="email" type="email" required value={form.email} onChange={set("email")} />
                </div>
                <div>
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input id="telefono" required value={form.telefono} onChange={set("telefono")} />
                </div>
              </div>
              <div>
                <Label htmlFor="direccion">Direccion de envio</Label>
                <Textarea id="direccion" required value={form.direccion} onChange={set("direccion")} />
              </div>
            </CardContent>
          </Card>
        </form>

        <Card className="h-fit">
          <CardContent className="p-6">
            <h2 className="mb-4 font-heading text-lg font-semibold">Tu pedido</h2>
            <div className="space-y-2 text-sm">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {i.cantidad}x {i.nombre}
                  </span>
                  <span>{formatCurrency(i.precio * i.cantidad)}</span>
                </div>
              ))}
            </div>
            <div className="my-4 border-t" />
            <div className="flex justify-between font-heading text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
            <Button className="mt-6 w-full" variant="accent" onClick={handleSubmit} disabled={saving}>
              {saving ? "Procesando..." : "Confirmar pedido"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
