import { FaIdCard } from 'react-icons/fa'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'
import { useContext, useState } from 'react'
import { AuthContext } from '../../../../services/authContext/AuthContext'
import { getApiUrl } from '../../../../utils/apiUrl'

const UserMembershipsCard = ({ memberships, allowCancel = false }) => {
  const { user, handleCancelMembership } = useContext(AuthContext)
  const [cancellingId, setCancellingId] = useState(null)

  const handleCancelClick = async (membershipId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;
    
    setCancellingId(membershipId)
    try {
      const response = await fetch(getApiUrl(`Payment/Unsubscribe/${membershipId}`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      })

      if (!response.ok) {
        let errorMsg = 'Failed to cancel subscription'
        try {
          const err = await response.json()
          errorMsg = err.detail || errorMsg
        } catch {}
        throw new Error(errorMsg)
      }

      const result = await response.json()
      alert(result.message || 'Subscription cancelled successfully.')
      handleCancelMembership(membershipId)
    } catch (error) {
      console.error('Cancel subscription error:', error)
      alert(error.message || 'Failed to cancel subscription. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }
  if (!memberships || memberships.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaIdCard className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Memberships</h2>
        </div>
        <p className="text-sm text-zinc-500">No memberships found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaIdCard className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Memberships</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {memberships.length}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {memberships.map((m) => {
          const expDate = m.expirationDate ? new Date(m.expirationDate) : null
          const isActive = expDate && expDate > new Date()
          const isCancelled = m.isCancelled
          const formattedExp = expDate
            ? expDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—'

          return (
            <div
              key={m.membershipId}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                isCancelled
                  ? 'border-orange-500/30 bg-orange-500/5'
                  : isActive
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-zinc-700/50 bg-zinc-800/30'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-white">
                  {m.membershipPlan?.name ?? 'Membership Plan'}
                </span>
                {isCancelled
                  ? <span className="flex items-center gap-1 text-xs font-semibold text-orange-400"><FaCircleXmark /> Cancelled</span>
                  : isActive
                  ? <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400"><FaCircleCheck /> Active</span>
                  : <span className="flex items-center gap-1 text-xs font-semibold text-red-400"><FaCircleXmark /> Expired</span>
                }
              </div>

              <div className="space-y-1 text-xs text-zinc-500">
                <p><span className="text-zinc-400">Expires:</span> {formattedExp}</p>
                {m.membershipPlan?.price !== undefined && (
                  <p><span className="text-zinc-400">Price:</span> ${m.membershipPlan.price?.toFixed(2)}</p>
                )}
                {m.membershipPlan?.durationInDays !== undefined && (
                  <p><span className="text-zinc-400">Duration:</span> {m.membershipPlan.durationInDays} days</p>
                )}
                <p className="font-mono pt-1 text-zinc-600">{m.membershipId}</p>
              </div>

              {allowCancel && isActive && !isCancelled && (
                <button
                  onClick={() => handleCancelClick(m.membershipId)}
                  disabled={cancellingId === m.membershipId}
                  className="mt-3 w-full rounded-xl bg-red-500/10 border border-red-500/20 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {cancellingId === m.membershipId ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UserMembershipsCard
