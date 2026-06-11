import CrudModule from "@/components/CrudModule"
import { proveedoresService } from "@/services/crudService"

export default function ProveedoresPage() {
  return (
    <CrudModule
      title="Proveedores"
      description="Gestion de proveedores de insumos."
      service={proveedoresService}
      searchKeys={["nombre", "contacto", "email"]}
      columns={[
        { key: "nombre", label: "Proveedor" },
        { key: "contacto", label: "Contacto" },
        { key: "telefono", label: "Telefono" },
        { key: "email", label: "Correo" },
      ]}
      fields={[
        { name: "nombre", label: "Nombre del proveedor", required: true, span: 2 },
        { name: "contacto", label: "Persona de contacto", required: true },
        { name: "telefono", label: "Telefono", required: true },
        { name: "email", label: "Correo", type: "email", required: true, span: 2 },
      ]}
    />
  )
}
