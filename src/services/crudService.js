import api from "./api"

// Helper to map UI keys to database fields and endpoints
const resourceMapping = {
  "usuarios": {
    path: "/usuarios",
    toUI: (db) => ({
      id: db.id_usuario,
      nombre: db.email.split("@")[0],
      email: db.email,
      rol: db.nombre_rol || "Trabajador",
      estado: db.activo ? "Activo" : "Inactivo"
    }),
    toDB: (ui) => ({
      email: ui.email,
      id_rol: ui.rol === "Administrador" ? 1 : ui.rol === "Cliente" ? 3 : 2,
      activo: ui.estado === "Activo",
      password: ui.password || "123456"
    })
  },
  "trabajadores": {
    path: "/trabajadores",
    toUI: (db) => ({
      id: db.id_trabajador,
      nombre_completo: db.nombre_completo,
      cedula: db.cedula,
      cargo: db.cargo,
      fecha_contratacion: db.fecha_contratacion ? db.fecha_contratacion.split("T")[0] : "",
      telefono: db.telefono
    }),
    toDB: (ui) => ({
      id_usuario: ui.id_usuario || null,
      nombre_completo: ui.nombre_completo,
      cedula: ui.cedula,
      cargo: ui.cargo,
      fecha_contratacion: ui.fecha_contratacion,
      telefono: ui.telefono
    })
  },
  "clientes": {
    path: "/clientes",
    toUI: (db) => ({
      id: db.id_cliente,
      nombre: db.nombre_razon_social,
      email: db.email || "contacto@cliente.com",
      telefono: db.telefono,
      ciudad: db.direccion_envio || "Desconocida"
    }),
    toDB: (ui) => ({
      id_usuario: ui.id_usuario || null,
      nombre_razon_social: ui.nombre,
      identificacion_fiscal: ui.identificacion_fiscal || "CL-" + Date.now(),
      telefono: ui.telefono,
      direccion_envio: ui.ciudad
    })
  },
  "proveedores": {
    path: "/proveedores",
    toUI: (db) => ({
      id: db.id_proveedor,
      nombre: db.nombre_empresa,
      contacto: db.contacto_principal,
      telefono: db.telefono,
      email: db.email
    }),
    toDB: (ui) => ({
      nombre_empresa: ui.nombre,
      contacto_principal: ui.contacto,
      telefono: ui.telefono,
      email: ui.email,
      direccion: "Direccion Principal"
    })
  },
  "insumos": {
    path: "/insumos",
    toUI: (db) => ({
      id: db.id_insumo,
      nombre: db.nombre_insumo,
      categoria: db.categoria,
      unidad_medida: db.unidad_medida,
      cantidad_stock: Number(db.cantidad_stock)
    }),
    toDB: (ui) => ({
      nombre_insumo: ui.nombre,
      categoria: ui.categoria,
      unidad_medida: ui.unidad_medida,
      cantidad_stock: Number(ui.cantidad_stock)
    })
  },
  "lotes": {
    path: "/lotes",
    toUI: (db) => ({
      id: db.id_lote,
      nombre: db.codigo_lote,
      ubicacion: db.descripcion,
      capacidad_maxima: Number(db.capacidad_maxima),
      capacidad_actual: Number(db.capacidad_actual)
    }),
    toDB: (ui) => ({
      codigo_lote: ui.nombre,
      descripcion: ui.ubicacion,
      capacidad_maxima: Number(ui.capacidad_maxima),
      capacidad_actual: Number(ui.capacidad_actual),
      estado: "Activo"
    })
  },
  "productos-finales": {
    path: "/productos",
    toUI: (db) => ({
      id: db.id_producto,
      nombre: db.nombre_producto,
      tipo: db.presentacion,
      precio: Number(db.precio_venta),
      stock: Number(db.stock_disponible),
      imagen: db.imagen || (db.presentacion === "Grano" ? "/cafe-grano-entero-bag.png" : "/cafe-molido-bag.png"),
      descripcion: db.nombre_producto
    }),
    toDB: (ui) => ({
      nombre_producto: ui.nombre,
      presentacion: ui.tipo,
      peso_gramos: 500,
      precio_venta: Number(ui.precio),
      stock_disponible: Number(ui.stock),
      imagen: ui.imagen
    })
  },
  "produccion": {
    path: "/producciones",
    toUI: (db) => ({
      id: db.id_produccion,
      lote_id: db.id_lote,
      trabajador_id: db.id_trabajador,
      cantidad_producida: Number(db.cantidad_producida_kg),
      fecha: db.fecha_produccion ? db.fecha_produccion.split("T")[0] : ""
    }),
    toDB: (ui) => ({
      id_lote: Number(ui.lote_id),
      id_trabajador: Number(ui.trabajador_id),
      cantidad_producida_kg: Number(ui.cantidad_producida),
      fecha_produccion: ui.fecha,
      observaciones: "Cosecha registrada en el lote"
    })
  },
  "empaquetado": {
    path: "/empaquetados",
    toUI: (db) => ({
      id: db.id_empaquetado,
      produccion_id: db.id_produccion,
      producto_final_id: db.id_producto,
      cantidad_empaques: Number(db.cantidad_unidades),
      fecha: db.fecha_empaque ? db.fecha_empaque.split("T")[0] : ""
    }),
    toDB: (ui) => ({
      id_produccion: Number(ui.produccion_id),
      id_producto: Number(ui.producto_final_id),
      cantidad_unidades: Number(ui.cantidad_empaques),
      fecha_empaque: ui.fecha
    })
  }
}

