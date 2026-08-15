import { useNavigate } from 'react-router'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'
import { capitalizeWords, genderLabel, roleLabel } from '../../../../utils/formatters'

const ROLE_BADGE = {
  Client:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Trainer: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Admin:   'bg-rose-500/15 text-rose-400 border-rose-500/30',
}

const UserTableRow = ({ user }) => {
  const navigate = useNavigate()

  const badgeClass = ROLE_BADGE[user.role] ?? 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30'

  const formattedDob = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—'

  const membershipCell = user.role === 'Client'
    ? user.isMembershipActive
      ? <span className="flex items-center justify-center gap-1.5 text-emerald-400"><FaCircleCheck /> Activa</span>
      : <span className="flex items-center justify-center gap-1.5 text-red-400"><FaCircleXmark /> Inactiva</span>
    : <span className="text-zinc-600">N/D</span>

  const specializationCell = user.role === 'Trainer'
    ? <span className="text-zinc-200">{user.specialization}</span>
    : <span className="text-zinc-600">N/D</span>

  return (
    <tr
      onClick={() => navigate(`/admin/user/${user.userId}`)}
      className="
        group border-b border-zinc-800/60
        hover:bg-zinc-800/50 cursor-pointer
        transition-colors duration-150
      "
    >
      <td className="px-4 py-3 font-medium text-white group-hover:text-orange-400 transition-colors duration-150 whitespace-nowrap">
        {capitalizeWords(user.name)}
      </td>
      <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">{user.email}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{user.dni}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{formattedDob}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{genderLabel(user.gender)}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{user.phoneNumber}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold tracking-wide ${badgeClass}`}>
          {roleLabel(user.role)}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
        {membershipCell}
      </td>
      <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
        {specializationCell}
      </td>
    </tr>
  )
}

export default UserTableRow
