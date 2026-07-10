import { useEffect, useState, useCallback } from "react"
import { Plus, Pencil, Trash2, Search, Loader2, Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

/**
 * Generic CRUD module. Drives an entire resource screen from config.
 *
 * Props:
 *  - title, description
 *  - service: a CRUD service from crudService.js
 *  - columns: [{ key, label, render?(value,row) }]
 *  - fields:  [{ name, label, type?, options?, required?, placeholder?, span? }]
 *      type: text | number | email | date | textarea | select
 *  - searchKeys: string[] of column keys to filter by
 *  - actions?: extra row actions render(row, reload)
 */
export default function CrudModule({
  title,
  description,
  service,
  columns,
  fields,
  searchKeys = [],
  actions,
}) {
  const { toast } = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await service.getAll()
    setRows(data)
    setLoading(false)
  }, [service])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    const blank = {}
    fields.forEach((f) => {
      blank[f.name] = f.type === "number" ? "" : ""
    })
    setForm(blank)
    setOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ ...row })
    setOpen(true)
  }

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Coerce number fields
      const payload = { ...form }
      fields.forEach((f) => {
        if (f.type === "number" && payload[f.name] !== "" && payload[f.name] != null) {
          payload[f.name] = Number(payload[f.name])
        }
      })
      if (editing) {
        await service.update(editing.id, payload)
        toast("Registro actualizado correctamente")
      } else {
        await service.create(payload)
        toast("Registro creado correctamente")
      }
      setOpen(false)
      await load()
    } catch (err) {
      toast("Ocurrio un error al guardar", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    await service.remove(confirmDelete.id)
    toast("Registro eliminado")
    setConfirmDelete(null)
    await load()
  }

  const filtered = query
    ? rows.filter((r) =>
        searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(query.toLowerCase())),
      )
    : rows

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button variant="accent" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nuevo registro
        </Button>
      </div>

      <Card>
        {searchKeys.length > 0 && (
          <div className="border-b p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando datos...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={c.key}>{c.label}</TableHead>
                ))}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="py-12 text-center text-muted-foreground">
                    No hay registros para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((c) => (
                      <TableCell key={c.key}>{c.render ? c.render(row[c.key], row) : row[c.key]}</TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {actions?.(row, load)}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)} aria-label="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setConfirmDelete(row)}
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Create / Edit modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar registro" : "Nuevo registro"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifica los campos y guarda los cambios." : `Completa la informacion de ${title.toLowerCase()}.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.span === 2 || f.type === "textarea" ? "sm:col-span-2" : ""}>
                <Label htmlFor={f.name}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={f.name}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setField(f.name, e.target.value)}
                  />
                ) : f.type === "select" ? (
                  <Select
                    id={f.name}
                    value={form[f.name] ?? ""}
                    onValueChange={(v) => setField(f.name, v)}
                  >
                    <option value="" disabled>
                      Selecciona...
                    </option>
                    {f.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                ) : f.type === "image" ? (
                  <ImageUpload
                    key={editing ? `edit-${editing.id}` : "new"}
                    value={form[f.name] ?? ""}
                    onChange={(v) => setField(f.name, v)}
                  />
                ) : (
                  <Input
                    id={f.name}
                    type={f.type || "text"}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setField(f.name, e.target.value)}
                  />
                )}
              </div>
            ))}
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="accent" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!confirmDelete} onOpenChange={(v) => !v && setConfirmDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar registro</DialogTitle>
            <DialogDescription>Esta accion no se puede deshacer. Deseas continuar?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, width, height)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7)
        resolve(compressedBase64)
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}

const uploadToImgBB = async (base64) => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY
  // Strip the data URL prefix (data:image/jpeg;base64,...)
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "")
  const formData = new FormData()
  formData.append("key", apiKey)
  formData.append("image", base64Data)
  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error?.message || "Error al subir imagen a ImgBB")
  return json.data.url
}

function ImageUpload({ value, onChange }) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(value || "")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setPreview(value || "")
  }, [value])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const processFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido.")
      return
    }
    setUploading(true)
    try {
      const base64 = await compressImage(file)
      const url = await uploadToImgBB(base64)
      setPreview(url)
      onChange(url)
    } catch (err) {
      console.error(err)
      alert("Error al subir la imagen. Intenta de nuevo.")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleRemove = (e) => {
    e.preventDefault()
    setPreview("")
    onChange("")
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-200 mt-1.5 ${
        dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/35 hover:border-primary/50"
      } bg-card/50 backdrop-blur-sm`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Subiendo imagen...</span>
        </div>
      ) : preview ? (
        <div className="relative w-full max-w-[200px] aspect-square rounded-md overflow-hidden border bg-background mx-auto">
          <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow hover:bg-destructive/90 transition-colors cursor-pointer"
            title="Eliminar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 py-4 w-full">
          <Upload className="h-10 w-10 text-muted-foreground mx-auto animate-pulse" />
          <span className="text-sm font-medium text-foreground">
            Arrastra una imagen aquí o <span className="text-primary underline font-semibold">explora</span>
          </span>
          <span className="text-xs text-muted-foreground">PNG, JPG, WEBP — se sube automáticamente a ImgBB</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      )}
    </div>
  )
}
