import CrudModule from "@/components/CrudModule"
import { productosFinalesService } from "@/services/crudService"
import { formatCurrency } from "@/lib/format"

export default function ProductosFinalesPage() {
  return (
    <CrudModule
      title="Productos Finales"
      description="Catalogo de cafe terminado disponible para la venta."
      service={productosFinalesService}
      searchKeys={["nombre", "tipo"]}
      columns={[
        {
          key: "imagen",
          label: "Imagen",
          render: (v, row) => (
            <img
              src={v || "/placeholder.svg"}
              alt={row.nombre}
              className="h-10 w-10 rounded-md object-cover"
            />
          ),
        },
        { key: "nombre", label: "Nombre" },
        { key: "tipo", label: "Tipo" },
        { key: "precio", label: "Precio", render: (v) => formatCurrency(v) },
        { key: "stock", label: "Stock" },
      ]}
      fields={[
        { name: "nombre", label: "Nombre", required: true, span: 2 },
        {
          name: "tipo",
          label: "Tipo",
          type: "select",
          required: true,
          options: [
            { value: "Molido", label: "Molido" },
            { value: "Grano", label: "Grano" },
          ],
        },
        { name: "precio", label: "Precio (COP)", type: "number", required: true },
        { name: "stock", label: "Stock disponible", type: "number", required: true },
        { name: "imagen", label: "URL de imagen", placeholder: "/cafe-molido-bag.png" },
        { name: "descripcion", label: "Descripcion", type: "textarea" },
      ]}
    />
  )
}
