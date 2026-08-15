import MembershipPlanTableRow from './MembershipPlanTableRow'

const COLUMNS = [
  'Tipo', 'Precio', 'Duración (días)'
]

const SkeletonRow = () => (
  <tr className="border-b border-zinc-800/60 animate-pulse">
    {COLUMNS.map(col => (
      <td key={col} className="px-4 py-3">
        <div className="h-3.5 rounded-lg bg-zinc-800" />
      </td>
    ))}
  </tr>
)

const MembershipPlanTable = ({ plans, isLoading }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-zinc-800">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-800 bg-zinc-900/80">
          {COLUMNS.map(col => (
            <th
              key={col}
              className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

        {!isLoading && plans.map(p => (
          <MembershipPlanTableRow key={p.membershipPlanId} plan={p} />
        ))}

        {!isLoading && plans.length === 0 && (
          <tr>
            <td colSpan={COLUMNS.length} className="px-4 py-16 text-center text-zinc-500">
              No se encontraron planes de membresía.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

export default MembershipPlanTable
