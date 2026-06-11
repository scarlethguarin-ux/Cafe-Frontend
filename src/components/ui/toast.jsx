import * as React from "react"
import { createPortal } from "react-dom"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastContext = React.createContext({ toast: () => {} })

export function useToast() {
  return React.useContext(ToastContext)
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const styles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-border bg-card text-card-foreground",
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const toast = React.useCallback((message, type = "success") => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
          {toasts.map((t) => {
            const Icon = icons[t.type] || Info
            return (
              <div
                key={t.id}
                role="status"
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-in slide-in-from-right",
                  styles[t.type],
                )}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="flex-1 text-sm font-medium">{t.message}</p>
                <button onClick={() => remove(t.id)} aria-label="Cerrar notificacion">
                  <X className="h-4 w-4 opacity-60 hover:opacity-100" />
                </button>
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}
