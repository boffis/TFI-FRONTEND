import { useState } from 'react'
import { FaPencil, FaCheck, FaXmark } from 'react-icons/fa6'
import useFetch from '../../../../hooks/useFetch'

const Field = ({ label, value }) => (
  <div>
    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
    <p className="text-sm font-medium text-zinc-200">{value === undefined || value === null || value === '' ? '—' : value}</p>
  </div>
)

const InputField = ({ label, id, type = 'text', value, onChange, min }) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
      {label}
    </label>
    <input
      id={id}
      type={type}
      min={min}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all duration-200"
    />
  </div>
)

const MembershipPlanInfoCard = ({ planData, onUpdated }) => {
  const { put, isLoading } = useFetch()

  const [editing, setEditing] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const [form, setForm] = useState({
    type: planData.type ?? '',
    price: planData.price ?? '',
    durationInDays: planData.durationInDays ?? '',
  })

  const setField = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const handleEdit = () => {
    setFeedback(null)
    setEditing(true)
  }

  const handleCancel = () => {
    setForm({
      type: planData.type ?? '',
      price: planData.price ?? '',
      durationInDays: planData.durationInDays ?? '',
    })
    setFeedback(null)
    setEditing(false)
  }

  const handleSave = () => {
    put(
      `MembershipPlan/${planData.membershipPlanId}`,
      true,
      {
        type: form.type.trim() || null,
        price: Number(form.price),
        durationInDays: Number(form.durationInDays),
      },
      () => {
        setFeedback({ type: 'success', msg: 'Membership plan updated successfully.' })
        setEditing(false)
        onUpdated()
      },
      (err) => setFeedback({ type: 'error', msg: err?.message ?? 'Update failed.' })
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Plan Information</h2>

        {!editing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition-all duration-200 cursor-pointer"
          >
            <FaPencil className="text-xs" />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <FaXmark />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-orange-500 bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-400 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <FaCheck />
              {isLoading ? 'Saving…' : 'Save'}
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
          <Field label="Plan Type"           value={planData.type} />
          <Field label="Price"               value={planData.price !== undefined ? `$${planData.price.toFixed(2)}` : '—'} />
          <Field label="Duration (Days)"     value={planData.durationInDays?.toString()} />
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <InputField label="Plan Type"      id="edit-type"       value={form.type}          onChange={setField('type')} />
          <InputField label="Price"          id="edit-price"      type="number" min="0"      value={form.price}         onChange={setField('price')} />
          <InputField label="Duration (Days)" id="edit-duration"  type="number" min="1"      value={form.durationInDays} onChange={setField('durationInDays')} />
        </div>
      )}
    </div>
  )
}

export default MembershipPlanInfoCard
