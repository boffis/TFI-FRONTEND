import { useContext, useEffect, useMemo, useState } from 'react'
import useFetch from '../../../../hooks/useFetch'
import { AuthContext } from '../../../../services/authContext/AuthContext'
import SortControls from '../../../shared/SortControls'
import Pagination from '../../../shared/Pagination'
import TrainerClassCard from './TrainerClassCard'
import TrainerClassFilters from './TrainerClassFilters'
import { explainApiError } from '../../../../utils/errorMessages'

const DEFAULT_PAGE_SIZE = 10

const SORT_FIELDS = [
  { value: 'schedule',    label: 'Fecha programada' },
  { value: 'className',   label: 'Nombre de la clase' },
  { value: 'maxCapacity', label: 'Capacidad' },
]

// Upcoming reads soonest-first; past reads newest-first, where attendance is still due.
const NATURAL_DIRECTION = { future: 'asc', past: 'desc', '': 'asc' }

const EMPTY_STATES = {
  future: {
    title: 'No hay clases próximas',
    hint: 'No tenés clases programadas a futuro.',
  },
  past: {
    title: 'No hay clases pasadas',
    hint: 'Todavía no diste ninguna clase.',
  },
  '': {
    title: 'No tenés clases',
    hint: 'Todavía no hay clases asignadas a tu nombre.',
  },
}

const compareValues = (a, b, field, direction) => {
  let valA = a[field] ?? ''
  let valB = b[field] ?? ''

  if (field === 'schedule') {
    valA = valA ? new Date(valA).getTime() : 0
    valB = valB ? new Date(valB).getTime() : 0
    return direction === 'asc' ? valA - valB : valB - valA
  }

  if (typeof valA === 'number' && typeof valB === 'number') {
    return direction === 'asc' ? valA - valB : valB - valA
  }

  valA = String(valA).toLowerCase()
  valB = String(valB).toLowerCase()
  if (valA < valB) return direction === 'asc' ? -1 : 1
  if (valA > valB) return direction === 'asc' ? 1 : -1
  return 0
}

const TrainerClassesList = () => {
  const { user } = useContext(AuthContext)
  const { get, isLoading } = useFetch()

  const [classes, setClasses] = useState([])
  const [error, setError] = useState(null)

  const [search, setSearch]       = useState('')
  const [timeFrame, setTimeFrame] = useState('')
  const [special, setSpecial]     = useState('')
  const [sortField, setSortField] = useState('schedule')
  const [sortDir, setSortDir]     = useState('asc')
  const [page, setPage]           = useState(1)
  const [pageSize, setPageSize]   = useState(DEFAULT_PAGE_SIZE)

  useEffect(() => {
    if (!user?.userId) return
    get(
      `GymClass/ClassesByTrainer/${user.userId}`,
      true,
      (data) => setClasses(Array.isArray(data) ? data : []),
      (err) => setError(explainApiError(err, 'No se pudieron cargar tus clases.'))
    )
  }, [user?.userId])

  // Switching period re-orients the list; the toggle still overrides it afterwards.
  const handleTimeFrameChange = (value) => {
    setTimeFrame(value)
    setSortDir(sortField === 'schedule' ? NATURAL_DIRECTION[value] : sortDir)
    setPage(1)
  }

  const filteredClasses = useMemo(() => {
    let list = [...classes]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((c) => c.className?.toLowerCase().includes(q))
    }
    // `hasStarted` comes from the API in the gym's zone; the browser clock would disagree.
    if (timeFrame === 'future') list = list.filter((c) => !c.hasStarted)
    if (timeFrame === 'past')   list = list.filter((c) => c.hasStarted)
    // No `gymClassScheduleId` means a one-off class, i.e. "special".
    if (special === 'true')  list = list.filter((c) => !c.gymClassScheduleId)
    if (special === 'false') list = list.filter((c) => !!c.gymClassScheduleId)

    list.sort((a, b) => compareValues(a, b, sortField, sortDir))
    return list
  }, [classes, search, timeFrame, special, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / pageSize))
  const safePage   = Math.min(page, totalPages)
  const start      = (safePage - 1) * pageSize
  const currentClasses = filteredClasses.slice(start, start + pageSize)

  const handleUpdated = (gymClassId, patch) => {
    setClasses((prev) => prev.map((c) => (c.gymClassId === gymClassId ? { ...c, ...patch } : c)))
  }

  if (isLoading && classes.length === 0) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl bg-zinc-800/60" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-10 text-center">
        <p className="font-semibold text-red-400">{error}</p>
        <p className="mt-1 text-sm text-zinc-500">Intentá de nuevo más tarde.</p>
      </div>
    )
  }

  const emptyState = search.trim() || special !== ''
    ? { title: 'Sin resultados', hint: 'Ninguna clase coincide con los filtros aplicados.' }
    : EMPTY_STATES[timeFrame]

  return (
    <div>
      <TrainerClassFilters
        searchQuery={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        timeFrameFilter={timeFrame}
        onTimeFrameChange={handleTimeFrameChange}
        specialFilter={special}
        onSpecialChange={(v) => { setSpecial(v); setPage(1) }}
      />

      <SortControls
        fields={SORT_FIELDS}
        sortField={sortField}
        sortDirection={sortDir}
        onSortFieldChange={(v) => { setSortField(v); setPage(1) }}
        onSortDirectionToggle={() => { setSortDir((d) => (d === 'asc' ? 'desc' : 'asc')); setPage(1) }}
        idPrefix="trainer-class"
      />

      {filteredClasses.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-16 text-center">
          <p className="text-lg font-semibold text-zinc-300">{emptyState.title}</p>
          <p className="mt-1 text-sm text-zinc-500">{emptyState.hint}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            {currentClasses.map((cls) => (
              <TrainerClassCard
                key={cls.gymClassId}
                classData={cls}
                trainerId={user.userId}
                onUpdated={handleUpdated}
              />
            ))}
          </div>

          <Pagination
            currentPage={safePage}
            totalItems={filteredClasses.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            itemLabel="clases"
            idPrefix="trainer-class-pagination"
          />
        </>
      )}
    </div>
  )
}

export default TrainerClassesList
