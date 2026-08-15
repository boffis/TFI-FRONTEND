import { useState } from 'react'
import { FaPencil, FaCheck, FaXmark } from 'react-icons/fa6'

const EditableNameAndDescription = ({ name, description, onSave, nameClassName = '', idPrefix }) => {
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(name)
  const [draftDescription, setDraftDescription] = useState(description ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const startEdit = () => {
    setDraftName(name)
    setDraftDescription(description ?? '')
    setError(null)
    setEditing(true)
  }

  const cancel = () => {
    setEditing(false)
    setError(null)
  }

  const save = () => {
    const trimmedName = draftName.trim()
    if (!trimmedName) {
      setError('El nombre no puede estar vacío.')
      return
    }
    setSaving(true)
    onSave(trimmedName, draftDescription.trim() || null, (success, message) => {
      setSaving(false)
      if (success) {
        setEditing(false)
      } else {
        setError(message ?? 'No se pudo actualizar.')
      }
    })
  }

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={nameClassName}>{name}</p>
          {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
        </div>
        <button
          type="button"
          onClick={startEdit}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition-all duration-200 cursor-pointer"
        >
          <FaPencil className="text-[10px]" />
          Editar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={`${idPrefix}-name`} className="mb-1 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Nombre
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          disabled={saving}
          autoFocus
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all duration-200"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-description`} className="mb-1 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Descripción
        </label>
        <textarea
          id={`${idPrefix}-description`}
          value={draftDescription}
          onChange={(e) => setDraftDescription(e.target.value)}
          disabled={saving}
          rows={2}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all duration-200 resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl border border-orange-500 bg-orange-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-orange-400 transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <FaCheck />
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
        <button
          onClick={cancel}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <FaXmark />
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default EditableNameAndDescription
