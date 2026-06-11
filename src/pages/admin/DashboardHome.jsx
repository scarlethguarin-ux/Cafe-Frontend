import { useEffect, useState } from "react"
import { Sprout, Package, ClipboardList, Boxes, TrendingUp } from "lucide-react"
import {
  lotesService,
  insumosService,
  pedidosService,
  productosFinalesService,
} from "@/services/crudService"
import { formatCurrency } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const estadoVariant = { Pendiente: "warning", Pagado: "success", Enviado: "secondary" }

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
    { label: "Ventas registradas", value: formatCurrency(ventasTotal), icon: TrendingUp, accent: true },
    { label: "Pedidos pendientes", value: pendientes, icon: ClipboardList },
    { label: "Lotes activos", value: data.lotes.length, icon: Sprout },
    { label: "Productos en catalogo", value: data.productos.length, icon: Boxes },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen general de la operacion de la productora.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className={s.accent ? "border-accent" : ""}>
            <CardContent className="flex items-center gap-4 p-5">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                  s.accent ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="font-heading text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Capacidad de lotes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-accent" />
              Capacidad de Lotes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.lotes.map((lote) => {
              const pct = Math.round((lote.capacidad_actual / lote.capacidad_maxima) * 100)
              return (
                <div key={lote.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{lote.nombre}</span>
                    <span className="text-muted-foreground">
                      {lote.capacidad_actual} / {lote.capacidad_maxima} kg
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${pct > 85 ? "bg-destructive" : "bg-accent"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Pedidos recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-accent" />
              Pedidos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.pedidos.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{p.cliente}</p>
                  <p className="text-xs text-muted-foreground">{p.fecha}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={estadoVariant[p.estado] || "secondary"}>{p.estado}</Badge>
                  <span className="font-medium">{formatCurrency(p.total)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {stockBajo > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="flex items-center gap-3 p-4 text-amber-900">
            <Package className="h-5 w-5" />
            <p className="text-sm font-medium">
              {stockBajo} insumo(s) con stock bajo (menos de 100 unidades). Revisa el modulo de Insumos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
