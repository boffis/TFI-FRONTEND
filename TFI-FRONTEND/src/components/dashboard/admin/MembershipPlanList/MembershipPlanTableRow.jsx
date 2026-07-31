import { useNavigate } from 'react-router'

const MembershipPlanTableRow = ({ plan }) => {
  const navigate = useNavigate()

  return (
    <tr
      onClick={() => navigate(`/admin/membershipplan/${plan.membershipPlanId}`)}
      className="
        group border-b border-zinc-800/60
        hover:bg-zinc-800/50 cursor-pointer
        transition-colors duration-150
      "
    >
      <td className="px-4 py-3 font-medium text-white group-hover:text-orange-400 transition-colors duration-150 whitespace-nowrap">
        {plan.type || '—'}
      </td>
      <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">${plan.price?.toFixed(2) || '0.00'}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{plan.durationInDays || 0}</td>
    </tr>
  )
}

export default MembershipPlanTableRow
