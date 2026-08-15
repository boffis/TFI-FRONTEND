import { FaSearch, FaFilter } from 'react-icons/fa'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'

// The `value` of each role is the wire value the API filters on — only the label is translated.
const ROLE_OPTIONS = [
  { value: '', label: 'Todos los roles' },
  { value: 'Client', label: 'Cliente' },
  { value: 'Trainer', label: 'Entrenador' },
  { value: 'Admin', label: 'Administrador' },
]

const MEMBERSHIP_OPTIONS = [
  { value: '', label: 'Cualquier estado' },
  { value: 'true', label: 'Activa' },
  { value: 'false', label: 'Inactiva' },
]

const UserFilters = ({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleChange,
  membershipFilter,
  onMembershipChange,
}) => {
  return (
    <div className="flex flex-wrap items-end gap-4 mb-6">

      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="user-search" className="block mb-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Buscar
        </label>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none" />
          <input
            id="user-search"
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Nombre, correo o DNI…"
            className="
              w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700
              text-sm text-white placeholder-zinc-500
              focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* Role filter */}
      <div className="min-w-[150px]">
        <label htmlFor="role-filter" className="block mb-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          <span className="flex items-center gap-1.5"><FaFilter className="text-xs" /> Rol</span>
        </label>
        <select
          id="role-filter"
          value={roleFilter}
          onChange={e => onRoleChange(e.target.value)}
          className="
            w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700
            text-sm text-white
            focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500
            transition-all duration-200 cursor-pointer
          "
        >
          {ROLE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Membership Active filter */}
      <div className="min-w-[160px]">
        <label htmlFor="membership-filter" className="block mb-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          <span className="flex items-center gap-1.5">
            {membershipFilter === 'true'
              ? <FaCircleCheck className="text-emerald-400 text-xs" />
              : membershipFilter === 'false'
                ? <FaCircleXmark className="text-red-400 text-xs" />
                : <FaCircleCheck className="text-zinc-500 text-xs" />
            }
            Membresía
          </span>
        </label>
        <select
          id="membership-filter"
          value={membershipFilter}
          onChange={e => onMembershipChange(e.target.value)}
          className="
            w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700
            text-sm text-white
            focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500
            transition-all duration-200 cursor-pointer
          "
        >
          {MEMBERSHIP_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

    </div>
  )
}

export default UserFilters
