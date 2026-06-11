import CrudModule from "@/components/CrudModule"
import { clientesService } from "@/services/crudService"

export default function ClientesPage() {
  return (
    <CrudModule
      title="Clientes"
      description="Directorio de clientes de la productora."
      service={clientesService}
      searchKeys={["nombre", "email", "ciudad"]}
      columns={[
        { key: "nombre", label: "Nombre" },
        { key: "email", label: "Correo" },
        { key: "telefono", label: "Telefono" },
        { key: "ciudad", label: "Ciudad" },
      ]}
      fields={[
        { name: "nombre", label: "Nombre / Razon social", required: true, span: 2 },
        { name: "email", label: "Correo", type: "email", required: true },
        { name: "telefono", label: "Telefono", required: true },
        { name: "ciudad", label: "Ciudad", required: true },
      ]}
    />
  )
}
