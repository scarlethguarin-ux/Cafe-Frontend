import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Coffee, 
  Leaf, 
  Award, 
  ShoppingCart, 
  Target, 
  Eye, 
  ArrowRight, 
  Flame, 
  Bean, 
  Droplet,
  Sun,
  ShieldCheck
} from "lucide-react"
import { productosFinalesService } from "@/services/crudService"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    productosFinalesService.getAll().then((data) => {
      setProductos(data)
      setLoading(false)
    })
  }, [])

  const handleAdd = (p) => {
    if (!isAuthenticated) {
      toast("Debes iniciar sesión para agregar productos al carrito", "error")
      navigate("/login")
      return
    }
    addItem(p)
    toast(`${p.nombre} agregado al carrito`)
  }

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src="/cafe-hero-coronado.png" alt="Finca El Coronado" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32 w-full">
          <div className="max-w-2xl text-left">
            <Badge variant="accent" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
              Origen Premium Colombiano
            </Badge>
            <h1 className="font-serif text-balance text-5xl font-bold text-white sm:text-7xl leading-tight">
              Café El Coronado
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-slate-100/90 font-light">
              Cultivado con pasión artesanal en las alturas de los Andes colombianos. 
              Experimenta el balance perfecto de notas dulces, frutales y un aroma incomparable directo de nuestra finca a tu taza.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                size="lg"
                variant="accent"
                className="font-medium shadow-lg hover:shadow-accent/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explorar Catálogo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 transition-all hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm"
                onClick={() => document.getElementById("historia")?.scrollIntoView({ behavior: "smooth" })}
              >
                Nuestra Historia
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Quick Section */}
      <section className="-mt-32 relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 bg-card/95 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-border">
          {[
            { icon: Leaf, title: "100% Cultivo Ecológico", desc: "Trazabilidad completa y abonos orgánicos en Finca El Coronado." },
            { icon: Award, title: "Tueste Maestro de Origen", desc: "Monitoreo preciso de temperatura para desbloquear notas exquisitas." },
            { icon: Coffee, title: "Frescura Absoluta", desc: "Empacado al vacío inmediatamente después del tueste para retener el aroma." },
          ].map((f, idx) => (
            <div key={idx} className="flex gap-4 items-start p-2">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <f.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nuestra Historia / El Cultivo */}
      <section id="historia" className="mx-auto max-w-7xl px-4 sm:px-6 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="secondary" className="px-3 py-1 font-semibold uppercase text-xs tracking-wider text-accent bg-accent/10">
              Nuestra Alma y Legado
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Finca El Coronado
            </h2>
            <div className="w-16 h-1 bg-accent rounded-full" />
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Ubicada en el corazón geográfico de Colombia, en laderas montañosas bendecidas por un microclima único, la **Finca El Coronado** nació como un sueño familiar dedicado a preservar la tradición más pura del café colombiano de altura. 
            </p>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Nuestra historia está arraigada en el respeto por la tierra. Cada cafeto es plantado bajo sombra regulada y alimentado por manantiales locales de agua pura. No es solo un cultivo, es un estilo de vida que respeta los tiempos de la naturaleza para lograr que cada grano desarrolle un perfil de sabor complejo y una acidez balanceada que define al verdadero café premium.
            </p>
            <div className="flex gap-6 pt-2">
              <div>
                <p className="font-serif text-3xl font-bold text-primary">1,750m</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Altitud Promedio</p>
              </div>
              <div className="border-l border-border pl-6">
                <p className="font-serif text-3xl font-bold text-primary">100%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Arábica Recolectado</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl border border-border">
              <img 
                src="/el-cultivo.png" 
                alt="Cultivo de café en Finca El Coronado" 
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 text-white z-10">
                <p className="text-sm font-semibold tracking-wider uppercase text-accent">Laderas de los Andes</p>
                <p className="font-serif text-xl font-bold mt-1">Nuestros Cafetos de Altura</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="bg-secondary/40 border-y py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mision */}
            <Card className="bg-card/80 border-border/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-inner">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">Nuestra Misión</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Producir y comercializar el café de especialidad más excelso de Colombia, cultivado bajo estándares de sostenibilidad ambiental y responsabilidad social en la Finca El Coronado. Buscamos honrar el legado cafetalero colombiano, garantizando una trazabilidad del 100% desde el árbol hasta la taza, y ofreciendo a los amantes del café una experiencia sensorial inigualable con frescura absoluta.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="bg-card/80 border-border/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-inner">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">Nuestra Visión</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Consolidar a Café El Coronado para el año 2030 como la marca de café de origen colombiana preferida a nivel nacional y reconocida internacionalmente por su excelencia, pureza y compromiso con el medio ambiente. Aspiramos a ser un referente de innovación en el beneficio artesanal del café, promoviendo el desarrollo sustentable de nuestra comunidad agrícola.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* El Proceso de Cultivo y Preparación */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 lg:order-last space-y-6">
            <Badge variant="secondary" className="px-3 py-1 font-semibold uppercase text-xs tracking-wider text-accent bg-accent/10">
              El Arte de la Preparación
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Proceso y Preparación
            </h2>
            <div className="w-16 h-1 bg-accent rounded-full" />
            
            {/* Timeline */}
            <div className="space-y-6">
              {[
                { 
                  step: "01", 
                  title: "Recolección Selectiva y Manual", 
                  desc: "Nuestros recolectores seleccionan únicamente las cerezas en su estado óptimo de madurez (color rojo cereza profundo), evitando granos verdes o sobremaduros." 
                },
                { 
                  step: "02", 
                  title: "Despulpado y Fermentación Controlada", 
                  desc: "Despulpamos el café el mismo día de su cosecha y lo fermentamos en tanques herméticos entre 16 y 24 horas para maximizar sus notas de panela, chocolate y frutas rojas." 
                },
                { 
                  step: "03", 
                  title: "Lavado con Agua de Manantial y Secado al Sol", 
                  desc: "Lavamos los granos con agua pura de nuestra propia finca y los secamos lentamente al sol en camas africanas elevados bajo ventilación andina." 
                },
                { 
                  step: "04", 
                  title: "Tueste Artesanal Personalizado", 
                  desc: "Sometemos el café pergamino seco seleccionado a curvas de tueste específicas para el tipo de grano, asegurando el desarrollo ideal de sus aceites esenciales aromáticos." 
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span className="font-serif text-2xl font-bold text-accent/40 mt-0.5">{item.step}</span>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl border border-border">
              <img 
                src="/la-preparacion.png" 
                alt="Preparación de café de especialidad" 
                className="w-full h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 text-white z-10">
                <p className="text-sm font-semibold tracking-wider uppercase text-accent">Preparación y Tueste</p>
                <p className="font-serif text-xl font-bold mt-1">Tradición en Cada Gota</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog / Ecommerce */}
      <section id="catalogo" className="mx-auto max-w-7xl px-4 sm:px-6 scroll-mt-20">
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="secondary" className="px-3 py-1 font-semibold uppercase text-xs tracking-wider text-accent bg-accent/10">
            Nuestra Cosecha Exclusiva
          </Badge>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground">Nuestro Catálogo</h2>
          <p className="text-muted-foreground">Selecciona tu presentación preferida de Café El Coronado y recíbela fresca directamente de nuestra tostadora.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((p) => (
              <Card key={p.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border/80 flex flex-col h-full bg-card">
                <div className="aspect-square overflow-hidden bg-muted relative group">
                  <img
                    src={p.imagen || "/placeholder.svg?height=400&width=400&query=coffee bag"}
                    alt={p.nombre}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm shadow-sm">{p.tipo}</Badge>
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-1 justify-between">
                  <div className="space-y-2 mb-6">
                    <h3 className="font-serif text-xl font-bold text-foreground">{p.nombre}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{p.descripcion}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-serif text-2xl font-bold text-primary">{formatCurrency(p.precio)}</span>
                    <Button 
                      size="sm" 
                      variant="accent" 
                      onClick={() => handleAdd(p)}
                      className="font-medium flex items-center gap-2 cursor-pointer transition-transform duration-200 active:scale-95 shadow-sm"
                    >
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
