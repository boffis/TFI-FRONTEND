import { useState } from 'react'
import { FaCheck, FaTimes, FaUndo } from 'react-icons/fa'
import useFetch from '../../hooks/useFetch'
import { ATTENDANCE } from '../../utils/attendance'

/**
 * Editable attendance register for one class. Used by both the trainer dashboard and the
 * admin class detail page — the API allows either role to mark, so the difference is only
 * how much client detail each view shows.
 *
 * `hasClassStarted` comes from the API (`hasStarted` on the class payload) rather than being
 * computed here. Class times are stored as gym-local wall-clock values, so only the server can
 * say whether one has passed without the browser having to know the gym's time zone.
 */
const AttendanceRoster = ({ classId, hasClassStarted, clients, onSaved, showEmail = false }) => {
  const { patch, isLoading: isSaving } = useFetch()

  // Draft marks the trainer has made but not yet saved, keyed by clientId.
  const [draft, setDraft] = useState({})
  const [error, setError] = useState(null)
  const [savedAt, setSavedAt] = useState(null)

  const statusOf = (client) => draft[client.clientId] ?? client.attendanceStatus ?? ATTENDANCE.NOT_RECORDED

  const dirtyEntries = clients
    .filter((c) => draft[c.clientId] !== undefined && draft[c.clientId] !== c.attendanceStatus)
    .map((c) => ({ clientId: c.clientId, status: draft[c.clientId] }))

  const setStatus = (clientId, status) => {
    setError(null)
    setSavedAt(null)
    setDraft((prev) => ({ ...prev, [clientId]: status }))
  }

  const handleSave = () => {
    setError(null)
    patch(
      `GymClass/${classId}/attendance`,
      true,
      { entries: dirtyEntries },
      (roster) => {
        setDraft({})
        setSavedAt(new Date())
        if (Array.isArray(roster)) onSaved(roster)
      },
      (err) => setError(err?.message ?? 'Could not save attendance.')
    )
  }

  const counts = clients.reduce(
    (acc, c) => {
      const s = statusOf(c)
      if (s === ATTENDANCE.PRESENT) acc.present += 1
      else if (s === ATTENDANCE.ABSENT) acc.absent += 1
      else acc.unmarked += 1
      return acc
    },
    { present: 0, absent: 0, unmarked: 0 }
  )

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-bold text-emerald-400">
            {counts.present} present
          </span>
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 font-bold text-red-400">
            {counts.absent} absent
          </span>
          <span className="rounded-full border border-zinc-700 px-2.5 py-1 font-bold text-zinc-500">
            {counts.unmarked} unmarked
          </span>
        </div>

        {dirtyEntries.length > 0 && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-orange-500 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : `Save ${dirtyEntries.length} change${dirtyEntries.length > 1 ? 's' : ''}`}
          </button>
        )}
      </div>

      {!hasClassStarted && (
        <p className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-500">
          Attendance opens once the class has started.
        </p>
      )}

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      {savedAt && dirtyEntries.length === 0 && (
        <p className="mb-3 text-sm text-emerald-400">Attendance saved.</p>
      )}

      <ul className="flex flex-col gap-1.5">
        {clients.map((client) => {
          const status = statusOf(client)
          const isPending = draft[client.clientId] !== undefined && draft[client.clientId] !== client.attendanceStatus

          return (
            <li
              key={client.clientId}
              className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition ${
                isPending ? 'border-orange-500/40 bg-orange-500/5' : 'border-zinc-700/50 bg-zinc-800/40'
              }`}
            >
              <span className="min-w-0 truncate">
                <span className="block truncate text-sm text-zinc-200">{client.name}</span>
                {showEmail && (
                  <span className="block truncate text-xs text-zinc-500">{client.email}</span>
                )}
              </span>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  disabled={!hasClassStarted || isSaving}
                  onClick={() => setStatus(client.clientId, ATTENDANCE.PRESENT)}
                  aria-label={`Mark ${client.name} present`}
                  aria-pressed={status === ATTENDANCE.PRESENT}
                  className={`rounded-md border p-2 text-xs transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    status === ATTENDANCE.PRESENT
                      ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
                      : 'border-zinc-700 text-zinc-500 hover:border-emerald-500/40 hover:text-emerald-400'
                  }`}
                >
                  <FaCheck />
                </button>

                <button
                  type="button"
                  disabled={!hasClassStarted || isSaving}
                  onClick={() => setStatus(client.clientId, ATTENDANCE.ABSENT)}
                  aria-label={`Mark ${client.name} absent`}
                  aria-pressed={status === ATTENDANCE.ABSENT}
                  className={`rounded-md border p-2 text-xs transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    status === ATTENDANCE.ABSENT
                      ? 'border-red-500/50 bg-red-500/20 text-red-400'
                      : 'border-zinc-700 text-zinc-500 hover:border-red-500/40 hover:text-red-400'
                  }`}
                >
                  <FaTimes />
                </button>

                {status !== ATTENDANCE.NOT_RECORDED && (
                  <button
                    type="button"
                    disabled={!hasClassStarted || isSaving}
                    onClick={() => setStatus(client.clientId, ATTENDANCE.NOT_RECORDED)}
                    aria-label={`Clear attendance for ${client.name}`}
                    className="rounded-md border border-zinc-700 p-2 text-xs text-zinc-600 transition hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaUndo />
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AttendanceRoster
