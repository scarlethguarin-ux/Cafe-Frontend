import { useEffect, useState } from "react"
import { 
  Sprout, 
  Package, 
  ClipboardList, 
  Boxes, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Coffee,
  AlertTriangle,
  User
} from "lucide-react"
import {
  lotesService,
  insumosService,
  pedidosService,
  productosFinalesService,
} from "@/services/crudService"
import { formatCurrency } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const estadoVariant = { 
  Pendiente: "warning", 
  Pagado: "success", 
  Enviado: "secondary" 
}

// Helper to get initials for avatar
const getInitials = (name) => {
  if (!name) return "C"
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
}

// Deterministic colors for avatars based on name
const getAvatarBg = (name) => {
  const colors = [
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
  ]
  if (!name) return colors[0]
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return colors[sum % colors.length]
}

export default function DashboardHome() {
  const [data, setData] = useState({ lotes: [], insumos: [], pedidos: [], productos: [] })

  useEffect(() => {
    Promise.all([
      lotesService.getAll(),
      insumosService.getAll(),
      pedidosService.getAll(),
      productosFinalesService.getAll(),
    ]).then(([lotes, insumos, pedidos, productos]) => setData({ lotes, insumos, pedidos, productos }))
  }, [])

  const ventasTotal = data.pedidos.reduce((s, p) => s + (p.total || 0), 0)
  const pendientes = data.pedidos.filter((p) => p.estado === "Pendiente").length
  const stockBajo = data.insumos.filter((i) => i.cantidad_stock < 100).length

  const stats = [
    { 
      label: "Ventas Registradas", 
      value: formatCurrency(ventasTotal), 
      icon: TrendingUp, 
      accent: true,
      trend: "+14.8%", 
      trendUp: true, 
      subtitle: "vs. mes anterior" 
    },
    { 
      label: "Pedidos Pendientes", 
      value: pendientes, 
      icon: ClipboardList,
      trend: `${pendientes > 0 ? "Atención" : "Al día"}`,
      trendUp: false,
      isWarning: pendientes > 0,
      subtitle: "Esperando confirmación" 
    },
    { 
      label: "Lotes en Cultivo", 
      value: data.lotes.length, 
      icon: Sprout,
      trend: "Estable", 
      trendUp: true, 
      subtitle: "Finca El Coronado" 
    },
    { 
      label: "Productos Activos", 
      value: data.productos.length, 
      icon: Boxes,
      trend: "+1 nuevo", 
      trendUp: true, 
      subtitle: "En catálogo público" 
    },
  ]

  // Data for custom SVG chart
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
  const harvestData = [120, 180, 140, 210, 195, 260] // in kg
  const salesData = [75, 120, 95, 160, 150, 210] // scaled for chart height

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/95 to-primary/80 p-6 sm:p-8 text-primary-foreground shadow-lg">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
          <Coffee className="h-64 w-64" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="bg-accent text-accent-foreground border-none font-semibold px-2.5 py-0.5 text-xs">
              Finca El Coronado
            </Badge>
            <span className="text-xs text-primary-foreground/75 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {new Date().toLocaleDateString("es-CO", { dateStyle: "long" })}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            ¡Hola, Administrador!
          </h1>
          <p className="max-w-xl text-sm sm:text-base leading-relaxed text-primary-foreground/90 font-light">
            Bienvenido al panel central de Café El Coronado. Aquí tienes un desglose del rendimiento del cultivo y los pedidos procesados en la plataforma.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className={`overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border-border/80 ${s.accent ? "border-accent/40" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  s.accent ? "bg-accent/15 text-accent" : "bg-secondary text-secondary-foreground"
                }`}>
                  <s.icon className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <p className="font-serif text-3xl font-bold tracking-tight">{s.value}</p>
                <div className="flex items-center gap-1.5 text-xs">
                  {s.trend && (
                    <span className={`inline-flex items-center font-medium ${
                      s.isWarning 
                        ? "text-amber-600 dark:text-amber-400"
                        : s.trendUp 
                          ? "text-emerald-600 dark:text-emerald-400" 
                          : "text-muted-foreground"
                    }`}>
                      {s.trendUp && <ArrowUpRight className="h-3 w-3" />}
                      {!s.trendUp && !s.isWarning && <ArrowDownRight className="h-3 w-3" />}
                      {s.trend}
                    </span>
                  )}
                  <span className="text-muted-foreground font-light">{s.subtitle}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom interactive SVG Chart */}
      <Card className="border-border/80 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Rendimiento Operacional
            </CardTitle>
            <CardDescription>Visualización semestral de cosecha de lotes (kg) y ventas realizadas</CardDescription>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-accent" /> Cosecha (kg)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-primary" /> Ventas
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="relative w-full h-[220px]">
            {/* SVG Graph */}
            <svg viewBox="0 0 600 220" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradientHarvest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent, #c18c5d)" stopOpacity="0.3" />
                  <stop offset="95%" stopColor="var(--color-accent, #c18c5d)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradientSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary, #3e2723)" stopOpacity="0.2" />
                  <stop offset="95%" stopColor="var(--color-primary, #3e2723)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3,3" />
              <line x1="40" y1="70" x2="580" y2="70" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3,3" />
              <line x1="40" y1="120" x2="580" y2="120" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3,3" />
              <line x1="40" y1="170" x2="580" y2="170" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3,3" />

              {/* Harvest Area and Line */}
              <path
                d={`M 40 ${180 - harvestData[0] * 0.5} L 148 ${180 - harvestData[1] * 0.5} L 256 ${180 - harvestData[2] * 0.5} L 364 ${180 - harvestData[3] * 0.5} L 472 ${180 - harvestData[4] * 0.5} L 580 ${180 - harvestData[5] * 0.5} L 580 180 L 40 180 Z`}
                fill="url(#gradientHarvest)"
              />
              <path
                d={`M 40 ${180 - harvestData[0] * 0.5} L 148 ${180 - harvestData[1] * 0.5} L 256 ${180 - harvestData[2] * 0.5} L 364 ${180 - harvestData[3] * 0.5} L 472 ${180 - harvestData[4] * 0.5} L 580 ${180 - harvestData[5] * 0.5}`}
                fill="none"
                stroke="var(--color-accent, #c18c5d)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Sales Area and Line */}
              <path
                d={`M 40 ${180 - salesData[0] * 0.6} L 148 ${180 - salesData[1] * 0.6} L 256 ${180 - salesData[2] * 0.6} L 364 ${180 - salesData[3] * 0.6} L 472 ${180 - salesData[4] * 0.6} L 580 ${180 - salesData[5] * 0.6} L 580 180 L 40 180 Z`}
                fill="url(#gradientSales)"
              />
              <path
                d={`M 40 ${180 - salesData[0] * 0.6} L 148 ${180 - salesData[1] * 0.6} L 256 ${180 - salesData[2] * 0.6} L 364 ${180 - salesData[3] * 0.6} L 472 ${180 - salesData[4] * 0.6} L 580 ${180 - salesData[5] * 0.6}`}
                fill="none"
                stroke="var(--color-primary, #3e2723)"
                strokeWidth="2.5"
                strokeDasharray="1"
                strokeLinecap="round"
              />

              {/* Node Circles (Harvest) */}
              {harvestData.map((val, idx) => (
                <circle
                  key={`h-${idx}`}
                  cx={40 + idx * 108}
                  cy={180 - val * 0.5}
                  r="4"
                  fill="var(--color-accent, #c18c5d)"
                  stroke="white"
                  strokeWidth="1.5"
                  className="transition-all duration-200 hover:r-6 cursor-pointer"
                />
              ))}

              {/* Node Circles (Sales) */}
              {salesData.map((val, idx) => (
                <circle
                  key={`s-${idx}`}
                  cx={40 + idx * 108}
                  cy={180 - val * 0.6}
                  r="3.5"
                  fill="var(--color-primary, #3e2723)"
                  stroke="white"
                  strokeWidth="1.5"
                  className="transition-all duration-200 hover:r-5 cursor-pointer"
                />
              ))}

              {/* Bottom Baseline */}
              <line x1="40" y1="180" x2="580" y2="180" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
            </svg>

            {/* Labels overlay */}
            <div className="absolute left-10 right-0 bottom-0 flex justify-between px-2 text-xs text-muted-foreground font-light pt-2">
              {months.map((m) => (
                <span key={m} className="w-[16%] text-center">{m}</span>
              ))}
            </div>
            {/* Y axis labels */}
            <div className="absolute left-0 top-0 h-[180px] flex flex-col justify-between text-[10px] text-muted-foreground font-light text-right pr-2">
              <span>300 kg</span>
              <span>200 kg</span>
              <span>100 kg</span>
              <span>0 kg</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Lotes & Pedidos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Capacidad de Lotes */}
        <Card className="border-border/80 shadow-sm flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-xl font-bold flex items-center gap-2">
                <Sprout className="h-5 w-5 text-accent" />
                Capacidad de Lotes
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {data.lotes.length} lotes registrados
              </Badge>
            </div>
            <CardDescription>Ocupación y capacidad de almacenamiento en tiempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 flex-1">
            {data.lotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground space-y-2">
                <Sprout className="h-10 w-10 stroke-1 text-muted-foreground/60" />
                <p className="text-sm">No hay lotes registrados.</p>
              </div>
            ) : (
              data.lotes.map((lote) => {
                const pct = Math.round((lote.capacidad_actual / lote.capacidad_maxima) * 100) || 0
                // Determine capacity badge
                let statusBadge = { text: "Bajo", variant: "secondary" }
                if (pct > 85) {
                  statusBadge = { text: "Límite", variant: "destructive" }
                } else if (pct >= 50) {
                  statusBadge = { text: "Óptimo", variant: "success" }
                }
                
                return (
                  <div key={lote.id} className="space-y-1.5 p-3 rounded-xl hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{lote.nombre}</span>
                        <span className="text-xs text-muted-foreground font-light">({lote.ubicacion || "Finca"})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                          {lote.capacidad_actual} / {lote.capacidad_maxima} kg
                        </span>
                        <Badge variant={statusBadge.variant} className="text-[10px] px-1.5 py-0.5 leading-none">{statusBadge.text}</Badge>
                      </div>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct > 85 
                            ? "bg-destructive" 
                            : pct >= 50 
                              ? "bg-accent" 
                              : "bg-primary"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Pedidos Recientes */}
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-xl font-bold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-accent" />
                Pedidos Recientes
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                Últimos 5
              </Badge>
            </div>
            <CardDescription>Monitoreo de pedidos y transacciones recientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.pedidos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground space-y-2">
                <ClipboardList className="h-10 w-10 stroke-1 text-muted-foreground/60" />
                <p className="text-sm">No hay pedidos registrados.</p>
              </div>
            ) : (
              data.pedidos.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/50">
                  <div className="flex items-center gap-3">
                    {/* User initials avatar */}
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarBg(p.cliente)}`}>
                      {getInitials(p.cliente)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{p.cliente}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-light">
                        <Calendar className="h-3 w-3 text-muted-foreground/75" /> {p.fecha}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={estadoVariant[p.estado] || "secondary"} className="text-[10px] px-2 py-0.5">
                      {p.estado}
                    </Badge>
                    <span className="font-serif font-bold text-sm text-primary">{formatCurrency(p.total)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {stockBajo > 0 && (
        <div className="flex items-start gap-4 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30 p-5 text-amber-900 dark:text-amber-300 shadow-sm animate-pulse">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 min-w-0 flex-1">
            <h4 className="font-semibold text-sm">Alerta de Insumos Críticos</h4>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
              Hay **{stockBajo} insumos** con niveles de stock inferiores al límite óptimo de seguridad (100 unidades). 
              Es necesario revisar las compras de insumos para evitar retrasos en el empaquetado de café.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
