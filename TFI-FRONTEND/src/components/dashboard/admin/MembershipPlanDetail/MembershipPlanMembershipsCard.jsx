import { FaUsers } from 'react-icons/fa'
import { FaCircleXmark } from 'react-icons/fa6'

const MembershipPlanMembershipsCard = ({ memberships }) => {
  if (!memberships || memberships.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaUsers className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Membresías de clientes</h2>
        </div>
        <p className="text-sm text-zinc-500">Actualmente no hay clientes en este plan.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaUsers className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Membresías de clientes</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {memberships.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              {['Nombre del cliente', 'Correo', 'Vencimiento', 'Estado', 'ID de membresía'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {memberships.map((m) => {
              const expDate = m.expirationDate ? new Date(m.expirationDate) : null
              const isExpired = expDate && expDate < new Date()
              const dateStr = expDate
                ? expDate.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
                : '—'

              let statusText = 'Activa'
              let statusClass = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'

              if (m.isCancelled) {
                  statusText = 'Cancelada'
                  statusClass = 'text-red-400 bg-red-500/15 border-red-500/30'
              } else if (isExpired) {
                  statusText = 'Vencida'
                  statusClass = 'text-amber-400 bg-amber-500/15 border-amber-500/30'
              }

              return (
                <tr key={m.membershipId} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors duration-150">
                  <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{m.clientName}</td>
                  <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{m.clientEmail}</td>
                  <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{dateStr}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase ${statusClass}`}>
                      {statusText}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-zinc-600 whitespace-nowrap">{m.membershipId}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MembershipPlanMembershipsCard
