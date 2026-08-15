import { useContext, useEffect, useMemo, useState } from 'react'
import useFetch from '../../../../hooks/useFetch'
import { AuthContext } from '../../../../services/authContext/AuthContext'
import TrainerClassCard from './TrainerClassCard'

const TrainerClassesList = () => {
  const { user } = useContext(AuthContext)
  const { get, isLoading } = useFetch()

  const [classes, setClasses] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.userId) return
    get(
      `GymClass/ClassesByTrainer/${user.userId}`,
      true,
      (data) => setClasses(Array.isArray(data) ? data : []),
      (err) => setError(err?.message ?? 'No se pudieron cargar tus clases.')
    )
  }, [user?.userId])

  const upcomingClasses = useMemo(() => {
    const now = Date.now()
    return classes
      .filter((c) => new Date(c.schedule).getTime() > now)
      .sort((a, b) => new Date(a.schedule) - new Date(b.schedule))
  }, [classes])

  const handleUpdated = (gymClassId, patch) => {
    setClasses((prev) => prev.map((c) => (c.gymClassId === gymClassId ? { ...c, ...patch } : c)))
  }

  if (isLoading && classes.length === 0) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl bg-zinc-800/60" />
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

  if (upcomingClasses.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-16 text-center">
        <p className="text-lg font-semibold text-zinc-300">No hay clases próximas</p>
        <p className="mt-1 text-sm text-zinc-500">No tenés clases programadas a futuro.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {upcomingClasses.map((cls) => (
        <TrainerClassCard
          key={cls.gymClassId}
          classData={cls}
          trainerId={user.userId}
          onUpdated={handleUpdated}
        />
      ))}
    </div>
  )
}

export default TrainerClassesList
