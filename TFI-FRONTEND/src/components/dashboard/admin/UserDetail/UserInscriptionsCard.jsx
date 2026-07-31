import { FaDumbbell } from 'react-icons/fa'

const UserInscriptionsCard = ({ inscriptions }) => {
  if (!inscriptions || inscriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaDumbbell className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Class Inscriptions</h2>
        </div>
        <p className="text-sm text-zinc-500">No class inscriptions found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaDumbbell className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Class Inscriptions</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {inscriptions.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {inscriptions.map((ins) => (
          <div
            key={ins.inscriptionId}
            className="rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-4 hover:border-orange-500/40 hover:bg-zinc-800/60 transition-all duration-200"
          >
            <div className="mb-1 flex items-center gap-2">
              <FaDumbbell className="text-orange-500/70 text-xs" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500/80">Class</span>
            </div>
            <p className="text-xs font-mono text-zinc-500 break-all">{ins.gymClassId}</p>
            <p className="mt-2 text-[10px] font-mono text-zinc-700 break-all">{ins.inscriptionId}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserInscriptionsCard
