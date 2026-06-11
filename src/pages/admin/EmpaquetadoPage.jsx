import { useEffect, useState } from "react"
import CrudModule from "@/components/CrudModule"
import { empaquetadoService, produccionService, productosFinalesService } from "@/services/crudService"
import { formatDate } from "@/lib/format"

export default function EmpaquetadoPage() {
  const [produccion, setProduccion] = useState([])
  const [productos, setProductos] = useState([])

  useEffect(() => {
    produccionService.getAll().then(setProduccion)
    productosFinalesService.getAll().then(setProductos)
  }, [])

  const produccionLabel = (id) => {
    const p = produccion.find((x) => String(x.id) === String(id))
    return p ? `#${p.id} - ${p.fecha}` : id
  }
  const productoName = (id) => productos.find((p) => String(p.id) === String(id))?.nombre || id

  return (
    <CrudModule
      title="Empaquetado"
      description="Conversion de produccion en productos finales empacados."
      service={empaquetadoService}
      columns={[
        { key: "produccion_id", label: "Produccion", render: (v) => produccionLabel(v) },
        { key: "producto_final_id", label: "Producto final", render: (v) => productoName(v) },
        { key: "cantidad_empaques", label: "Cantidad empaques" },
        { key: "fecha", label: "Fecha", render: (v) => formatDate(v) },
      ]}
      fields={[
        {
          name: "produccion_id",
          label: "Produccion de origen",
          type: "select",
          required: true,
          options: produccion.map((p) => ({ value: p.id, label: `#${p.id} - ${p.fecha}` })),
        },
        {
          name: "producto_final_id",
          label: "Producto final",
          type: "select",
          required: true,
          options: productos.map((p) => ({ value: p.id, label: p.nombre })),
        },
        { name: "cantidad_empaques", label: "Cantidad de empaques", type: "number", required: true },
        { name: "fecha", label: "Fecha de empaquetado", type: "date", required: true },
      ]}
    />
  )
}
