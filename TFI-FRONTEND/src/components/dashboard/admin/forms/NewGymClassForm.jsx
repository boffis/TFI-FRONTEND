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
  validateScheduleDateTime,
} from '../../../forms/classValidation'
import { FaArrowLeft, FaCheckCircle, FaPlus } from 'react-icons/fa'

// ─── Defaults ─────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  className: '',
  classDescription: '',
  maxCapacity: '',
  trainerId: '',
  schedule: '',
}

// ─── Component ────────────────────────────────────────────────────────────────

const NewGymClassForm = () => {
  const navigate = useNavigate()
  const { post, isLoading } = useFetch()
  const { trainers, isLoadingTrainers, trainerError } = useTrainers()

  const [form, setForm]         = useState(EMPTY_FORM)
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [createdName, setCreatedName] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    const cn  = validateClassName(form.className);           if (cn)  e.className = cn
    const cd  = validateClassDescription(form.classDescription); if (cd) e.classDescription = cd
    const mc  = validateMaxCapacity(form.maxCapacity);       if (mc)  e.maxCapacity = mc
    const tid = validateTrainerId(form.trainerId);           if (tid) e.trainerId = tid
    const sc  = validateScheduleDateTime(form.schedule);     if (sc)  e.schedule = sc
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
      'gymclass/createclass',
      true,
      {
        ClassName:        form.className.trim(),
        ClassDescription: form.classDescription.trim() || null,
        MaxCapacity:      Number(form.maxCapacity),
        TrainerId:        form.trainerId,
        Schedule:         new Date(form.schedule).toISOString(),
      },
      () => {
        setCreatedName(form.className.trim())
        setSubmitted(true)
      },
      err => setApiError(err?.message ?? 'Something went wrong. Please try again.')
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
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">
            Admin · Classes
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            New Gym Class
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Create a one-off gym class session open for inscription.
          </p>
        </div>

        {/* Success banner */}
        {submitted && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
            <FaCheckCircle className="mt-0.5 flex-shrink-0 text-emerald-400 text-lg" />
            <div>
              <p className="font-semibold text-emerald-400">Class created!</p>
              <p className="mt-0.5 text-sm text-zinc-400">
                <span className="font-medium text-white">"{createdName}"</span> was created successfully.
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
            Could not load trainer list: {trainerError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Class Name */}
          <FormField label="Class Name" id="className" error={errors.className}>
            <input
              id="className"
              name="className"
              type="text"
              value={form.className}
              onChange={handleChange}
              placeholder="e.g. Morning Yoga"
              disabled={submitted}
              className={inputCls(!!errors.className)}
            />
          </FormField>

          {/* Description */}
          <FormField label="Description (optional)" id="classDescription" error={errors.classDescription}>
            <textarea
              id="classDescription"
              name="classDescription"
              rows={3}
              value={form.classDescription}
              onChange={handleChange}
              placeholder="Brief description of the class…"
              disabled={submitted}
              className={`${inputCls(!!errors.classDescription)} resize-none`}
            />
          </FormField>

          {/* Max Capacity */}
          <FormField label="Max Capacity" id="maxCapacity" error={errors.maxCapacity}>
            <input
              id="maxCapacity"
              name="maxCapacity"
              type="number"
              min={1}
              value={form.maxCapacity}
              onChange={handleChange}
              placeholder="e.g. 20"
              disabled={submitted}
              className={inputCls(!!errors.maxCapacity)}
            />
          </FormField>

          {/* Trainer */}
          <FormField label="Trainer" id="trainerId" error={errors.trainerId}>
            <select
              id="trainerId"
              name="trainerId"
              value={form.trainerId}
              onChange={handleChange}
              disabled={submitted || isLoadingTrainers}
              className={inputCls(!!errors.trainerId)}
            >
              <option value="">
                {isLoadingTrainers ? 'Loading trainers…' : 'Select a trainer'}
              </option>
              {trainers.map(t => (
                <option key={t.userId} value={t.userId}>
                  {t.name}{t.specialization ? ` — ${t.specialization}` : ''}
                </option>
              ))}
            </select>
          </FormField>

          {/* Schedule */}
          <FormField label="Schedule" id="schedule" error={errors.schedule}>
            <input
              id="schedule"
              name="schedule"
              type="datetime-local"
              value={form.schedule}
              onChange={handleChange}
              disabled={submitted}
              className={inputCls(!!errors.schedule)}
            />
          </FormField>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id="submit-gymclass"
              type="submit"
              disabled={isLoading || submitted}
              className="
                flex-1 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white
                hover:bg-orange-600 active:scale-[.98]
                disabled:cursor-not-allowed disabled:opacity-50
                transition-all duration-150
              "
            >
              {isLoading ? 'Creating…' : 'Create Class'}
            </button>

            {submitted && (
              <button
                id="create-another-gymclass"
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
                Create Another
              </button>
            )}
          </div>

        </form>
      </section>
    </Layout>
  )
}

export default NewGymClassForm
