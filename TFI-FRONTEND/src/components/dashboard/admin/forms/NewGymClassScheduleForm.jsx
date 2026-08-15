import { useState } from 'react'
import { useNavigate } from 'react-router'
import Layout from '../../../layout/Layout'
import useFetch from '../../../../hooks/useFetch'
import useTrainers from '../../../../hooks/useTrainers'
import FormField, { inputCls } from '../../../forms/FormField'
import {
  validateClassName,
  validateClassDescription,
  validateMaxCapacity,
  validateTrainerId,
  validateDayOfWeek,
  validateTimeOfDay,
} from '../../../forms/classValidation'
import { FaArrowLeft, FaCheckCircle, FaPlus } from 'react-icons/fa'
import { DAY_OPTIONS } from '../../../../utils/formatters'

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  className: '',
  classDescription: '',
  maxCapacity: '',
  trainerId: '',
  dayOfWeek: '1',       // Monday default
  timeOfDay: '',
  isWeekly: true,
}

// ─── Component ────────────────────────────────────────────────────────────────

const NewGymClassScheduleForm = () => {
  const navigate = useNavigate()
  const { post, isLoading } = useFetch()
  const { trainers, isLoadingTrainers, trainerError } = useTrainers()

  const [form, setForm]           = useState(EMPTY_FORM)
  const [errors, setErrors]       = useState({})
  const [apiError, setApiError]   = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [createdName, setCreatedName] = useState('')

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm(prev => ({ ...prev, [name]: val }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    const cn  = validateClassName(form.className);               if (cn)  e.className = cn
    const cd  = validateClassDescription(form.classDescription); if (cd)  e.classDescription = cd
    const mc  = validateMaxCapacity(form.maxCapacity);           if (mc)  e.maxCapacity = mc
    const tid = validateTrainerId(form.trainerId);               if (tid) e.trainerId = tid
    const dow = validateDayOfWeek(form.dayOfWeek);               if (dow) e.dayOfWeek = dow
    const tod = validateTimeOfDay(form.timeOfDay);               if (tod) e.timeOfDay = tod
    return e
  }

  const handleSubmit = e => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setApiError(null)

    post(
      'gymclassschedule',
      true,
      {
        ClassName:        form.className.trim(),
        ClassDescription: form.classDescription.trim() || null,
        MaxCapacity:      Number(form.maxCapacity),
        TrainerId:        form.trainerId,
        DayOfWeek:        Number(form.dayOfWeek),
        TimeOfDay:        form.timeOfDay + ':00',   // "HH:MM" → "HH:MM:SS"
        IsWeekly:         form.isWeekly,
      },
      () => {
        setCreatedName(form.className.trim())
        setSubmitted(true)
      },
      err => setApiError(err?.message ?? 'Algo salió mal. Intentá de nuevo.')
    )
  }

  const handleCreateAnother = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setApiError(null)
    setSubmitted(false)
    setCreatedName('')
  }

  return (
    <Layout>
      <section className="mx-auto max-w-xl px-4 py-10 sm:px-6">

        {/* Back */}
        <button
          id="back-to-dashboard"
          onClick={() => navigate('/admin/dashboard')}
          className="
            mb-8 flex items-center gap-2 text-sm font-medium text-zinc-400
            hover:text-orange-400 transition-colors duration-150 cursor-pointer
          "
        >
          <FaArrowLeft className="text-xs" />
          Volver al panel
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">
            Administración · Clases
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Nuevo horario de clase
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Definí una plantilla de horario recurrente o puntual para una clase.
          </p>
        </div>

        {/* Success banner */}
        {submitted && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
            <FaCheckCircle className="mt-0.5 flex-shrink-0 text-emerald-400 text-lg" />
            <div>
              <p className="font-semibold text-emerald-400">¡Horario creado!</p>
              <p className="mt-0.5 text-sm text-zinc-400">
                <span className="font-medium text-white">"{createdName}"</span> se creó correctamente.
              </p>
            </div>
          </div>
        )}

        {/* API error banner */}
        {apiError && !submitted && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {apiError}
          </div>
        )}

        {/* Trainer fetch error */}
        {trainerError && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm text-amber-400">
            No se pudo cargar la lista de entrenadores: {trainerError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Class Name */}
          <FormField label="Nombre de la clase" id="className" error={errors.className}>
            <input
              id="className"
              name="className"
              type="text"
              value={form.className}
              onChange={handleChange}
              placeholder="ej. Fuerza y acondicionamiento"
              disabled={submitted}
              className={inputCls(!!errors.className)}
            />
          </FormField>

          {/* Description */}
          <FormField label="Descripción (opcional)" id="classDescription" error={errors.classDescription}>
            <textarea
              id="classDescription"
              name="classDescription"
              rows={3}
              value={form.classDescription}
              onChange={handleChange}
              placeholder="Breve descripción de la clase…"
              disabled={submitted}
              className={`${inputCls(!!errors.classDescription)} resize-none`}
            />
          </FormField>

          {/* Max Capacity */}
          <FormField label="Capacidad máxima" id="maxCapacity" error={errors.maxCapacity}>
            <input
              id="maxCapacity"
              name="maxCapacity"
              type="number"
              min={1}
              value={form.maxCapacity}
              onChange={handleChange}
              placeholder="ej. 20"
              disabled={submitted}
              className={inputCls(!!errors.maxCapacity)}
            />
          </FormField>

          {/* Trainer */}
          <FormField label="Entrenador" id="trainerId" error={errors.trainerId}>
            <select
              id="trainerId"
              name="trainerId"
              value={form.trainerId}
              onChange={handleChange}
              disabled={submitted || isLoadingTrainers}
              className={inputCls(!!errors.trainerId)}
            >
              <option value="">
                {isLoadingTrainers ? 'Cargando entrenadores…' : 'Seleccioná un entrenador'}
              </option>
              {trainers.map(t => (
                <option key={t.userId} value={t.userId}>
                  {t.name}{t.specialization ? ` — ${t.specialization}` : ''}
                </option>
              ))}
            </select>
          </FormField>

          {/* Day + Time — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Día de la semana" id="dayOfWeek" error={errors.dayOfWeek}>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={form.dayOfWeek}
                onChange={handleChange}
                disabled={submitted}
                className={inputCls(!!errors.dayOfWeek)}
              >
                {DAY_OPTIONS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Hora" id="timeOfDay" error={errors.timeOfDay}>
              <input
                id="timeOfDay"
                name="timeOfDay"
                type="time"
                value={form.timeOfDay}
                onChange={handleChange}
                disabled={submitted}
                className={inputCls(!!errors.timeOfDay)}
              />
            </FormField>
          </div>

          {/* Is Weekly toggle */}
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
            <input
              id="isWeekly"
              name="isWeekly"
              type="checkbox"
              checked={form.isWeekly}
              onChange={handleChange}
              disabled={submitted}
              className="h-4 w-4 rounded border-zinc-600 accent-orange-500 cursor-pointer"
            />
            <div>
              <label htmlFor="isWeekly" className="block text-sm font-medium text-zinc-200 cursor-pointer">
                Se repite todas las semanas
              </label>
              <p className="text-xs text-zinc-500">
                Destildá esta opción para una única ocurrencia en el día seleccionado.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id="submit-gymclassschedule"
              type="submit"
              disabled={isLoading || submitted}
              className="
                flex-1 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white
                hover:bg-orange-600 active:scale-[.98]
                disabled:cursor-not-allowed disabled:opacity-50
                transition-all duration-150
              "
            >
              {isLoading ? 'Creando…' : 'Crear horario'}
            </button>

            {submitted && (
              <button
                id="create-another-gymclassschedule"
                type="button"
                onClick={handleCreateAnother}
                className="
                  flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3
                  text-sm font-semibold text-zinc-300
                  hover:border-orange-500/60 hover:text-orange-400
                  active:scale-[.98] transition-all duration-150 cursor-pointer
                "
              >
                <FaPlus className="text-xs" />
                Crear otro
              </button>
            )}
          </div>

        </form>
      </section>
    </Layout>
  )
}

export default NewGymClassScheduleForm
