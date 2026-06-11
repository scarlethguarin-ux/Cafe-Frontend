import { createContext, useContext, useState, useCallback, useMemo } from "react"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, cantidad: i.cantidad + 1 } : i))
      }
      return [...prev, { ...product, cantidad: 1 }]
    })
  }, [])

  const updateQty = useCallback((id, cantidad) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, cantidad: Math.max(0, cantidad) } : i))
        .filter((i) => i.cantidad > 0),
    )
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = useMemo(() => items.reduce((sum, i) => sum + i.precio * i.cantidad, 0), [items])
  const count = useMemo(() => items.reduce((sum, i) => sum + i.cantidad, 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider")
  return ctx
}
