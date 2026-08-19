import { FaDumbbell, FaXmark, FaChevronDown, FaChevronUp, FaClockRotateLeft } from 'react-icons/fa6'
import { useContext, useMemo, useState } from 'react'
import { AuthContext } from '../../services/authContext/AuthContext'
import useFetch from '../../hooks/useFetch'
import { formatDateTime } from '../../utils/formatters'

const AccountInscriptionsCard = () => {
  const { user, handleDisenrollClass } = useContext(AuthContext)
  const { dele, isLoading } = useFetch()
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState(null)
  const [showPast, setShowPast] = useState(false)

  const inscriptions = user?.inscriptions

  // Past classes can't be left, so they're opt-in history without a cancel button.
  const { upcoming, past } = useMemo(() => {
    const now = Date.now()
    const list = inscriptions ?? []
    const time = (ins) => (ins.schedule ? new Date(ins.schedule).getTime() : 0)

    return {
      upcoming: list.filter((ins) => time(ins) > now).sort((a, b) => time(a) - time(b)),
      past: list.filter((ins) => time(ins) <= now).sort((a, b) => time(b) - time(a)),
    }
  }, [inscriptions])

  if (!inscriptions || inscriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaDumbbell className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Mis clases</h2>
        </div>
        <p className="text-sm text-zinc-500">No estás inscripto en ninguna clase.</p>
      </div>
    )
  }

  const handleLeave = (gymClassId, inscriptionId) => {
    setDeletingId(inscriptionId)
    setError(null)

    dele(
      `GymClass/${gymClassId}/leave/${user?.userId}`,
      true,
      () => {
        handleDisenrollClass(gymClassId)
        setDeletingId(null)
      },
      (err) => {
        setError(err?.message ?? 'No se pudo cancelar la inscripción.')
        setDeletingId(null)
      }
    )
  }

  const renderInscription = (ins, isPast) => (
    <div
      key={ins.inscriptionId}
      className={`flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
        isPast
          ? 'border-zinc-800 bg-zinc-800/20'
          : 'border-zinc-700/50 bg-zinc-800/40 hover:border-orange-500/40 hover:bg-zinc-800/60'
      }`}
    >
      <div>
        <div className="mb-1 flex items-center gap-2">
          <FaDumbbell className={isPast ? 'text-zinc-600 text-xs' : 'text-orange-500/70 text-xs'} />
          <span className={`text-xs font-bold uppercase tracking-widest ${isPast ? 'text-zinc-600' : 'text-orange-500/80'}`}>
            Clase
          </span>
        </div>
        <p className={`text-sm font-bold ${isPast ? 'text-zinc-400' : 'text-white'}`}>{ins.className || '—'}</p>
        <p className="mt-1 text-xs text-zinc-400">{formatDateTime(ins.schedule)}</p>
        {ins.trainerName && (
          <p className="mt-1 text-xs text-zinc-500">Profesor: {ins.trainerName}</p>
        )}
      </div>
      {isPast ? (
        <span className="mt-4 flex items-center justify-center rounded-lg bg-zinc-800/60 py-1.5 text-xs font-semibold text-zinc-500">
          Finalizada
        </span>
      ) : (
        <button
          onClick={() => handleLeave(ins.gymClassId, ins.inscriptionId)}
          disabled={isLoading && deletingId === ins.inscriptionId}
          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-zinc-800 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <FaXmark />
          {(isLoading && deletingId === ins.inscriptionId) ? 'Cancelando...' : 'Cancelar inscripción'}
        </button>
      )}
    </div>
  )

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaDumbbell className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Mis clases</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {upcoming.length}
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
          {error}
        </div>
      )}

      {upcoming.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((ins) => renderInscription(ins, false))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">No tenés clases próximas.</p>
      )}

      {past.length > 0 && (
        <div className="mt-5 border-t border-zinc-800 pt-5">
          <button
            onClick={() => setShowPast((prev) => !prev)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-orange-500 transition-colors cursor-pointer"
          >
            <FaClockRotateLeft />
            {showPast ? 'Ocultar clases pasadas' : `Ver clases pasadas (${past.length})`}
            {showPast ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {showPast && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((ins) => renderInscription(ins, true))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AccountInscriptionsCard
