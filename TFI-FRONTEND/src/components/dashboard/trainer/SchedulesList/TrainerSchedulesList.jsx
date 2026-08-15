import { useContext, useEffect, useState } from 'react'
import useFetch from '../../../../hooks/useFetch'
import { AuthContext } from '../../../../services/authContext/AuthContext'
import TrainerScheduleCard from './TrainerScheduleCard'

const TrainerSchedulesList = () => {
  const { user } = useContext(AuthContext)
  const { get, isLoading } = useFetch()

  const [schedules, setSchedules] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    get(
      'GymClassSchedule',
      true,
      (data) => setSchedules(Array.isArray(data) ? data : []),
      (err) => setError(err?.message ?? 'No se pudieron cargar tus horarios.')
    )
  }, [])

  const handleUpdated = (gymClassScheduleId, patch) => {
    setSchedules((prev) =>
      prev.map((s) => (s.gymClassScheduleId === gymClassScheduleId ? { ...s, ...patch } : s))
    )
  }

  if (isLoading && schedules.length === 0) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-zinc-800/60" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-10 text-center">
        <p className="font-semibold text-red-400">{error}</p>
        <p className="mt-1 text-sm text-zinc-500">Intentá de nuevo más tarde.</p>
      </div>
    )
  }

  if (schedules.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-16 text-center">
        <p className="text-lg font-semibold text-zinc-300">No tenés horarios asignados</p>
        <p className="mt-1 text-sm text-zinc-500">Todavía no estás a cargo de ningún horario de clases recurrentes.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {schedules.map((s) => (
        <TrainerScheduleCard
          key={s.gymClassScheduleId}
          scheduleData={s}
          trainerId={user.userId}
          onUpdated={handleUpdated}
        />
      ))}
    </div>
  )
}

export default TrainerSchedulesList
