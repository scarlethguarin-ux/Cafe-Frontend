import CrudModule from "@/components/CrudModule"
import { pedidosService } from "@/services/crudService"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/format"

const estadoVariant = {
  Pendiente: "warning",
  Pagado: "success",
  Enviado: "default",
  Cancelado: "destructive",
}

export default function PedidosPage() {
  return (
    <CrudModule
      title="Pedidos"
      description="Ordenes generadas desde la tienda en linea."
      service={pedidosService}
      searchKeys={["cliente", "estado"]}
      columns={[
        { key: "id", label: "# Pedido" },
        { key: "cliente", label: "Cliente" },
        { key: "items", label: "Items" },
        { key: "total", label: "Total", render: (v) => formatCurrency(v) },
        {
          key: "estado",
          label: "Estado",
          render: (v) => <Badge variant={estadoVariant[v] || "secondary"}>{v}</Badge>,
        },
        { key: "fecha", label: "Fecha", render: (v) => formatDate(v) },
      ]}
      fields={[
        { name: "cliente", label: "Cliente", required: true, span: 2 },
        { name: "items", label: "Cantidad de items", type: "number", required: true },
        { name: "total", label: "Total (COP)", type: "number", required: true },
        {
          name: "estado",
          label: "Estado",
          type: "select",
          required: true,
          options: [
            { value: "Pendiente", label: "Pendiente" },
            { value: "Pagado", label: "Pagado" },
            { value: "Enviado", label: "Enviado" },
            { value: "Cancelado", label: "Cancelado" },
          ],
        },
        { name: "fecha", label: "Fecha del pedido", type: "date", required: true },
      ]}
    />
  )
}
