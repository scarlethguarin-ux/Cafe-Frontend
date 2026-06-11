import { useEffect, useState } from "react"
import CrudModule from "@/components/CrudModule"
import { produccionService, lotesService, trabajadoresService } from "@/services/crudService"
import { formatDate } from "@/lib/format"

export default function ProduccionPage() {
  const [lotes, setLotes] = useState([])
  const [trabajadores, setTrabajadores] = useState([])

  useEffect(() => {
    lotesService.getAll().then(setLotes)
    trabajadoresService.getAll().then(setTrabajadores)
  }, [])

  const loteName = (id) => lotes.find((l) => String(l.id) === String(id))?.nombre || id
  const trabajadorName = (id) =>
    trabajadores.find((t) => String(t.id) === String(id))?.nombre_completo || id

  return (
    <CrudModule
      title="Produccion Agricola"
      description="Cosechas registradas por lote y trabajador responsable."
      service={produccionService}
      columns={[
        { key: "lote_id", label: "Lote", render: (v) => loteName(v) },
        { key: "trabajador_id", label: "Trabajador", render: (v) => trabajadorName(v) },
        { key: "cantidad_producida", label: "Cantidad (Kg)" },
        { key: "fecha", label: "Fecha", render: (v) => formatDate(v) },
      ]}
      fields={[
        {
          name: "lote_id",
          label: "Lote",
          type: "select",
          required: true,
          options: lotes.map((l) => ({ value: l.id, label: l.nombre })),
        },
        {
          name: "trabajador_id",
          label: "Trabajador",
          type: "select",
          required: true,
          options: trabajadores.map((t) => ({ value: t.id, label: t.nombre_completo })),
        },
        { name: "cantidad_producida", label: "Cantidad producida (Kg)", type: "number", required: true },
        { name: "fecha", label: "Fecha de cosecha", type: "date", required: true },
      ]}
    />
  )
}
