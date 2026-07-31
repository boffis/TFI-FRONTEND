import { useNavigate } from 'react-router'
import { FaCircleCheck, FaCircleXmark, FaStar } from 'react-icons/fa6'

const BoolBadge = ({ value, trueLabel = 'Yes', falseLabel = 'No', trueColor = 'text-emerald-400', falseColor = 'text-red-400' }) =>
  value
    ? <span className={`flex items-center gap-1.5 ${trueColor}`}><FaCircleCheck /> {trueLabel}</span>
    : <span className={`flex items-center gap-1.5 ${falseColor}`}><FaCircleXmark /> {falseLabel}</span>

const ClassInstanceTableRow = ({ instance }) => {
  const navigate = useNavigate()

  // "Is Special" = true when the class has NO linked schedule (one-off / ad-hoc)
  const isSpecial = !instance.gymClassScheduleId

  const scheduleDate = instance.schedule
    ? new Date(instance.schedule).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '—'

  const description = instance.classDescription
    ? instance.classDescription.length > 50
      ? instance.classDescription.slice(0, 50) + '…'
      : instance.classDescription
    : '—'

  const inscriptions = Number(instance.inscriptionAmount ?? 0)

  return (
    <tr
      onClick={() => navigate(`/admin/gymclass/${instance.gymClassId}`)}
      className="
        group border-b border-zinc-800/60
        hover:bg-zinc-800/50 cursor-pointer
        transition-colors duration-150
      "
    >
      <td className="px-4 py-3 font-medium text-white group-hover:text-orange-400 transition-colors duration-150 whitespace-nowrap">
        {instance.className}
      </td>
      <td className="px-4 py-3 text-zinc-400 max-w-[200px]">{description}</td>
      <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">{instance.trainerName || '—'}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{scheduleDate}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap text-center">{instance.maxCapacity}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap text-center">
        <span className={`font-semibold ${inscriptions >= instance.maxCapacity ? 'text-red-400' : 'text-zinc-300'}`}>
          {inscriptions}
        </span>
        <span className="text-zinc-600"> / {instance.maxCapacity}</span>
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">
        {isSpecial
          ? <span className="flex items-center gap-1.5 text-amber-400"><FaStar /> Special</span>
          : <span className="text-zinc-600">—</span>
        }
      </td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">
        {instance.isClassDeleted
          ? <span className="inline-block rounded-full border border-red-500/30 bg-red-500/10 px-3 py-0.5 text-xs font-bold text-red-400">Deleted</span>
          : <span className="text-zinc-600">—</span>
        }
      </td>
    </tr>
  )
}

export default ClassInstanceTableRow
