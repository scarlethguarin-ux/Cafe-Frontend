import CrudModule from "@/components/CrudModule"
import { insumosService } from "@/services/crudService"
import { Badge } from "@/components/ui/badge"

export default function InsumosPage() {
  return (
    <CrudModule
      title="Insumos"
      description="Inventario de insumos para produccion y empaque."
      service={insumosService}
      searchKeys={["nombre", "categoria"]}
      columns={[
        { key: "nombre", label: "Insumo" },
        { key: "categoria", label: "Categoria" },
        { key: "unidad_medida", label: "Unidad" },
        {
          key: "cantidad_stock",
          label: "Stock",
          render: (v) => (
            <Badge variant={v < 100 ? "warning" : "secondary"}>{v}</Badge>
          ),
        },
      ]}
      fields={[
        { name: "nombre", label: "Nombre del insumo", required: true, span: 2 },
        {
          name: "categoria",
          label: "Categoria",
          type: "select",
          required: true,
          options: [
            { value: "Agroquimico", label: "Agroquimico" },
            { value: "Empaque", label: "Empaque" },
            { value: "Herramienta", label: "Herramienta" },
            { value: "Otro", label: "Otro" },
          ],
        },
        {
          name: "unidad_medida",
          label: "Unidad de medida",
          type: "select",
          required: true,
          options: [
            { value: "Kg", label: "Kilogramo" },
            { value: "Litro", label: "Litro" },
            { value: "Unidad", label: "Unidad" },
          ],
        },
        { name: "cantidad_stock", label: "Cantidad en stock", type: "number", required: true },
      ]}
    />
  )
}
