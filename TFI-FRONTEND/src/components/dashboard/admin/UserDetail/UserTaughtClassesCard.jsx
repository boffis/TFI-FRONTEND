import { FaDumbbell } from 'react-icons/fa'

const UserTaughtClassesCard = ({ taughtClasses }) => {
  if (!taughtClasses || taughtClasses.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaDumbbell className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Taught Classes</h2>
        </div>
        <p className="text-sm text-zinc-500">No taught classes found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaDumbbell className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Taught Classes</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {taughtClasses.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {taughtClasses.map((cls) => (
          <div
            key={cls.gymClassId}
            className="rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-4 hover:border-orange-500/40 hover:bg-zinc-800/60 transition-all duration-200"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
               <div className="flex items-center gap-2">
                   <FaDumbbell className="text-orange-500/70 text-xs" />
                   <span className="text-sm font-bold text-white">{cls.className}</span>
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                 Max: {cls.maxCapacity}
               </span>
            </div>
            {cls.classDescription && (
                <p className="mb-2 text-xs text-zinc-400 line-clamp-2">{cls.classDescription}</p>
            )}
            
            {cls.schedule && (
                 <p className="text-xs text-zinc-500">{cls.schedule}</p>
            )}
           
            {/* Removed gymClassId */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserTaughtClassesCard
