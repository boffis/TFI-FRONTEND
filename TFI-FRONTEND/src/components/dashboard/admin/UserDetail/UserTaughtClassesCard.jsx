import { FaCalendar, FaDumbbell } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { formatDateTime } from '../../../../utils/formatters'

// `clickable` is opt-in because the card is shared: the admin user detail links each class
// through to the admin class detail, while a trainer looking at their own account has no
// business on that route, so there the cards are plain, non-interactive tiles.
const UserTaughtClassesCard = ({ taughtClasses, clickable = false }) => {
  const navigate = useNavigate()

  if (!taughtClasses || taughtClasses.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaDumbbell className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Clases dictadas</h2>
        </div>
        <p className="text-sm text-zinc-500">No se encontraron clases dictadas.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaDumbbell className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Clases dictadas</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {taughtClasses.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {taughtClasses.map((cls) => (
          <div
            key={cls.gymClassId}
            onClick={clickable ? () => navigate(`/admin/gymclass/${cls.gymClassId}`) : undefined}
            className={`rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-4 transition-all duration-200 ${
              clickable ? 'cursor-pointer hover:border-orange-500/40 hover:bg-zinc-800/60' : ''
            }`}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
               <div className="flex items-center gap-2">
                   <FaDumbbell className="text-orange-500/70 text-xs" />
                   <span className="text-sm font-bold text-white">{cls.className}</span>
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                 Máx.: {cls.maxCapacity}
               </span>
            </div>
            {cls.classDescription && (
                <p className="mb-2 text-xs text-zinc-400 line-clamp-2">{cls.classDescription}</p>
            )}

            {cls.schedule && (
                 <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                   <FaCalendar className="text-orange-500/70 text-[10px]" />
                   {formatDateTime(cls.schedule)}
                 </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserTaughtClassesCard
