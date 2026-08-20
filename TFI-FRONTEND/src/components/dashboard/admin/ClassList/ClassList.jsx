import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { FaPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import useFetch from '../../../../hooks/useFetch'
import ClassFilters from './ClassFilters'
import SortControls from '../../../shared/SortControls'
import ClassScheduleTable from './ClassScheduleTable'
import ClassInstanceTable from './ClassInstanceTable'
import Pagination from '../../../shared/Pagination'
import { explainApiError } from '../../../../utils/errorMessages'

const DEFAULT_PAGE_SIZE = 10

const SCHEDULE_SORT_FIELDS = [
  { value: 'className',   label: 'Nombre de la clase' },
  { value: 'dayOfWeek',   label: 'Día de la semana' },
  { value: 'timeOfDay',   label: 'Hora' },
  { value: 'maxCapacity', label: 'Capacidad' },
]

const INSTANCE_SORT_FIELDS = [
  { value: 'className',         label: 'Nombre de la clase' },
  { value: 'schedule',          label: 'Fecha programada' },
  { value: 'maxCapacity',       label: 'Capacidad' },
  { value: 'inscriptionAmount', label: 'Inscripciones' },
]

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

const SectionHeader = ({ title, subtitle, count, onAction, actionLabel }) => (
  <div className="flex items-start justify-between mb-6 mt-2">
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight text-white">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-3">
      {count != null && (
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-400">
          {count} en total
        </span>
      )}
      {onAction && (
        <button
          onClick={onAction}
          className="
            flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white
            hover:bg-orange-600 active:scale-[.98] transition-all duration-150 cursor-pointer
          "
        >
          <FaPlus className="text-xs" />
          {actionLabel ?? 'Crear nuevo'}
        </button>
      )}
    </div>
  </div>
)

const ClassList = () => {
  const navigate = useNavigate()
  const { get: getSchedules, isLoading: loadingSchedules } = useFetch()
  const { get: getInstances, isLoading: loadingInstances } = useFetch()
  const { post: postGenerate, isLoading: loadingGenerate } = useFetch()

  const [allSchedules, setAllSchedules] = useState([])
  const [scheduleError, setScheduleError] = useState(null)

  const [schedSearch,    setSchedSearch]    = useState('')
  const [schedStatus,    setSchedStatus]    = useState('')
  const [schedDay,       setSchedDay]       = useState('')
  const [schedSort,      setSchedSort]      = useState('className')
  const [schedDir,       setSchedDir]       = useState('asc')
  const [schedPage,      setSchedPage]      = useState(1)
  const [schedPageSize,  setSchedPageSize]  = useState(DEFAULT_PAGE_SIZE)

  const [allInstances, setAllInstances] = useState([])
  const [instanceError, setInstanceError] = useState(null)

  const [instSearch,    setInstSearch]    = useState('')
  const [instStatus,    setInstStatus]    = useState('')
  const [instSpecial,   setInstSpecial]   = useState('')
  const [instTimeFrame, setInstTimeFrame] = useState('')
  const [instSort,      setInstSort]      = useState('schedule')
  const [instDir,       setInstDir]       = useState('asc')
  const [instPage,      setInstPage]      = useState(1)
  const [instPageSize,  setInstPageSize]  = useState(DEFAULT_PAGE_SIZE)

  const [daysAhead, setDaysAhead] = useState(14)
  const [generateSuccess, setGenerateSuccess] = useState(null)
  const [generateError, setGenerateError] = useState(null)

  const handleGenerateClasses = () => {
    setGenerateSuccess(null)
    setGenerateError(null)

    postGenerate(
      `gymclassschedule/generate?daysAhead=${daysAhead}`,
      true,
      null,
      () => {
        setGenerateSuccess(`Se generaron las clases de los próximos ${daysAhead} días.`)
        getInstances(
          'gymclass',
          true,
          data => setAllInstances(Array.isArray(data) ? data : []),
          err  => setInstanceError(explainApiError(err, 'No se pudieron cargar las clases.'))
        )
      },
      err => {
        setGenerateError(explainApiError(err, 'No se pudieron generar las clases.'))
      }
    )
  }

  useEffect(() => {
    getSchedules(
      'gymclassschedule',
      true,
      data => setAllSchedules(Array.isArray(data) ? data : []),
      err  => setScheduleError(explainApiError(err, 'No se pudieron cargar la clases programadas.'))
    )
  }, [])

  useEffect(() => {
    getInstances(
      'gymclass',
      true,
      data => setAllInstances(Array.isArray(data) ? data : []),
      err  => setInstanceError(explainApiError(err, 'No se pudieron cargar las clases.'))
    )
  }, [])

  const filteredSchedules = useMemo(() => {
    let list = [...allSchedules]

    if (schedSearch.trim()) {
      const q = schedSearch.trim().toLowerCase()
      list = list.filter(s => s.className?.toLowerCase().includes(q))
    }
    if (schedStatus !== '') {
      const active = schedStatus === 'true'
      list = list.filter(s => s.isActive === active)
    }
    if (schedDay !== '') {
      list = list.filter(s => String(s.dayOfWeek) === schedDay)
    }

    list.sort((a, b) => compareValues(a, b, schedSort, schedDir))
    return list
  }, [allSchedules, schedSearch, schedStatus, schedDay, schedSort, schedDir])

  const schedTotalPages = Math.max(1, Math.ceil(filteredSchedules.length / schedPageSize))
  const schedSafePage   = Math.min(schedPage, schedTotalPages)
  const schedStart      = (schedSafePage - 1) * schedPageSize
  const currentSchedules = filteredSchedules.slice(schedStart, schedStart + schedPageSize)

  const filteredInstances = useMemo(() => {
    let list = [...allInstances]

    if (instSearch.trim()) {
      const q = instSearch.trim().toLowerCase()
      list = list.filter(i => i.className?.toLowerCase().includes(q))
    }
    if (instStatus !== '') {
      const deleted = instStatus === 'true'
      list = list.filter(i => i.isClassDeleted === deleted)
    }
    if (instSpecial !== '') {
      const isSpecial = instSpecial === 'true'
      list = list.filter(i => isSpecial ? !i.gymClassScheduleId : !!i.gymClassScheduleId)
    }
    if (instTimeFrame !== '') {
      const now = new Date().getTime()
      list = list.filter(i => {
        const scheduleTime = i.schedule ? new Date(i.schedule).getTime() : 0
        if (instTimeFrame === 'future') return scheduleTime > now
        if (instTimeFrame === 'past') return scheduleTime <= now
        return true
      })
    }

    list.sort((a, b) => compareValues(a, b, instSort, instDir))
    return list
  }, [allInstances, instSearch, instStatus, instSpecial, instTimeFrame, instSort, instDir])

  const instTotalPages  = Math.max(1, Math.ceil(filteredInstances.length / instPageSize))
  const instSafePage    = Math.min(instPage, instTotalPages)
  const instStart       = (instSafePage - 1) * instPageSize
  const currentInstances = filteredInstances.slice(instStart, instStart + instPageSize)

  return (
    <div>

      <div className="mb-10 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h3 className="mb-4 text-lg font-extrabold tracking-tight text-white">Generar próximas clases</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="daysAhead" className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Días a futuro
            </label>
            <input
              id="daysAhead"
              type="number"
              min="1"
              max="90"
              value={daysAhead}
              onChange={e => setDaysAhead(e.target.value)}
              className="w-24 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
            />
          </div>
          <button
            onClick={handleGenerateClasses}
            disabled={loadingGenerate || !daysAhead}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingGenerate ? 'Generando...' : 'Generar clases'}
          </button>
        </div>
        
        {generateSuccess && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <FaCheckCircle className="text-emerald-400" /> {generateSuccess}
          </div>
        )}
        {generateError && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <FaTimesCircle className="text-red-400" /> {generateError}
          </div>
        )}
      </div>

      <SectionHeader
        title="Clases programadas"
        subtitle="Plantillas de horarios recurrentes y puntuales."
        count={!loadingSchedules && !scheduleError ? allSchedules.length : null}
        onAction={() => navigate('/admin/new/gymclassschedule')}
        actionLabel="Nuevo horario"
      />

      {scheduleError && !loadingSchedules && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-10 text-center mb-10">
          <p className="font-semibold text-red-400">{scheduleError}</p>
          <p className="mt-1 text-sm text-zinc-500">Intentá de nuevo más tarde.</p>
        </div>
      )}

      {!scheduleError && (
        <>
          <ClassFilters
            variant="schedule"
            idPrefix="sched"
            searchQuery={schedSearch}
            onSearchChange={v => { setSchedSearch(v); setSchedPage(1) }}
            statusFilter={schedStatus}
            onStatusChange={v => { setSchedStatus(v); setSchedPage(1) }}
            dayFilter={schedDay}
            onDayChange={v => { setSchedDay(v); setSchedPage(1) }}
          />
          <SortControls
            fields={SCHEDULE_SORT_FIELDS}
            sortField={schedSort}
            sortDirection={schedDir}
            onSortFieldChange={v => { setSchedSort(v); setSchedPage(1) }}
            onSortDirectionToggle={() => { setSchedDir(d => d === 'asc' ? 'desc' : 'asc'); setSchedPage(1) }}
            idPrefix="sched"
          />
          <ClassScheduleTable schedules={currentSchedules} isLoading={loadingSchedules} />
          {!loadingSchedules && (
            <Pagination
              currentPage={schedSafePage}
              totalItems={filteredSchedules.length}
              pageSize={schedPageSize}
              onPageChange={setSchedPage}
              onPageSizeChange={setSchedPageSize}
              itemLabel="horarios"
              idPrefix="sched-pagination"
            />
          )}
        </>
      )}

      <div className="my-12 border-t border-zinc-800" />

      <SectionHeader
        title="Clases"
        subtitle="Sesiones individuales abiertas a inscripción."
        count={!loadingInstances && !instanceError ? allInstances.length : null}
        onAction={() => navigate('/admin/new/gymclass')}
        actionLabel="Nueva clase"
      />

      {instanceError && !loadingInstances && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-10 text-center">
          <p className="font-semibold text-red-400">{instanceError}</p>
          <p className="mt-1 text-sm text-zinc-500">Intentá de nuevo más tarde.</p>
        </div>
      )}

      {!instanceError && (
        <>
          <ClassFilters
            variant="instance"
            idPrefix="inst"
            searchQuery={instSearch}
            onSearchChange={v => { setInstSearch(v); setInstPage(1) }}
            statusFilter={instStatus}
            onStatusChange={v => { setInstStatus(v); setInstPage(1) }}
            specialFilter={instSpecial}
            onSpecialChange={v => { setInstSpecial(v); setInstPage(1) }}
            timeFrameFilter={instTimeFrame}
            onTimeFrameChange={v => { setInstTimeFrame(v); setInstPage(1) }}
          />
          <SortControls
            fields={INSTANCE_SORT_FIELDS}
            sortField={instSort}
            sortDirection={instDir}
            onSortFieldChange={v => { setInstSort(v); setInstPage(1) }}
            onSortDirectionToggle={() => { setInstDir(d => d === 'asc' ? 'desc' : 'asc'); setInstPage(1) }}
            idPrefix="inst"
          />
          <ClassInstanceTable instances={currentInstances} isLoading={loadingInstances} />
          {!loadingInstances && (
            <Pagination
              currentPage={instSafePage}
              totalItems={filteredInstances.length}
              pageSize={instPageSize}
              onPageChange={setInstPage}
              onPageSizeChange={setInstPageSize}
              itemLabel="clases"
              idPrefix="inst-pagination"
            />
          )}
        </>
      )}

    </div>
  )
}

export default ClassList
