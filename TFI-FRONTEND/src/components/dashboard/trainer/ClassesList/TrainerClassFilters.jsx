import { FaSearch, FaFilter } from 'react-icons/fa'

const TYPE_OPTIONS = [
  { value: '',      label: 'Cualquier tipo' },
  { value: 'true',  label: 'Especial' },
  { value: 'false', label: 'Regular' },
]

const TIME_FRAME_OPTIONS = [
  { value: '',       label: 'Todo el período' },
  { value: 'future', label: 'Futuras' },
  { value: 'past',   label: 'Pasadas' },
]

const SELECT_CLS = `
  w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700
  text-sm text-white
  focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500
  transition-all duration-200 cursor-pointer
`

const LABEL_CLS = 'block mb-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400'

const TrainerClassFilters = ({
  idPrefix = 'trainer-class',
  searchQuery,
  onSearchChange,
  timeFrameFilter,
  onTimeFrameChange,
  specialFilter,
  onSpecialChange,
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-end gap-4">

      {/* Search */}
      <div className="min-w-[200px] flex-1">
        <label htmlFor={`${idPrefix}-search`} className={LABEL_CLS}>Buscar</label>
        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500" />
          <input
            id={`${idPrefix}-search`}
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Nombre de la clase…"
            className="
              w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 pl-9 pr-4
              text-sm text-white placeholder-zinc-500
              focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* Time frame */}
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
          {TIME_FRAME_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Type: special one-off vs. generated from a recurring schedule */}
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
          {TYPE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

    </div>
  )
}

export default TrainerClassFilters
