import { useState } from 'react'
import { FaTrash, FaTriangleExclamation } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import useFetch from '../../../../hooks/useFetch'

const GymClassDeleteCard = ({ classId, classNameStr }) => {
  const { dele, isLoading } = useFetch()
  const navigate = useNavigate()

  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = () => {
    setError(null)
    dele(
      `GymClass/${classId}`,
      true,
      () => navigate('/admin/dashboard'), // Go back to dashboard on success
      (err) => {
        setError(err?.message ?? 'Delete failed.')
        setConfirming(false)
      }
    )
  }

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
      <div className="mb-3 flex items-center gap-2">
        <FaTrash className="text-red-400" />
        <h2 className="text-base font-bold text-red-400">Danger Zone</h2>
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
          {error}
        </div>
      )}

      {!confirming ? (
        <>
          <p className="mb-4 text-xs text-zinc-500">
            Permanently delete this gym class. This action cannot be undone.
          </p>
          <button
            onClick={() => setConfirming(true)}
            className="w-full rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all duration-200 cursor-pointer"
          >
            Delete Class
          </button>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <FaTriangleExclamation className="mt-0.5 shrink-0 text-amber-400" />
            <p className="text-xs text-amber-300">
              Are you sure you want to delete <strong>{classNameStr}</strong>? This cannot be undone.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-500 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Deleting…' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GymClassDeleteCard
