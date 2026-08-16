import { useNavigate } from 'react-router'
import { FaDumbbell, FaUsers } from 'react-icons/fa'
import { FaCircleXmark } from 'react-icons/fa6'

const GymClassScheduleInstancesCard = ({ gymClasses }) => {
  const navigate = useNavigate()

  if (!gymClasses || gymClasses.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaDumbbell className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Clases generadas</h2>
        </div>
        <p className="text-sm text-zinc-500">Todavía no se generaron clases para este horario.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaDumbbell className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Clases generadas</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {gymClasses.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gymClasses.map((cls) => {
          const date = cls.schedule 
            ? new Date(cls.schedule).toLocaleString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : '—'
            
          const taken = Number(cls.inscriptionCount ?? 0)
          const isFull = taken >= cls.maxCapacity

          return (
            <div
              key={cls.gymClassId}
              onClick={() => navigate(`/admin/gymclass/${cls.gymClassId}`)}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                  cls.isClassDeleted
                  ? 'border-red-500/20 bg-red-500/5'
                  : 'border-zinc-700/50 bg-zinc-800/40 hover:border-orange-500/40 hover:bg-zinc-800/60'
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-bold text-white">{cls.className}</p>
                {cls.isClassDeleted && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-red-400">
                        <FaCircleXmark /> Eliminada
                    </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1">{date}</p>
              <p className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${isFull ? 'text-red-400' : 'text-zinc-400'}`}>
                <FaUsers />
                {taken} / {cls.maxCapacity}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GymClassScheduleInstancesCard
