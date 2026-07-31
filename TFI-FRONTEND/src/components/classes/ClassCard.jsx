import { useNavigate } from 'react-router'

/**
 * Formats a date/time string into a human-readable schedule string.
 * e.g. "Monday, Jul 21  ·  09:00 – 10:00"
 * Classes last exactly 1 hour.
 */
const formatSchedule = (schedule) => {
  const start = new Date(schedule)
  const end = new Date(start.getTime() + 60 * 60 * 1000)

  const day = start.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  const fmt = (d) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return `${day}  ·  ${fmt(start)} – ${fmt(end)}`
}

const ClassCard = ({
  classId,
  className,
  trainerName,
  trainerSpecialization,
  schedule,
  maxCapacity,
}) => {
  const navigate = useNavigate()

  return (
    <article
      onClick={() => navigate(`/class/${classId}`)}
      className="group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 transition-all duration-200 hover:border-orange-500/50 hover:bg-zinc-900 hover:shadow-lg hover:shadow-orange-500/5"
    >
      {/* Top accent bar */}
      <span className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-orange-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {/* Class name */}
      <h2 className="text-lg font-bold tracking-tight text-white">{className}</h2>

      {/* Trainer info */}
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-zinc-200">{trainerName}</p>
        <p className="text-xs font-medium uppercase tracking-widest text-orange-500">
          {trainerSpecialization}
        </p>
      </div>

      {/* Divider */}
      <hr className="border-zinc-800" />

      {/* Schedule */}
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>{formatSchedule(schedule)}</span>
      </div>

      {/* Capacity */}
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
        <span>Max {maxCapacity} spots</span>
      </div>

      {/* CTA hint */}
      <p className="mt-auto text-xs font-medium text-zinc-600 transition-colors group-hover:text-orange-500">
        View details →
      </p>
    </article>
  )
}

export default ClassCard
