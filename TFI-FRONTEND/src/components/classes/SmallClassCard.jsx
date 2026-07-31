import { useNavigate } from 'react-router'

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

const SmallClassCard = ({ gymClassId, className, schedule, trainer, maxCapacity, inscribedClients }) => {
  const navigate = useNavigate()
  const isFull = inscribedClients?.length >= maxCapacity

  return (
    <div
      onClick={() => navigate(`/class/${gymClassId}`)}
      className="group flex cursor-pointer items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-800/50"
    >
      <div>
        <p className="font-semibold text-zinc-100">{formatSchedule(schedule)}</p>
        <p className="text-sm text-zinc-400">Trainer: {trainer?.name}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`text-xs font-medium uppercase tracking-widest ${isFull ? 'text-red-400' : 'text-green-400'}`}>
          {isFull ? 'Full' : 'Available'}
        </span>
        <span className="text-xs text-zinc-500">
          {inscribedClients?.length ?? 0} / {maxCapacity} spots
        </span>
      </div>
    </div>
  )
}

export default SmallClassCard
