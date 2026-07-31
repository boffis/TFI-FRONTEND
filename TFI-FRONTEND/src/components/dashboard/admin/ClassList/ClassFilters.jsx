import { FaSearch, FaFilter } from 'react-icons/fa'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'

const DAY_OPTIONS = [
  { value: '', label: 'All Days' },
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
]

const ACTIVE_OPTIONS = [
  { value: '', label: 'Any Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

const DELETED_OPTIONS = [
  { value: '', label: 'Any Status' },
  { value: 'false', label: 'Active' },
  { value: 'true', label: 'Deleted' },
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
  const statusLabel   = variant === 'schedule' ? 'Status'      : 'Status'
  const showDay       = variant === 'schedule'

  return (
    <div className="flex flex-wrap items-end gap-4 mb-6">

      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <label htmlFor={`${idPrefix}-search`} className={LABEL_CLS}>Search</label>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none" />
          <input
            id={`${idPrefix}-search`}
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Class name…"
            className="
              w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700
              text-sm text-white placeholder-zinc-500
              focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* Status filter */}
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

      {/* Day of week (schedule only) */}
      {showDay && (
        <div className="min-w-[150px]">
          <label htmlFor={`${idPrefix}-day`} className={LABEL_CLS}>
            <span className="flex items-center gap-1.5"><FaFilter className="text-xs" /> Day</span>
          </label>
          <select
            id={`${idPrefix}-day`}
            value={dayFilter}
            onChange={e => onDayChange(e.target.value)}
            className={SELECT_CLS}
          >
            {DAY_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* TimeFrame filter (instance only) */}
      {!showDay && timeFrameFilter !== undefined && (
        <div className="min-w-[150px]">
          <label htmlFor={`${idPrefix}-timeframe`} className={LABEL_CLS}>
            <span className="flex items-center gap-1.5"><FaFilter className="text-xs" /> Time Frame</span>
          </label>
          <select
            id={`${idPrefix}-timeframe`}
            value={timeFrameFilter}
            onChange={e => onTimeFrameChange(e.target.value)}
            className={SELECT_CLS}
          >
            <option value="">All Time</option>
            <option value="future">Future</option>
            <option value="past">Past</option>
          </select>
        </div>
      )}

      {/* Special filter (instance only) */}
      {!showDay && specialFilter !== undefined && (
        <div className="min-w-[150px]">
          <label htmlFor={`${idPrefix}-special`} className={LABEL_CLS}>
            <span className="flex items-center gap-1.5"><FaFilter className="text-xs" /> Type</span>
          </label>
          <select
            id={`${idPrefix}-special`}
            value={specialFilter}
            onChange={e => onSpecialChange(e.target.value)}
            className={SELECT_CLS}
          >
            <option value="">Any Type</option>
            <option value="true">Special</option>
            <option value="false">Regular</option>
          </select>
        </div>
      )}

    </div>
  )
}

export default ClassFilters
