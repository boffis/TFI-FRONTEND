import { FaDumbbell, FaXmark } from 'react-icons/fa6'
import { useContext, useState } from 'react'
import { AuthContext } from '../../services/authContext/AuthContext'
import useFetch from '../../hooks/useFetch'

const AccountInscriptionsCard = () => {
  const { user, handleDisenrollClass } = useContext(AuthContext)
  const { dele, isLoading } = useFetch()
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState(null)

  const inscriptions = user?.inscriptions

  if (!inscriptions || inscriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaDumbbell className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">My Classes</h2>
        </div>
        <p className="text-sm text-zinc-500">You are not enrolled in any classes.</p>
      </div>
    )
  }

  const handleLeave = (gymClassId, inscriptionId) => {
    setDeletingId(inscriptionId)
    setError(null)
    
    // Assuming backend endpoint is something like DELETE /gymclass/{classId}/inscription/{inscriptionId} 
    // or DELETE /inscription/{inscriptionId}
    // Let's use the latter for simplicity, assuming typical REST.
    dele(
      `inscription/${inscriptionId}`,
      true,
      () => {
        handleDisenrollClass(gymClassId)
        setDeletingId(null)
      },
      (err) => {
        setError(err?.message ?? 'Failed to leave class.')
        setDeletingId(null)
      }
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaDumbbell className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">My Classes</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {inscriptions.length}
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {inscriptions.map((ins) => (
          <div
            key={ins.inscriptionId}
            className="flex flex-col justify-between rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-4 hover:border-orange-500/40 hover:bg-zinc-800/60 transition-all duration-200"
          >
            <div>
              <div className="mb-1 flex items-center gap-2">
                <FaDumbbell className="text-orange-500/70 text-xs" />
                <span className="text-xs font-bold uppercase tracking-widest text-orange-500/80">Class</span>
              </div>
              <p className="text-xs font-mono text-zinc-500 break-all">{ins.gymClassId}</p>
              <p className="mt-2 text-[10px] font-mono text-zinc-700 break-all">{ins.inscriptionId}</p>
            </div>
            <button
              onClick={() => handleLeave(ins.gymClassId, ins.inscriptionId)}
              disabled={isLoading && deletingId === ins.inscriptionId}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-zinc-800 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <FaXmark />
              {(isLoading && deletingId === ins.inscriptionId) ? 'Leaving...' : 'Leave Class'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AccountInscriptionsCard
