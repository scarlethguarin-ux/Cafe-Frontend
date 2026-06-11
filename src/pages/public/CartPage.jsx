import { Link, useNavigate } from "react-router-dom"
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
        </span>
        <h1 className="font-heading text-2xl font-bold">Tu carrito esta vacio</h1>
        <p className="mt-2 text-muted-foreground">Explora nuestro catalogo y agrega tu cafe favorito.</p>
        <Button className="mt-6" onClick={() => navigate("/")}>
          Ir al catalogo
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-heading text-3xl font-bold">Carrito de Compras</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                  <img src={item.imagen || "/placeholder.svg"} alt={item.nombre} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-heading font-semibold">{item.nombre}</h3>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.precio)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, item.cantidad - 1)}>
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.cantidad}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, item.cantidad + 1)}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="w-24 text-right font-semibold">{formatCurrency(item.precio * item.cantidad)}</div>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardContent className="p-6">
            <h2 className="mb-4 font-heading text-lg font-semibold">Resumen</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envio</span>
                <span>Gratis</span>
              </div>
            </div>
            <div className="my-4 border-t" />
            <div className="flex justify-between font-heading text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
            <Button className="mt-6 w-full" variant="accent" onClick={() => navigate("/checkout")}>
              Finalizar compra
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Link to="/" className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground">
              Seguir comprando
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
