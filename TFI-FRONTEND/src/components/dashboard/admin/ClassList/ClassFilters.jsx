import { FaSearch, FaFilter } from 'react-icons/fa'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'
import { DAY_OPTIONS as WEEKDAY_OPTIONS } from '../../../../utils/formatters'

const DAY_FILTER_OPTIONS = [{ value: '', label: 'Todos los días' }, ...WEEKDAY_OPTIONS]

const ACTIVE_OPTIONS = [
  { value: '', label: 'Cualquier estado' },
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' },
]

const DELETED_OPTIONS = [
  { value: '', label: 'Cualquier estado' },
  { value: 'false', label: 'Activa' },
  { value: 'true', label: 'Eliminada' },
]

const SELECT_CLS = `
  w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700
  text-sm text-white
  focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500
  transition-all duration-200 cursor-pointer
`

const LABEL_CLS = 'block mb-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400'

// variant: 'schedule' | 'instance'
const ClassFilters = ({
  variant = 'schedule',
  idPrefix = 'class',
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dayFilter,
  onDayChange,
  specialFilter,
  onSpecialChange,
  timeFrameFilter,
  onTimeFrameChange,
}) => {
  const statusOptions = variant === 'schedule' ? ACTIVE_OPTIONS : DELETED_OPTIONS
  const statusLabel   = 'Estado'
  const showDay       = variant === 'schedule'

  return (
    <div className="flex flex-wrap items-end gap-4 mb-6">

      <div className="flex-1 min-w-[200px]">
        <label htmlFor={`${idPrefix}-search`} className={LABEL_CLS}>Buscar</label>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none" />
          <input
            id={`${idPrefix}-search`}
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Nombre de la clase…"
            className="
              w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700
              text-sm text-white placeholder-zinc-500
              focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500
              transition-all duration-200
            "
          />
        </div>
      </div>

      <div className="min-w-[150px]">
        <label htmlFor={`${idPrefix}-status`} className={LABEL_CLS}>
          <span className="flex items-center gap-1.5">
            {statusFilter === 'true'
              ? <FaCircleCheck className="text-emerald-400 text-xs" />
              : statusFilter === 'false'
                ? <FaCircleXmark className="text-red-400 text-xs" />
                : <FaFilter className="text-xs" />
            }
            {statusLabel}
          </span>
        </label>
        <select
          id={`${idPrefix}-status`}
          value={statusFilter}
          onChange={e => onStatusChange(e.target.value)}
          className={SELECT_CLS}
        >
          {statusOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {showDay && (
        <div className="min-w-[150px]">
          <label htmlFor={`${idPrefix}-day`} className={LABEL_CLS}>
            <span className="flex items-center gap-1.5"><FaFilter className="text-xs" /> Día</span>
          </label>
          <select
            id={`${idPrefix}-day`}
            value={dayFilter}
            onChange={e => onDayChange(e.target.value)}
            className={SELECT_CLS}
          >
            {DAY_FILTER_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      {!showDay && timeFrameFilter !== undefined && (
        <div className="min-w-[150px]">
          <label htmlFor={`${idPrefix}-timeframe`} className={LABEL_CLS}>
            <span className="flex items-center gap-1.5"><FaFilter className="text-xs" /> Período</span>
          </label>
          <select
            id={`${idPrefix}-timeframe`}
            value={timeFrameFilter}
            onChange={e => onTimeFrameChange(e.target.value)}
            className={SELECT_CLS}
          >
            <option value="">Todo el período</option>
            <option value="future">Futuras</option>
            <option value="past">Pasadas</option>
          </select>
        </div>
      )}

      {!showDay && specialFilter !== undefined && (
        <div className="min-w-[150px]">
          <label htmlFor={`${idPrefix}-special`} className={LABEL_CLS}>
            <span className="flex items-center gap-1.5"><FaFilter className="text-xs" /> Tipo</span>
          </label>
          <select
            id={`${idPrefix}-special`}
            value={specialFilter}
            onChange={e => onSpecialChange(e.target.value)}
            className={SELECT_CLS}
          >
            <option value="">Cualquier tipo</option>
            <option value="true">Especial</option>
            <option value="false">Regular</option>
          </select>
        </div>
      )}

    </div>
  )
}

export default ClassFilters
