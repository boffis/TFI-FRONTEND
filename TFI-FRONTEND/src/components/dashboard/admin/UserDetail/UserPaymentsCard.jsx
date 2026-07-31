import { FaCreditCard } from 'react-icons/fa'

const METHOD_BADGE = {
  Cash:        'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Card:        'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Transfer:    'bg-purple-500/15 text-purple-400 border-purple-500/30',
}

const UserPaymentsCard = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaCreditCard className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Payments</h2>
        </div>
        <p className="text-sm text-zinc-500">No payments found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaCreditCard className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Payments</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {payments.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              {['Payment ID', 'Membership ID', 'Price', 'Method', 'Date'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const badgeClass = METHOD_BADGE[p.paymentMethod] ?? 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30'
              const date = p.paymentDate
                ? new Date(p.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                : '—'
              return (
                <tr key={p.paymentId} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors duration-150">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{p.paymentId}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{p.membershipId}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-400">${p.price?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeClass}`}>
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{date}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserPaymentsCard
