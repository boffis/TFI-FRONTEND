import { useNavigate } from 'react-router'
import { DAY_NAMES } from '../../utils/formatters'

/** C# TimeSpan ("HH:mm:ss") to "HH:mm – HH:mm", assuming a 1-hour class. */
const formatTimeOfDay = (timeOfDay) => {
  const [h, m] = timeOfDay.split(':').map(Number)
  const pad = (n) => String(n).padStart(2, '0')
  const endH = (h + 1) % 24
  return `${pad(h)}:${pad(m)} – ${pad(endH)}:${pad(m)}`
}

const ScheduledClassCard = ({
  classId,
  className,
  trainerName,
  trainerSpecialization,
  dayOfWeek,
  timeOfDay,
  maxCapacity,
}) => {
  const navigate = useNavigate()
  const dayName = DAY_NAMES[dayOfWeek] ?? 'Desconocido'
  const timeRange = formatTimeOfDay(timeOfDay)

  return (
    <article
      onClick={() => navigate(`/schedule/${classId}`)}
      className="group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 transition-all duration-200 hover:border-blue-500/50 hover:bg-zinc-900 hover:shadow-lg hover:shadow-blue-500/5"
    >
      {/* Blue, to distinguish from special classes. */}
      <span className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-blue-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <span className="self-start rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-blue-400">
        Semanal
      </span>

      <h2 className="text-lg font-bold tracking-tight text-white">{className}</h2>

      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-zinc-200">{trainerName}</p>
        <p className="text-xs font-medium uppercase tracking-widest text-blue-400">
          {trainerSpecialization}
        </p>
      </div>

      <hr className="border-zinc-800" />

      <div className="flex items-start gap-2 text-sm text-zinc-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          Todos los {dayName}
          <span className="mx-1.5 text-zinc-600">·</span>
          {timeRange}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 shrink-0 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a4 4 0 00-5.916-3.51M9 20H4v-2a4 4 0 015.916-3.51M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span>Máx. {maxCapacity} lugares</span>
      </div>

      <p className="mt-auto text-xs font-medium text-zinc-600 transition-colors group-hover:text-blue-400">
        Ver detalles →
      </p>
    </article>
  )
}

export default ScheduledClassCard