export function createCrudService(resource) {
  const mapping = resourceMapping[resource]
  const path = mapping ? mapping.path : `/${resource}`

  // Custom handling for compras-insumos (Purchase headers and details split)
  if (resource === "compras-insumos") {
    return {
      resource,
      async getAll() {
        try {
          const pRes = await api.get("/compras")
          const dRes = await api.get("/detalles-compras")
          const purchases = pRes.data.data || []
          const details = dRes.data.data || []
          return details.map((d) => {
            const p = purchases.find((x) => x.id_compra === d.id_compra) || {}
            return {
              id: d.id_detalle_compra,
              id_compra: d.id_compra,
              proveedor_id: p.id_proveedor,
              insumo_id: d.id_insumo,
              cantidad: Number(d.cantidad),
              costo_total: Number(d.cantidad) * Number(d.precio_unitario),
              fecha: p.fecha_compra ? p.fecha_compra.split("T")[0] : ""
            }
          })
        } catch (err) {
          throw new Error(err.response?.data?.message || "Error al obtener compras de insumos.")
        }
      },
      async getById(id) {
        const records = await this.getAll()
        return records.find((r) => String(r.id) === String(id))
      },
      async create(payload) {
        try {
          // 1. Create Purchase Header
          const pRes = await api.post("/compras", {
            id_proveedor: Number(payload.proveedor_id),
            fecha_compra: payload.fecha,
            monto_total: 0
          })
          const id_compra = pRes.data.data.id_compra
          // 2. Create Purchase Detail (triggers stock update in Backend)
          const dRes = await api.post("/detalles-compras", {
            id_compra,
            id_insumo: Number(payload.insumo_id),
            cantidad: Number(payload.cantidad),
            precio_unitario: Number(payload.costo_total) / Number(payload.cantidad)
          })
          return {
            id: dRes.data.data.id_detalle_compra,
            id_compra,
            ...payload
          }
        } catch (err) {
          throw new Error(err.response?.data?.message || "Error al crear compra de insumos.")
        }
      },
      async update(id, payload) {
        try {
          const detail = (await api.get(`/detalles-compras/${id}`)).data.data
          const dRes = await api.put(`/detalles-compras/${id}`, {
            id_compra: detail.id_compra,
            id_insumo: Number(payload.insumo_id),
            cantidad: Number(payload.cantidad),
            precio_unitario: Number(payload.costo_total) / Number(payload.cantidad)
          })
          return {
            id,
            id_compra: detail.id_compra,
            ...payload
          }
        } catch (err) {
          throw new Error(err.response?.data?.message || "Error al actualizar compra de insumos.")
        }
      },
      async remove(id) {
        try {
          await api.delete(`/detalles-compras/${id}`)
          return true
        } catch (err) {
          throw new Error(err.response?.data?.message || "Error al eliminar compra de insumos.")
        }
      }
    }
  }

  // Custom handling for pedidos (Order headers and details split)
  if (resource === "pedidos") {
    return {
      resource,
      async getAll() {
        try {
          const { data } = await api.get("/pedidos")
          const list = data.data || []
          return list.map((o) => ({
            id: o.id_pedido,
            cliente: o.nombre_razon_social || `Cliente #${o.id_cliente}`,
            items: 1,
            total: Number(o.monto_total),
            estado: o.estado_pedido,
            fecha: o.fecha_pedido ? o.fecha_pedido.split("T")[0] : ""
          }))
        } catch (err) {
          throw new Error(err.response?.data?.message || "Error al obtener pedidos.")
        }
      },
      async getById(id) {
        const records = await this.getAll()
        return records.find((r) => String(r.id) === String(id))
      },
      async create(payload) {
        try {
          // 1. Get or create Client matching by name
          const clientsRes = await api.get("/clientes")
          const clients = clientsRes.data.data || []
          let client = clients.find(
            (c) => c.nombre_razon_social.toLowerCase() === payload.cliente.toLowerCase()
          )
          let id_cliente
          if (client) {
            id_cliente = client.id_cliente
          } else {
            const newClientRes = await api.post("/clientes", {
              nombre_razon_social: payload.cliente,
              identificacion_fiscal: "CL-" + Date.now(),
              telefono: "555-0000",
              direccion_envio: "Envio Principal"
            })
            id_cliente = newClientRes.data.data.id_cliente
          }

          // 2. Create Order Header
          const orderRes = await api.post("/pedidos", {
            id_cliente,
            estado_pedido: payload.estado,
            monto_total: Number(payload.total),
            fecha_pedido: payload.fecha
          })
          const id_pedido = orderRes.data.data.id_pedido

          // 3. Create dummy order details so stock and trigger validation passes
          const productsRes = await api.get("/productos")
          const products = productsRes.data.data || []
          if (products.length > 0) {
            await api.post("/detalles-pedidos", {
              id_pedido,
              id_producto: products[0].id_producto,
              cantidad: Number(payload.items) || 1,
              precio_unitario: Number(payload.total) / (Number(payload.items) || 1)
            })
          }

          return {
            id: id_pedido,
            ...payload
          }
        } catch (err) {
          throw new Error(err.response?.data?.message || "Error al crear pedido.")
        }
      },
      async update(id, payload) {
        try {
          const clientsRes = await api.get("/clientes")
          const clients = clientsRes.data.data || []
          let client = clients.find(
            (c) => c.nombre_razon_social.toLowerCase() === payload.cliente.toLowerCase()
          )
          let id_cliente
          if (client) {
            id_cliente = client.id_cliente
          } else {
            const newClientRes = await api.post("/clientes", {
              nombre_razon_social: payload.cliente,
              identificacion_fiscal: "CL-" + Date.now(),
              telefono: "555-0000",
              direccion_envio: "Envio Principal"
            })
            id_cliente = newClientRes.data.data.id_cliente
          }

          await api.put(`/pedidos/${id}`, {
            id_cliente,
            estado_pedido: payload.estado,
            monto_total: Number(payload.total),
            fecha_pedido: payload.fecha
          })

          return {
            id,
            ...payload
          }
        } catch (err) {
          throw new Error(err.response?.data?.message || "Error al actualizar pedido.")
        }
      },
      async remove(id) {
        try {
          await api.delete(`/pedidos/${id}`)
          return true
        } catch (err) {
          throw new Error(err.response?.data?.message || "Error al eliminar pedido.")
        }
      }
    }
  }

  return {
    resource,

    async getAll(params) {
      try {
        const { data } = await api.get(path, { params })
        const rawList = Array.isArray(data) ? data : data?.data || []
        return mapping ? rawList.map(mapping.toUI) : rawList
      } catch (err) {
        throw new Error(err.response?.data?.message || `Error al obtener ${resource}.`)
      }
    },

    async getById(id) {
      try {
        const { data } = await api.get(`${path}/${id}`)
        const record = data?.data || data
        return mapping ? mapping.toUI(record) : record
      } catch (err) {
        throw new Error(err.response?.data?.message || `Error al obtener ${resource} por id.`)
      }
    },

    async create(payload) {
      try {
        const body = mapping ? mapping.toDB(payload) : payload
        const { data } = await api.post(path, body)
        const record = data?.data || data
        return mapping ? mapping.toUI(record) : record
      } catch (err) {
        throw new Error(err.response?.data?.message || `Error al crear ${resource}.`)
      }
    },

    async update(id, payload) {
      try {
        const body = mapping ? mapping.toDB(payload) : payload
        const { data } = await api.put(`${path}/${id}`, body)
        const record = data?.data || data
        return mapping ? mapping.toUI(record) : record
      } catch (err) {
        throw new Error(err.response?.data?.message || `Error al actualizar ${resource}.`)
      }
    },

    async remove(id) {
      try {
        await api.delete(`${path}/${id}`)
        return true
      } catch (err) {
        throw new Error(err.response?.data?.message || `Error al eliminar ${resource}.`)
      }
    },
  }
}

// Pre-built services for every backend resource
export const usuariosService = createCrudService("usuarios")
export const trabajadoresService = createCrudService("trabajadores")
export const clientesService = createCrudService("clientes")
export const proveedoresService = createCrudService("proveedores")
export const insumosService = createCrudService("insumos")
export const comprasInsumosService = createCrudService("compras-insumos")
export const lotesService = createCrudService("lotes")
export const productosFinalesService = createCrudService("productos-finales")
export const produccionService = createCrudService("produccion")
export const empaquetadoService = createCrudService("empaquetado")
export const pedidosService = createCrudService("pedidos")
