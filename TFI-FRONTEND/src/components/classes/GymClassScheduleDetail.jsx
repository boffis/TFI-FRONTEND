import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Layout from '../layout/Layout'
import useFetch from '../../hooks/useFetch'
import SmallClassCard from './SmallClassCard'
import { DAY_NAMES } from '../../utils/formatters'

const formatTimeOfDay = (timeOfDay) => {
  if (!timeOfDay) return ''
  const [h, m] = timeOfDay.split(':').map(Number)
  const pad = (n) => String(n).padStart(2, '0')
  const endH = (h + 1) % 24
  return `${pad(h)}:${pad(m)} – ${pad(endH)}:${pad(m)}`
}

const GymClassScheduleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { get, isLoading } = useFetch()
  const [scheduleData, setScheduleData] = useState(null)

  useEffect(() => {
    get(`GymClassSchedule/${id}`, true, (data) => setScheduleData(data))
  }, [id])

  if (isLoading && !scheduleData) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-blue-500" />
        </div>
      </Layout>
    )
  }

  if (!scheduleData) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-bold text-white">Horario no encontrado</h1>
          <p className="text-zinc-400">El horario que buscás no existe o fue eliminado.</p>
          <button onClick={() => navigate('/classes')} className="text-blue-500 hover:underline">
            ← Volver a clases
          </button>
        </div>
      </Layout>
    )
  }

  const {
    className,
    classDescription,
    maxCapacity,
    dayOfWeek,
    timeOfDay,
    trainer,
    gymClasses
  } = scheduleData

  const dayName = DAY_NAMES[dayOfWeek] ?? 'Desconocido'
  const timeRange = formatTimeOfDay(timeOfDay)

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <button 
          onClick={() => navigate('/classes')}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white"
        >
          <span>←</span> Volver a clases
        </button>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
          {/* Header Section */}
          <div className="relative border-b border-zinc-800 p-8 sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
                Horario semanal
              </span>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {className}
                </h1>
                <p className="mt-2 text-lg text-zinc-400">{classDescription || 'Sin descripción.'}</p>
              </div>
            </div>
          </div>

          {/* Details & Upcoming Classes Section */}
          <div className="grid gap-8 p-8 sm:grid-cols-3 sm:p-10">
            {/* Left Col: Info */}
            <div className="flex flex-col gap-8 sm:col-span-1">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Instructor</h3>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-blue-500 font-bold">
                    {trainer?.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <p className="font-medium text-white">{trainer?.name}</p>
                    {trainer?.specialization && (
                      <p className="text-sm text-zinc-400">{trainer.specialization}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Cuándo</h3>
                <p className="mt-2 font-medium text-white">
                  Todos los {dayName}
                </p>
                <p className="text-sm text-zinc-400">{timeRange}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Capacidad</h3>
                <p className="mt-2 font-medium text-white">{maxCapacity} lugares por clase</p>
              </div>
            </div>

            {/* Right Col: Instances */}
            <div className="sm:col-span-2">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">Próximas sesiones</h3>
              {gymClasses && gymClasses.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {gymClasses.map((instance) => (
                    <SmallClassCard
                      key={instance.gymClassId}
                      gymClassId={instance.gymClassId}
                      className={instance.className}
                      schedule={instance.schedule}
                      trainer={instance.trainer}
                      maxCapacity={instance.maxCapacity}
                      inscriptionCount={instance.inscriptionCount}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
                  <p className="text-zinc-400">No hay próximas sesiones disponibles para este horario.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default GymClassScheduleDetail
