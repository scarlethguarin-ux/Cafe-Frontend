import CrudModule from "@/components/CrudModule"
import { lotesService } from "@/services/crudService"

export default function LotesPage() {
  return (
    <CrudModule
      title="Lotes"
      description="Gestion agricola de los lotes de cultivo y su capacidad."
      service={lotesService}
      searchKeys={["nombre", "ubicacion"]}
      columns={[
        { key: "nombre", label: "Lote" },
        { key: "ubicacion", label: "Ubicacion" },
        {
          key: "capacidad_actual",
          label: "Capacidad",
          render: (v, row) => {
            const pct = Math.round((v / row.capacidad_maxima) * 100)
            return (
              <div className="flex items-center gap-3">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${pct > 85 ? "bg-destructive" : "bg-accent"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {v}/{row.capacidad_maxima} kg
                </span>
              </div>
            )
          },
        },
      ]}
      fields={[
        { name: "nombre", label: "Nombre del lote", required: true, span: 2 },
        { name: "ubicacion", label: "Ubicacion", required: true, span: 2 },
        { name: "capacidad_maxima", label: "Capacidad maxima (kg)", type: "number", required: true },
        { name: "capacidad_actual", label: "Capacidad actual (kg)", type: "number", required: true },
      ]}
    />
  )
}
