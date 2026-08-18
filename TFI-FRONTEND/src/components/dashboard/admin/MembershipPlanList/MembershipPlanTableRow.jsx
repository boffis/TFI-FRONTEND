import { useNavigate } from 'react-router'

const MembershipPlanTableRow = ({ plan }) => {
  const navigate = useNavigate()

  return (
    <tr
      onClick={() => navigate(`/admin/membershipplan/${plan.membershipPlanId}`)}
      className={`
        group border-b border-zinc-800/60
        hover:bg-zinc-800/50 cursor-pointer
        transition-colors duration-150
        ${plan.isDeleted ? 'bg-zinc-900/40' : ''}
      `}
    >
      <td className="px-4 py-3 font-medium text-white group-hover:text-orange-400 transition-colors duration-150 whitespace-nowrap">
        <span className={plan.isDeleted ? 'text-zinc-500 line-through' : undefined}>
          {plan.type || '—'}
        </span>
        {plan.isDeleted && (
          <span className="ml-2 rounded-full border border-zinc-600 bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 align-middle">
            Discontinuado
          </span>
        )}
      </td>
      <td className={`px-4 py-3 whitespace-nowrap ${plan.isDeleted ? 'text-zinc-600' : 'text-zinc-300'}`}>
        ${plan.price?.toFixed(2) || '0.00'}
      </td>
      <td className={`px-4 py-3 whitespace-nowrap ${plan.isDeleted ? 'text-zinc-600' : 'text-zinc-400'}`}>
        {plan.durationInDays || 0}
      </td>
    </tr>
  )
}

export default MembershipPlanTableRow
