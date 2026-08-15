import { useNavigate } from 'react-router'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'
import { DAY_NAMES } from '../../../../utils/formatters'

const BoolBadge = ({ value, trueLabel = 'Sí', falseLabel = 'No' }) =>
  value
    ? <span className="flex items-center gap-1.5 text-emerald-400"><FaCircleCheck /> {trueLabel}</span>
    : <span className="flex items-center gap-1.5 text-red-400"><FaCircleXmark /> {falseLabel}</span>

const ClassScheduleTableRow = ({ schedule }) => {
  const navigate = useNavigate()

  const timeLabel = schedule.timeOfDay
    ? schedule.timeOfDay.toString().slice(0, 5)   // "HH:MM:SS" → "HH:MM"
    : '—'

  const dayLabel = DAY_NAMES[schedule.dayOfWeek] ?? String(schedule.dayOfWeek)

  const trainerName =
    schedule.trainer?.name ??
    schedule.trainer?.fullName ??
    (schedule.trainerId ? `ID: ${schedule.trainerId.slice(0, 8)}…` : '—')

  const description = schedule.classDescription
    ? schedule.classDescription.length > 50
      ? schedule.classDescription.slice(0, 50) + '…'
      : schedule.classDescription
    : '—'

  return (
    <tr
      onClick={() => navigate(`/admin/gymclassschedule/${schedule.gymClassScheduleId}`)}
      className="
        group border-b border-zinc-800/60
        hover:bg-zinc-800/50 cursor-pointer
        transition-colors duration-150
      "
    >
      <td className="px-4 py-3 font-medium text-white group-hover:text-orange-400 transition-colors duration-150 whitespace-nowrap">
        {schedule.className}
      </td>
      <td className="px-4 py-3 text-zinc-400 max-w-[200px]">{description}</td>
      <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">{trainerName}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{dayLabel}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{timeLabel}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap text-center">{schedule.maxCapacity}</td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">
        <BoolBadge value={schedule.isWeekly} trueLabel="Semanal" falseLabel="Puntual" />
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">
        <BoolBadge value={schedule.isActive} trueLabel="Activo" falseLabel="Inactivo" />
      </td>
    </tr>
  )
}

export default ClassScheduleTableRow
