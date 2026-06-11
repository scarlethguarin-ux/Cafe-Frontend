import api from "./api"
import { seedData } from "./mockData"

/**
 * Generic CRUD service factory.
 *
 * Each resource (e.g. "lotes", "insumos") gets the standard REST methods:
 *   getAll()  -> GET    /api/<resource>
 *   getById() -> GET    /api/<resource>/:id
 *   create()  -> POST   /api/<resource>
 *   update()  -> PUT    /api/<resource>/:id
 *   remove()  -> DELETE /api/<resource>/:id
 *
 * If the backend is unreachable, it transparently falls back to an in-memory
 * mock store so the UI keeps working during frontend development.
 */
// When no real backend URL is configured we run fully on the in-memory
// mock store. This keeps the app functional in the preview/demo.
const MOCK_ONLY = !import.meta.env.VITE_API_URL

export function createCrudService(resource) {
  // Clone seed so each resource has its own mutable in-memory store
  let store = JSON.parse(JSON.stringify(seedData[resource] || []))
  let useMock = MOCK_ONLY

  const nextId = () => (store.length ? Math.max(...store.map((r) => r.id || 0)) + 1 : 1)

  return {
    resource,

    async getAll(params) {
      if (useMock) return [...store]
      try {
        const { data } = await api.get(`/${resource}`, { params })
        return Array.isArray(data) ? data : data?.data || []
      } catch (err) {
        useMock = true
        return [...store]
      }
    },

    async getById(id) {
      if (useMock) return store.find((r) => String(r.id) === String(id))
      try {
        const { data } = await api.get(`/${resource}/${id}`)
        return data
      } catch (err) {
        useMock = true
        return store.find((r) => String(r.id) === String(id))
      }
    },

    async create(payload) {
      if (useMock) {
        const record = { ...payload, id: nextId() }
        store.push(record)
        return record
      }
      try {
        const { data } = await api.post(`/${resource}`, payload)
        return data
      } catch (err) {
        useMock = true
        const record = { ...payload, id: nextId() }
        store.push(record)
        return record
      }
    },

    async update(id, payload) {
      if (useMock) {
        store = store.map((r) => (String(r.id) === String(id) ? { ...r, ...payload, id: r.id } : r))
        return store.find((r) => String(r.id) === String(id))
      }
      try {
        const { data } = await api.put(`/${resource}/${id}`, payload)
        return data
      } catch (err) {
        useMock = true
        store = store.map((r) => (String(r.id) === String(id) ? { ...r, ...payload, id: r.id } : r))
        return store.find((r) => String(r.id) === String(id))
      }
    },

    async remove(id) {
      if (useMock) {
        store = store.filter((r) => String(r.id) !== String(id))
        return true
      }
      try {
        await api.delete(`/${resource}/${id}`)
        return true
      } catch (err) {
        useMock = true
        store = store.filter((r) => String(r.id) !== String(id))
        return true
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
