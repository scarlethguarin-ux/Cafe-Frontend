import CrudModule from "@/components/CrudModule"
import { usuariosService } from "@/services/crudService"
import { Badge } from "@/components/ui/badge"

export default function UsuariosPage() {
  return (
    <CrudModule
      title="Usuarios y Roles"
      description="Administra las cuentas del personal y sus niveles de acceso."
      service={usuariosService}
      searchKeys={["nombre", "email", "rol"]}
      columns={[
        { key: "nombre", label: "Nombre" },
        { key: "email", label: "Correo" },
        { key: "rol", label: "Rol" },
        {
          key: "estado",
          label: "Estado",
          render: (v) => <Badge variant={v === "Activo" ? "success" : "outline"}>{v}</Badge>,
        },
      ]}
      fields={[
        { name: "nombre", label: "Nombre completo", required: true },
        { name: "email", label: "Correo", type: "email", required: true },
        {
          name: "rol",
          label: "Rol",
          type: "select",
          required: true,
          options: [
            { value: "Administrador", label: "Administrador" },
            { value: "Vendedor", label: "Vendedor" },
            { value: "Bodeguero", label: "Bodeguero" },
            { value: "Supervisor", label: "Supervisor" },
          ],
        },
        {
          name: "estado",
          label: "Estado",
          type: "select",
          required: true,
          options: [
            { value: "Activo", label: "Activo" },
            { value: "Inactivo", label: "Inactivo" },
          ],
        },
      ]}
    />
  )
}
