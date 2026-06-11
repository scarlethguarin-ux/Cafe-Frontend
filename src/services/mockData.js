/**
 * In-memory seed data used as a fallback when the REST API is not reachable
 * (e.g. while developing the frontend in isolation or in the v0 preview).
 * Each key maps to a backend resource path.
 */
export const seedData = {
  usuarios: [
    { id: 1, nombre: "Admin General", email: "admin@cafe.com", rol: "Administrador", estado: "Activo" },
    { id: 2, nombre: "Maria Lopez", email: "maria@cafe.com", rol: "Vendedor", estado: "Activo" },
    { id: 3, nombre: "Carlos Ruiz", email: "carlos@cafe.com", rol: "Bodeguero", estado: "Inactivo" },
  ],
  trabajadores: [
    {
      id: 1,
      nombre_completo: "Jose Hernandez",
      cedula: "1098765432",
      cargo: "Recolector",
      fecha_contratacion: "2023-01-15",
      telefono: "3001234567",
    },
    {
      id: 2,
      nombre_completo: "Ana Gomez",
      cedula: "1087654321",
      cargo: "Supervisor de Lote",
      fecha_contratacion: "2022-08-01",
      telefono: "3017654321",
    },
  ],
  clientes: [
    { id: 1, nombre: "Cafeteria Central", email: "ventas@central.com", telefono: "6012345", ciudad: "Bogota" },
    { id: 2, nombre: "Tienda El Grano", email: "elgrano@mail.com", telefono: "6048899", ciudad: "Medellin" },
  ],
  proveedores: [
    { id: 1, nombre: "AgroInsumos S.A.", contacto: "Pedro Diaz", telefono: "6019988", email: "ventas@agro.com" },
    { id: 2, nombre: "Empaques del Valle", contacto: "Luisa Mora", telefono: "6027766", email: "info@empaques.com" },
  ],
  insumos: [
    { id: 1, nombre: "Fertilizante Organico", categoria: "Agroquimico", unidad_medida: "Kg", cantidad_stock: 320 },
    { id: 2, nombre: "Bolsa Valvulada 500g", categoria: "Empaque", unidad_medida: "Unidad", cantidad_stock: 1500 },
    { id: 3, nombre: "Etiquetas Adhesivas", categoria: "Empaque", unidad_medida: "Unidad", cantidad_stock: 80 },
  ],
  "compras-insumos": [
    { id: 1, proveedor_id: 1, insumo_id: 1, cantidad: 200, costo_total: 1200000, fecha: "2024-05-10" },
    { id: 2, proveedor_id: 2, insumo_id: 2, cantidad: 1000, costo_total: 450000, fecha: "2024-05-12" },
  ],
  lotes: [
    { id: 1, nombre: "Lote La Esperanza", capacidad_maxima: 500, capacidad_actual: 320, ubicacion: "Ladera Norte" },
    { id: 2, nombre: "Lote El Mirador", capacidad_maxima: 400, capacidad_actual: 95, ubicacion: "Ladera Sur" },
    { id: 3, nombre: "Lote Buenavista", capacidad_maxima: 600, capacidad_actual: 540, ubicacion: "Cima" },
  ],
  "productos-finales": [
    {
      id: 1,
      nombre: "Cafe Molido Premium",
      tipo: "Molido",
      precio: 28000,
      stock: 120,
      descripcion: "Notas a chocolate y caramelo, tueste medio.",
      imagen: "/cafe-molido-bag.png",
    },
    {
      id: 2,
      nombre: "Cafe en Grano Entero",
      tipo: "Grano",
      precio: 32000,
      stock: 85,
      descripcion: "Grano entero de altura, ideal para espresso.",
      imagen: "/cafe-grano-entero-bag.png",
    },
    {
      id: 3,
      nombre: "Cafe Descafeinado",
      tipo: "Molido",
      precio: 30000,
      stock: 40,
      descripcion: "Suave y aromatico, sin cafeina, proceso natural.",
      imagen: "/cafe-descafeinado-bag.png",
    },
  ],
  produccion: [
    { id: 1, lote_id: 1, trabajador_id: 1, cantidad_producida: 180, fecha: "2024-05-20" },
    { id: 2, lote_id: 3, trabajador_id: 2, cantidad_producida: 220, fecha: "2024-05-21" },
  ],
  empaquetado: [
    { id: 1, produccion_id: 1, producto_final_id: 1, cantidad_empaques: 360, fecha: "2024-05-25" },
  ],
  pedidos: [
    {
      id: 1,
      cliente: "Cafeteria Central",
      total: 168000,
      estado: "Pendiente",
      fecha: "2024-05-28",
      items: 6,
    },
    {
      id: 2,
      cliente: "Tienda El Grano",
      total: 96000,
      estado: "Pagado",
      fecha: "2024-05-27",
      items: 3,
    },
    {
      id: 3,
      cliente: "Consumidor Final",
      total: 60000,
      estado: "Enviado",
      fecha: "2024-05-26",
      items: 2,
    },
  ],
}
