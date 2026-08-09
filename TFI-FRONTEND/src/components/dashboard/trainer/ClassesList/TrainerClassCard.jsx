import { useEffect, useState } from 'react'
import { FaCalendar, FaUsers } from 'react-icons/fa'
import useFetch from '../../../../hooks/useFetch'
import { formatDateTime } from '../../../../utils/formatters'
import EditableNameAndDescription from '../EditableNameAndDescription'

const TrainerClassCard = ({ classData, trainerId, onUpdated }) => {
  const { get, isLoading: loadingClients } = useFetch()
  const { put } = useFetch()

  const [clients, setClients] = useState(null)
  const [clientsError, setClientsError] = useState(null)

  useEffect(() => {
    get(
      `GymClass/${classData.gymClassId}/clients`,
      true,
      (data) => setClients(Array.isArray(data) ? data : []),
      (err) => setClientsError(err?.message ?? 'Failed to load inscribed clients.')
    )
  }, [classData.gymClassId])

  const handleSave = (newName, newDescription, done) => {
    put(
      `GymClass/${classData.gymClassId}`,
      true,
      {
        trainerId,
        className: newName,
        classDescription: newDescription,
        maxCapacity: classData.maxCapacity,
        schedule: classData.schedule,
      },
      () => {
        onUpdated(classData.gymClassId, { className: newName, classDescription: newDescription })
        done(true)
      },
      (err) => done(false, err?.message)
    )
  }

  const spacesLeft = clients ? Math.max(classData.maxCapacity - clients.length, 0) : null

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <EditableNameAndDescription
        name={classData.className}
        description={classData.classDescription}
        onSave={handleSave}
        nameClassName="text-lg font-bold text-white"
        idPrefix={`class-${classData.gymClassId}`}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 text-sm text-zinc-400">
          <FaCalendar className="text-orange-500/70" />
          {formatDateTime(classData.schedule)}
        </span>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${
          spacesLeft === null
            ? 'border-zinc-700 text-zinc-500'
            : spacesLeft === 0
              ? 'border-red-500/30 bg-red-500/10 text-red-400'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
        }`}>
          {spacesLeft === null ? '—' : `${spacesLeft} / ${classData.maxCapacity} spots left`}
        </span>
      </div>

      <div className="mt-4 border-t border-zinc-800 pt-4">
        <div className="mb-2 flex items-center gap-2">
          <FaUsers className="text-orange-500/70 text-xs" />
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Inscribed {clients ? `(${clients.length})` : ''}
          </p>
        </div>

        {loadingClients && !clients && (
          <p className="text-sm text-zinc-600">Loading…</p>
        )}
        {clientsError && (
          <p className="text-sm text-red-400">{clientsError}</p>
        )}
        {clients && clients.length === 0 && (
          <p className="text-sm text-zinc-500">No clients inscribed yet.</p>
        )}
        {clients && clients.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {clients.map((c) => (
              <li
                key={c.clientId}
                className="rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-3 py-1.5 text-sm text-zinc-200"
              >
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TrainerClassCard
