import { useState } from 'react'
import { FaTrash, FaTriangleExclamation, FaArrowRotateLeft } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import useFetch from '../../../../hooks/useFetch'

/**
 * Discontinuing is a soft delete, so this card is deliberately not phrased as a deletion: the plan
 * row and its history survive, and every client already on it keeps the access they paid for until
 * their own expiration date — only the recurring charge stops. That makes it reversible, hence the
 * restore branch below.
 */
const MembershipPlanDeleteCard = ({ planId, planName, isDiscontinued, onRestored }) => {
  const { dele, post, isLoading } = useFetch()
  const navigate = useNavigate()

  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState(null)

  const handleDiscontinue = () => {
    setError(null)
    dele(
      `MembershipPlan/${planId}`,
      true,
      () => navigate('/admin/dashboard'), // Go back to dashboard on success
      (err) => {
        setError(err?.message ?? 'No se pudo discontinuar el plan.')
        setConfirming(false)
      }
    )
  }

  const handleRestore = () => {
    setError(null)
    post(
      `MembershipPlan/${planId}/restore`,
      true,
      null,
      () => onRestored?.(),
      (err) => setError(err?.message ?? 'No se pudo restaurar el plan.')
    )
  }

  if (isDiscontinued) {
    return (
      <div className="rounded-2xl border border-zinc-700 bg-zinc-800/40 p-6">
        <div className="mb-3 flex items-center gap-2">
          <FaArrowRotateLeft className="text-zinc-400" />
          <h2 className="text-base font-bold text-zinc-300">Plan discontinuado</h2>
        </div>

        {error && (
          <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
            {error}
          </div>
        )}

        <p className="mb-4 text-xs text-zinc-500">
          Restaurá el plan para volver a ofrecerlo y poder editarlo. Las suscripciones que se
          dieron de baja al discontinuarlo no se reactivan: esos clientes tienen que volver a
          suscribirse cuando venza su membresía.
        </p>

        <button
          onClick={handleRestore}
          disabled={isLoading}
          className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Restaurando…' : 'Restaurar plan'}
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
      <div className="mb-3 flex items-center gap-2">
        <FaTrash className="text-red-400" />
        <h2 className="text-base font-bold text-red-400">Zona de riesgo</h2>
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
          {error}
        </div>
      )}

      {!confirming ? (
        <>
          <p className="mb-4 text-xs text-zinc-500">
            Dejá de ofrecer este plan. Nadie va a poder contratarlo ni recibirlo, y desaparece de la
            página de precios. Podés restaurarlo más adelante.
          </p>
          <button
            onClick={() => setConfirming(true)}
            className="w-full rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all duration-200 cursor-pointer"
          >
            Discontinuar plan
          </button>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <FaTriangleExclamation className="mt-0.5 shrink-0 text-amber-400" />
            <div className="space-y-2 text-xs text-amber-300">
              <p>
                ¿Seguro que querés discontinuar <strong>{planName || 'este plan'}</strong>?
              </p>
              <p>
                Los clientes que ya lo tienen mantienen su membresía hasta la fecha de vencimiento,
                pero no se les va a cobrar de nuevo. Se les avisa por correo.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDiscontinue}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-500 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Discontinuando…' : 'Sí, discontinuar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MembershipPlanDeleteCard
