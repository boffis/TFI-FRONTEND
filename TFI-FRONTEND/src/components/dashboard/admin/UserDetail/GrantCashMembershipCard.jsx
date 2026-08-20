import { useEffect, useState } from 'react'
import { FaMoneyBillWave } from 'react-icons/fa'
import useFetch from '../../../../hooks/useFetch'
import FormField, { inputCls } from '../../../forms/FormField'
import { formatMoney } from '../../../../utils/formatters'
import { explainApiError } from '../../../../utils/errorMessages'

const GrantCashMembershipCard = ({ userId, onGranted }) => {
  const { get, post, isLoading } = useFetch()

  const [plans, setPlans] = useState([])
  const [plansError, setPlansError] = useState(null)
  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    get(
      'membershipPlan',
      false,
      (data) => setPlans(data ?? []),
      (err) => setPlansError(explainApiError(err, 'No se pudieron cargar los planes.'))
    )
  }, [])

  const handleGrant = () => {
    if (!selectedPlanId) return
    setFeedback(null)

    post(
      'Payment/GrantCashMembership',
      true,
      { UserId: userId, MembershipPlanId: selectedPlanId },
      () => {
        setFeedback({ type: 'success', msg: 'Membresía otorgada correctamente.' })
        setSelectedPlanId('')
        onGranted()
      },
      (err) => setFeedback({ type: 'error', msg: explainApiError(err, 'No se pudo otorgar la membresía.') })
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <FaMoneyBillWave className="text-orange-500" />
        <h2 className="text-base font-bold text-white">Otorgar membresía por pago en efectivo</h2>
      </div>

      <p className="mb-4 text-xs text-zinc-500">
        Usá esto cuando el cliente pagó en efectivo, fuera de Mercado Pago. La membresía se activa al instante.
      </p>

      {feedback && (
        <div className={`mb-4 rounded-xl border px-3 py-2 text-xs font-medium ${
          feedback.type === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-red-500/30 bg-red-500/10 text-red-400'
        }`}>
          {feedback.msg}
        </div>
      )}

      {plansError && (
        <p className="mb-4 text-xs text-red-400">{plansError}</p>
      )}

      <FormField label="Plan de membresía" id="grant-cash-plan">
        <select
          id="grant-cash-plan"
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
          disabled={isLoading || plans.length === 0}
          className={inputCls(false)}
        >
          <option value="">
            {plans.length === 0 && !plansError ? 'Cargando planes…' : 'Seleccioná un plan'}
          </option>
          {plans.map((p) => (
            <option key={p.membershipPlanId} value={p.membershipPlanId}>
              {p.type} — {formatMoney(p.price)}
            </option>
          ))}
        </select>
      </FormField>

      <button
        id="btn-grant-cash-membership"
        onClick={handleGrant}
        disabled={isLoading || !selectedPlanId}
        className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-400 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Otorgando…' : 'Otorgar membresía'}
      </button>
    </div>
  )
}

export default GrantCashMembershipCard
