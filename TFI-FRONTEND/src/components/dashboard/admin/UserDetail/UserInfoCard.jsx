import { useState } from 'react'
import { FaPencil, FaCheck, FaXmark } from 'react-icons/fa6'
import useFetch from '../../../../hooks/useFetch'
import { capitalizeWords, genderLabel, roleLabel, GENDER_OPTIONS } from '../../../../utils/formatters'

const ROLE_BADGE = {
  Client:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Trainer: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Admin:   'bg-rose-500/15 text-rose-400 border-rose-500/30',
}

const Field = ({ label, value }) => (
  <div>
    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
    <p className="text-sm font-medium text-zinc-200">{value || '—'}</p>
  </div>
)

const InputField = ({ label, id, type = 'text', value, onChange }) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all duration-200"
    />
  </div>
)

const UserInfoCard = ({ userData, onUpdated }) => {
  const { put, isLoading } = useFetch()

  const [editing, setEditing] = useState(false)
  const [feedback, setFeedback] = useState(null) // { type: 'success'|'error', msg }

  const [form, setForm] = useState({
    name: userData.name ?? '',
    email: userData.email ?? '',
    dateOfBirth: userData.dateOfBirth?.split('T')[0] ?? '',
    dni: userData.dni ?? '',
    gender: userData.gender ?? 'Male',
    specialization: userData.specialization ?? '',
    phoneNumber: userData.phoneNumber ?? '',
  })

  const setField = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const handleEdit = () => {
    setFeedback(null)
    setEditing(true)
  }

  const handleCancel = () => {
    setForm({
      name: userData.name ?? '',
      email: userData.email ?? '',
      dateOfBirth: userData.dateOfBirth?.split('T')[0] ?? '',
      dni: userData.dni ?? '',
      gender: userData.gender ?? 'Male',
      specialization: userData.specialization ?? '',
      phoneNumber: userData.phoneNumber ?? '',
    })
    setFeedback(null)
    setEditing(false)
  }

  const handleSave = () => {
    const body = {
      name: form.name,
      email: form.email,
      dateOfBirth: form.dateOfBirth,
      dni: form.dni,
      gender: form.gender,
      specialization: form.specialization || null,
      phoneNumber: form.phoneNumber,
    }
    console.log('[UserInfoCard] PUT body:', body)
    put(
      `user/${userData.userId}`,
      true,
      body,
      (res) => {
        console.log('[UserInfoCard] PUT response:', res)
        setFeedback({ type: 'success', msg: 'Usuario actualizado correctamente.' })
        setEditing(false)
        onUpdated()
      },
      (err) => {
        console.log('[UserInfoCard] PUT error:', err)
        setFeedback({ type: 'error', msg: err?.message ?? 'No se pudo actualizar el usuario.' })
      }
    )
  }

  const badgeClass = ROLE_BADGE[userData.role] ?? 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30'

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Información personal</h2>
          <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold tracking-wide ${badgeClass}`}>
            {roleLabel(userData.role)}
          </span>
        </div>

        {!editing ? (
          <button
            id="btn-edit-user"
            onClick={handleEdit}
            className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition-all duration-200 cursor-pointer"
          >
            <FaPencil className="text-xs" />
            Editar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              id="btn-cancel-edit-user"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <FaXmark />
              Cancelar
            </button>
            <button
              id="btn-save-user"
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-orange-500 bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-400 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <FaCheck />
              {isLoading ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
          feedback.type === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-red-500/30 bg-red-500/10 text-red-400'
        }`}>
          {feedback.msg}
        </div>
      )}

      {!editing ? (
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Field label="Nombre"               value={capitalizeWords(userData.name)} />
          <Field label="Correo"               value={userData.email} />
          <Field label="Fecha de nacimiento"  value={userData.dateOfBirth?.split('T')[0]} />
          <Field label="DNI"                  value={userData.dni} />
          <Field label="Género"               value={genderLabel(userData.gender)} />
          <Field label="Teléfono"             value={userData.phoneNumber} />
          {userData.role === 'Trainer' && (
            <Field label="Especialización" value={userData.specialization} />
          )}
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <InputField label="Nombre"   id="edit-name" value={form.name}        onChange={setField('name')} />
          {/* Identidad del cliente: solo lectura desde el panel de admin. */}
          <Field label="Correo"               value={userData.email} />
          <Field label="Fecha de nacimiento"  value={userData.dateOfBirth?.split('T')[0]} />
          <Field label="DNI"                  value={userData.dni} />
          <InputField label="Teléfono" id="edit-phone" value={form.phoneNumber} onChange={setField('phoneNumber')} />

          <div>
            <label htmlFor="edit-gender" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Género
            </label>
            <select
              id="edit-gender"
              value={form.gender}
              onChange={(e) => setField('gender')(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all duration-200 cursor-pointer"
            >
              {GENDER_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {userData.role === 'Trainer' && (
            <InputField label="Especialización" id="edit-specialization" value={form.specialization} onChange={setField('specialization')} />
          )}
        </div>
      )}
    </div>
  )
}

export default UserInfoCard
