import UserTableRow from './UserTableRow'

const COLUMNS = [
  'Name', 'Email', 'DNI', 'Date of Birth',
  'Gender', 'Phone', 'Role', 'Membership', 'Specialization',
]

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-zinc-800/60 animate-pulse">
    {COLUMNS.map(col => (
      <td key={col} className="px-4 py-3">
        <div className="h-3.5 rounded-lg bg-zinc-800" />
      </td>
    ))}
  </tr>
)

// ─── Table ────────────────────────────────────────────────────────────────────
const UserTable = ({ users, isLoading }) => {
  return (
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
          {/* Loading state */}
          {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

          {/* Populated rows */}
          {!isLoading && users.map(user => (
            <UserTableRow key={user.userId} user={user} />
          ))}

          {/* Empty state */}
          {!isLoading && users.length === 0 && (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="px-4 py-16 text-center text-zinc-500"
              >
                No users match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
