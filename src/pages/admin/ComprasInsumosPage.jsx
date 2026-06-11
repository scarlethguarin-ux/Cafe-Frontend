import { useEffect, useState } from "react"
import CrudModule from "@/components/CrudModule"
import {
  comprasInsumosService,
  proveedoresService,
  insumosService,
} from "@/services/crudService"
import { formatCurrency, formatDate } from "@/lib/format"

export default function ComprasInsumosPage() {
  const [proveedores, setProveedores] = useState([])
  const [insumos, setInsumos] = useState([])

  useEffect(() => {
    proveedoresService.getAll().then(setProveedores)
    insumosService.getAll().then(setInsumos)
  }, [])

  const proveedorName = (id) => proveedores.find((p) => String(p.id) === String(id))?.nombre || id
  const insumoName = (id) => insumos.find((i) => String(i.id) === String(id))?.nombre || id

  return (
    <CrudModule
      title="Compras de Insumos"
      description="Registro de ingreso de nuevo stock desde proveedores."
      service={comprasInsumosService}
      searchKeys={[]}
      columns={[
        { key: "proveedor_id", label: "Proveedor", render: (v) => proveedorName(v) },
        { key: "insumo_id", label: "Insumo", render: (v) => insumoName(v) },
        { key: "cantidad", label: "Cantidad" },
        { key: "costo_total", label: "Costo total", render: (v) => formatCurrency(v) },
        { key: "fecha", label: "Fecha", render: (v) => formatDate(v) },
      ]}
      fields={[
        {
          name: "proveedor_id",
          label: "Proveedor",
          type: "select",
          required: true,
          options: proveedores.map((p) => ({ value: p.id, label: p.nombre })),
        },
        {
          name: "insumo_id",
          label: "Insumo",
          type: "select",
          required: true,
          options: insumos.map((i) => ({ value: i.id, label: i.nombre })),
        },
        { name: "cantidad", label: "Cantidad", type: "number", required: true },
        { name: "costo_total", label: "Costo total", type: "number", required: true },
        { name: "fecha", label: "Fecha de compra", type: "date", required: true },
      ]}
    />
  )
}
