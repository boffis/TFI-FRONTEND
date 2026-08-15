import { FaDumbbell } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import AttendanceBadge from '../../../shared/AttendanceBadge'
import { formatDateTime } from '../../../../utils/formatters'

const UserInscriptionsCard = ({ inscriptions }) => {
  const navigate = useNavigate()

  if (!inscriptions || inscriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaDumbbell className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Inscripciones a clases</h2>
        </div>
        <p className="text-sm text-zinc-500">No se encontraron inscripciones a clases.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaDumbbell className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Inscripciones a clases</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {inscriptions.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {inscriptions.map((ins) => (
          <div
            key={ins.inscriptionId}
            onClick={() => navigate(`/admin/gymclass/${ins.gymClassId}`)}
            className="cursor-pointer rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-4 hover:border-orange-500/40 hover:bg-zinc-800/60 transition-all duration-200"
          >
            <div className="mb-1 flex items-center gap-2">
              <FaDumbbell className="text-orange-500/70 text-xs" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500/80">Clase</span>
            </div>
            <p className="text-sm font-bold text-white">{ins.className || '—'}</p>
            <p className="mt-1 text-xs text-zinc-400">{formatDateTime(ins.schedule)}</p>
            <div className="mt-2">
              <AttendanceBadge status={ins.attendanceStatus} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserInscriptionsCard
