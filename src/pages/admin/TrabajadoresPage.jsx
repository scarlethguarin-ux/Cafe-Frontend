import CrudModule from "@/components/CrudModule"
import { trabajadoresService } from "@/services/crudService"
import { formatDate } from "@/lib/format"

export default function TrabajadoresPage() {
  return (
    <CrudModule
      title="Trabajadores"
      description="Gestion del recurso humano de la productora."
      service={trabajadoresService}
      searchKeys={["nombre_completo", "cedula", "cargo"]}
      columns={[
        { key: "nombre_completo", label: "Nombre" },
        { key: "cedula", label: "Cedula" },
        { key: "cargo", label: "Cargo" },
        { key: "telefono", label: "Telefono" },
        { key: "fecha_contratacion", label: "Contratacion", render: (v) => formatDate(v) },
      ]}
      fields={[
        { name: "nombre_completo", label: "Nombre completo", required: true, span: 2 },
        { name: "cedula", label: "Cedula", required: true },
        { name: "cargo", label: "Cargo", required: true },
        { name: "telefono", label: "Telefono", required: true },
        { name: "fecha_contratacion", label: "Fecha de contratacion", type: "date", required: true },
      ]}
    />
  )
}
