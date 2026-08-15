import { FaUsers } from 'react-icons/fa'
import AttendanceRoster from '../../../shared/AttendanceRoster'

const GymClassInscribedClientsCard = ({ classId, hasClassStarted, clients, onSaved }) => {
  if (!clients || clients.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaUsers className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Clientes inscriptos</h2>
        </div>
        <p className="text-sm text-zinc-500">Todavía no hay clientes inscriptos.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaUsers className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Clientes inscriptos</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {clients.length}
        </span>
      </div>

      <AttendanceRoster
        classId={classId}
        hasClassStarted={hasClassStarted}
        clients={clients}
        onSaved={onSaved}
        showEmail
      />
    </div>
  )
}

export default GymClassInscribedClientsCard
