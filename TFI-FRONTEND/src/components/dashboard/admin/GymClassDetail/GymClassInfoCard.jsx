import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FaPencil, FaCheck, FaXmark, FaCalendarDays } from 'react-icons/fa6'
import useFetch from '../../../../hooks/useFetch'
import useTrainers from '../../../../hooks/useTrainers'

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

const GymClassInfoCard = ({ classData, onUpdated }) => {
  const navigate = useNavigate()
  const { put, isLoading } = useFetch()
  const { trainers, isLoadingTrainers, trainerError } = useTrainers()

  const [editing, setEditing] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const [form, setForm] = useState({
    className: classData.className ?? '',
    classDescription: classData.classDescription ?? '',
    maxCapacity: classData.maxCapacity ?? '',
    schedule: classData.schedule ? classData.schedule.slice(0, 16) : '', // format to YYYY-MM-DDThh:mm
    trainerId: classData.trainer?.trainerId ?? '',
  })

  const setField = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const handleEdit = () => {
    setFeedback(null)
    setEditing(true)
  }

  const handleCancel = () => {
    setForm({
      className: classData.className ?? '',
      classDescription: classData.classDescription ?? '',
      maxCapacity: classData.maxCapacity ?? '',
      schedule: classData.schedule ? classData.schedule.slice(0, 16) : '',
      trainerId: classData.trainer?.trainerId ?? '',
    })
    setFeedback(null)
    setEditing(false)
  }

  const handleSave = () => {
    put(
      `GymClass/${classData.gymClassId}`,
      true,
      {
        trainerId: form.trainerId,
        className: form.className.trim(),
        classDescription: form.classDescription.trim() || null,
        maxCapacity: Number(form.maxCapacity),
        // Wall clock, not an instant — same as NewGymClassForm. Converting on the way out shifted
        // the class 3 hours later on every save, even when the field was untouched.
        schedule: form.schedule,
      },
      () => {
        setFeedback({ type: 'success', msg: 'Clase actualizada correctamente.' })
        setEditing(false)
        onUpdated()
      },
      (err) => setFeedback({ type: 'error', msg: err?.message ?? 'No se pudo actualizar la clase.' })
    )
  }

  const formattedSchedule = classData.schedule
    ? new Date(classData.schedule).toLocaleString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : '—'

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Información de la clase</h2>

        {!editing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition-all duration-200 cursor-pointer"
          >
            <FaPencil className="text-xs" />
            Editar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <FaXmark />
              Cancelar
            </button>
            <button
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
          <Field label="Nombre de la clase"  value={classData.className} />
          <Field label="Entrenador"          value={classData.trainer?.name} />
          <Field label="Capacidad máxima"    value={classData.maxCapacity?.toString()} />
          <Field label="Horario"             value={formattedSchedule} />
          <div className="sm:col-span-2">
              <Field label="Descripción"     value={classData.classDescription} />
          </div>
          {classData.gymClassScheduleId && (
              <div className="sm:col-span-2">
                 <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">Generada a partir del horario</p>
                 <button
                   onClick={() => navigate(`/admin/gymclassschedule/${classData.gymClassScheduleId}`)}
                   className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition-all duration-200 cursor-pointer"
                 >
                   <FaCalendarDays className="text-xs" />
                   Ver horario de la clase
                 </button>
              </div>
          )}
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <InputField label="Nombre de la clase"   id="edit-className"   value={form.className}     onChange={setField('className')} />
          
          <div>
            <label htmlFor="edit-trainer" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Entrenador
            </label>
            <select
              id="edit-trainer"
              value={form.trainerId}
              onChange={(e) => setField('trainerId')(e.target.value)}
              disabled={isLoadingTrainers}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all duration-200"
            >
              <option value="">{isLoadingTrainers ? 'Cargando...' : 'Seleccioná un entrenador'}</option>
              {trainers.map(t => (
                <option key={t.userId} value={t.userId}>
                  {t.name}{t.specialization ? ` — ${t.specialization}` : ''}
                </option>
              ))}
            </select>
          </div>

          <InputField label="Capacidad máxima" id="edit-capacity" type="number" value={form.maxCapacity} onChange={setField('maxCapacity')} />
          <InputField label="Horario"          id="edit-schedule" type="datetime-local" value={form.schedule} onChange={setField('schedule')} />
          
          <div className="sm:col-span-2">
             <label htmlFor="edit-desc" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Descripción
              </label>
              <textarea
                id="edit-desc"
                value={form.classDescription}
                onChange={(e) => setField('classDescription')(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all duration-200 resize-none"
                rows={3}
              />
          </div>
        </div>
      )}
    </div>
  )
}

export default GymClassInfoCard
