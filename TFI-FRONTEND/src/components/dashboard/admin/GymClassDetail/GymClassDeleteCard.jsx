import { useState } from 'react'
import { FaTrash, FaTriangleExclamation } from 'react-icons/fa6'
import { FaEnvelope } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import useFetch from '../../../../hooks/useFetch'

const GymClassDeleteCard = ({ classId, classNameStr, enrolledCount = 0 }) => {
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
        setError(err?.message ?? 'No se pudo eliminar la clase.')
        setConfirming(false)
      }
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
            Eliminá esta clase de forma permanente. Esta acción no se puede deshacer.
          </p>
          <button
            onClick={() => setConfirming(true)}
            className="w-full rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all duration-200 cursor-pointer"
          >
            Eliminar clase
          </button>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <FaTriangleExclamation className="mt-0.5 shrink-0 text-amber-400" />
            <p className="text-xs text-amber-300">
              ¿Seguro que querés eliminar <strong>{classNameStr}</strong>? Esta acción no se puede deshacer.
            </p>
          </div>

          {enrolledCount > 0 && (
            <div className="flex items-start gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-3 py-2">
              <FaEnvelope className="mt-0.5 shrink-0 text-zinc-400" />
              <p className="text-xs text-zinc-400">
                Se les avisará por correo a {enrolledCount} {enrolledCount === 1 ? 'cliente inscripto' : 'clientes inscriptos'} que
                la clase fue cancelada.
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-500 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Eliminando…' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GymClassDeleteCard
