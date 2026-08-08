import { FaIdCard } from 'react-icons/fa'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'
import { useContext, useState } from 'react'
import { AuthContext } from '../../../../services/authContext/AuthContext'
import { getApiUrl } from '../../../../utils/apiUrl'

const UserMembershipsCard = ({ memberships, allowCancel = false }) => {
  const { user, handleCancelMembership } = useContext(AuthContext)
  const [cancellingId, setCancellingId] = useState(null)
  const [modalState, setModalState] = useState({ isOpen: false, type: '', message: '', onConfirm: null })

  const closeDialog = () => setModalState({ isOpen: false, type: '', message: '', onConfirm: null })

  const handleCancelClick = (membershipId) => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      message: 'Are you sure you want to cancel this subscription?',
      onConfirm: () => performCancel(membershipId)
    })
  }

  const performCancel = async (membershipId) => {
    closeDialog()
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
      setModalState({ isOpen: true, type: 'success', message: result.message || 'Subscription cancelled successfully.' })
      handleCancelMembership(membershipId)
    } catch (error) {
      console.error('Cancel subscription error:', error)
      setModalState({ isOpen: true, type: 'error', message: error.message || 'Failed to cancel subscription. Please try again.' })
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

      {/* Modal Overlay */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className={`text-lg font-bold mb-2 ${
              modalState.type === 'error' ? 'text-red-500' :
              modalState.type === 'success' ? 'text-emerald-500' :
              'text-white'
            }`}>
              {modalState.type === 'confirm' ? 'Confirm Cancellation' : 
               modalState.type === 'error' ? 'Error' : 'Success'}
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              {modalState.message}
            </p>
            <div className="flex justify-end gap-3">
              {modalState.type === 'confirm' ? (
                <>
                  <button onClick={closeDialog} className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                    Keep Subscription
                  </button>
                  <button onClick={modalState.onConfirm} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                    Yes, Cancel
                  </button>
                </>
              ) : (
                <button onClick={closeDialog} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMembershipsCard
