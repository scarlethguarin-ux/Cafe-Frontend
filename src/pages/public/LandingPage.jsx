import { useEffect, useState } from "react"
import { Coffee, Leaf, Award, ShoppingCart } from "lucide-react"
import { productosFinalesService } from "@/services/crudService"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/components/ui/toast"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    productosFinalesService.getAll().then((data) => {
      setProductos(data)
      setLoading(false)
    })
  }, [])

  const handleAdd = (p) => {
    addItem(p)
    toast(`${p.nombre} agregado al carrito`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/cafe-hero.png" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="max-w-2xl">
            <Badge variant="accent" className="mb-4">
              Cosecha de altura
            </Badge>
            <h1 className="font-heading text-balance text-4xl font-bold text-primary-foreground sm:text-6xl">
              Cafe de origen, del grano a tu taza
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-primary-foreground/85">
              Cultivamos, producimos y empacamos cada lote con dedicacion artesanal en las laderas de la montana.
              Descubre nuestra seleccion de cafe premium.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                variant="accent"
                onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}
              >
                Ver catalogo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b bg-secondary/50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-3 sm:px-6">
          {[
            { icon: Leaf, title: "100% Cultivo propio", desc: "Trazabilidad total desde nuestros lotes." },
            { icon: Award, title: "Tueste artesanal", desc: "Perfiles de tueste cuidadosamente seleccionados." },
            { icon: Coffee, title: "Frescura garantizada", desc: "Empacado al instante para conservar el aroma." },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog */}
      <section id="catalogo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl font-bold">Nuestro Catalogo</h2>
          <p className="mt-2 text-muted-foreground">Selecciona tu cafe favorito y recibelo en casa.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((p) => (
              <Card key={p.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={p.imagen || "/placeholder.svg?height=400&width=400&query=coffee bag"}
                    alt={p.nombre}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="font-heading text-lg font-semibold">{p.nombre}</h3>
                    <Badge variant="secondary">{p.tipo}</Badge>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{p.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xl font-bold text-primary">{formatCurrency(p.precio)}</span>
                    <Button size="sm" variant="accent" onClick={() => handleAdd(p)}>
                      <ShoppingCart className="h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
