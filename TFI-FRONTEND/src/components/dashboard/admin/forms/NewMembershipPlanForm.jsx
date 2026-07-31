import { useState } from 'react'
import { useNavigate } from 'react-router'
import Layout from '../../../layout/Layout'
import useFetch from '../../../../hooks/useFetch'
import FormField, { inputCls } from '../../../forms/FormField'
import { FaArrowLeft, FaCheckCircle, FaPlus } from 'react-icons/fa'

const EMPTY_FORM = {
  type: '',
  price: '',
  durationInDays: '',
}

const NewMembershipPlanForm = () => {
  const navigate = useNavigate()
  const { post, isLoading } = useFetch()

  const [form, setForm]           = useState(EMPTY_FORM)
  const [errors, setErrors]       = useState({})
  const [apiError, setApiError]   = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [createdName, setCreatedName] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.type.trim()) e.type = 'Type is required'
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price is required'
    if (!form.durationInDays || isNaN(form.durationInDays) || Number(form.durationInDays) <= 0) e.durationInDays = 'Valid duration in days is required'
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
      'membershipPlan',
      true,
      {
        Type: form.type.trim(),
        Price: Number(form.price),
        DurationInDays: Number(form.durationInDays),
      },
      () => {
        setCreatedName(form.type.trim())
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
            Admin · Memberships
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            New Membership Plan
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Create a new membership plan for users to purchase.
          </p>
        </div>

        {/* Success banner */}
        {submitted && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
            <FaCheckCircle className="mt-0.5 flex-shrink-0 text-emerald-400 text-lg" />
            <div>
              <p className="font-semibold text-emerald-400">Plan created!</p>
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

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Type */}
          <FormField label="Plan Type" id="type" error={errors.type}>
            <input
              id="type"
              name="type"
              type="text"
              value={form.type}
              onChange={handleChange}
              placeholder="e.g. Monthly Standard"
              disabled={submitted}
              className={inputCls(!!errors.type)}
            />
          </FormField>

          {/* Price */}
          <FormField label="Price" id="price" error={errors.price}>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min={0}
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 49.99"
              disabled={submitted}
              className={inputCls(!!errors.price)}
            />
          </FormField>

          {/* Duration in Days */}
          <FormField label="Duration (Days)" id="durationInDays" error={errors.durationInDays}>
            <input
              id="durationInDays"
              name="durationInDays"
              type="number"
              min={1}
              value={form.durationInDays}
              onChange={handleChange}
              placeholder="e.g. 30"
              disabled={submitted}
              className={inputCls(!!errors.durationInDays)}
            />
          </FormField>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id="submit-membershipplan"
              type="submit"
              disabled={isLoading || submitted}
              className="
                flex-1 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white
                hover:bg-orange-600 active:scale-[.98]
                disabled:cursor-not-allowed disabled:opacity-50
                transition-all duration-150
              "
            >
              {isLoading ? 'Creating…' : 'Create Plan'}
            </button>

            {submitted && (
              <button
                id="create-another-membershipplan"
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

export default NewMembershipPlanForm
