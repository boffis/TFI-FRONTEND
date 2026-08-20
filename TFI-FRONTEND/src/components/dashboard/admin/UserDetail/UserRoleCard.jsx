import { useState } from 'react'
import { FaUserShield } from 'react-icons/fa'
import useFetch from '../../../../hooks/useFetch'
import { roleLabel } from '../../../../utils/formatters'
import { explainApiError } from '../../../../utils/errorMessages'

// Wire values: sent verbatim as `newRole`, so they stay English.
const ROLES = ['Client', 'Trainer', 'Admin']

const ROLE_BADGE = {
  Client:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Trainer: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Admin:   'bg-rose-500/15 text-rose-400 border-rose-500/30',
}

const UserRoleCard = ({ userData, onUpdated }) => {
  const { patch, isLoading } = useFetch()

  const [selectedRole, setSelectedRole] = useState(userData.role)
  const [feedback, setFeedback] = useState(null)

  const handleChangeRole = () => {
    if (selectedRole === userData.role) return
    setFeedback(null)
    patch(
      `user/${userData.userId}/role?newRole=${encodeURIComponent(selectedRole)}`,
      true,
      null,
      () => {
        setFeedback({ type: 'success', msg: `Rol actualizado a ${roleLabel(selectedRole)}.` })
        onUpdated()
      },
      (err) => setFeedback({ type: 'error', msg: explainApiError(err, 'No se pudo cambiar el rol.') })
    )
  }

  const badgeClass = ROLE_BADGE[selectedRole] ?? 'bg-zinc-700/30 text-zinc-400'

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <FaUserShield className="text-orange-500" />
        <h2 className="text-base font-bold text-white">Cambiar rol</h2>
      </div>

      {feedback && (
        <div className={`mb-4 rounded-xl border px-3 py-2 text-xs font-medium ${
          feedback.type === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-red-500/30 bg-red-500/10 text-red-400'
        }`}>
          {feedback.msg}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2">
        {ROLES.map((role) => {
          const isSelected = selectedRole === role
          const bc = ROLE_BADGE[role]
          return (
            <button
              key={role}
              id={`role-option-${role.toLowerCase()}`}
              onClick={() => setSelectedRole(role)}
              className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer
                ${isSelected
                  ? `${bc} ring-1 ring-inset ring-current`
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                }`}
            >
              {roleLabel(role)}
              {isSelected && <span className="text-xs font-bold uppercase tracking-widest">✓ Seleccionado</span>}
            </button>
          )
        })}
      </div>

      <button
        id="btn-confirm-role-change"
        onClick={handleChangeRole}
        disabled={isLoading || selectedRole === userData.role}
        className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-400 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Actualizando…' : 'Confirmar cambio de rol'}
      </button>
    </div>
  )
}

export default UserRoleCard
