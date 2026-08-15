import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa'

const SORT_FIELDS = [
  { value: 'name',        label: 'Nombre' },
  { value: 'email',       label: 'Correo' },
  { value: 'dateOfBirth', label: 'Fecha de nacimiento' },
  { value: 'gender',      label: 'Género' },
  { value: 'role',        label: 'Rol' },
]

const UserSortControls = ({ sortField, sortDirection, onSortFieldChange, onSortDirectionToggle }) => {
  return (
    <div className="flex items-end gap-3 mb-6">

      {/* Sort field */}
      <div className="min-w-[170px]">
        <label htmlFor="sort-field" className="block mb-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Ordenar por
        </label>
        <select
          id="sort-field"
          value={sortField}
          onChange={e => onSortFieldChange(e.target.value)}
          className="
            w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700
            text-sm text-white
            focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500
            transition-all duration-200 cursor-pointer
          "
        >
          {SORT_FIELDS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Asc / Desc toggle */}
      <button
        id="sort-direction-toggle"
        onClick={onSortDirectionToggle}
        title={sortDirection === 'asc' ? 'Ascendente — hacé clic para cambiar' : 'Descendente — hacé clic para cambiar'}
        className="
          flex items-center gap-2 px-4 py-2.5 rounded-xl
          bg-zinc-900 border border-zinc-700 text-sm font-medium text-zinc-200
          hover:border-orange-500/60 hover:text-orange-400
          active:scale-95 transition-all duration-200 cursor-pointer
        "
      >
        {sortDirection === 'asc'
          ? <FaSortAmountUp className="text-orange-400" />
          : <FaSortAmountDown className="text-orange-400" />
        }
        {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
      </button>

    </div>
  )
}

export default UserSortControls
