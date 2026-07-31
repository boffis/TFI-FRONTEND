import { FaUsers } from 'react-icons/fa'

const GymClassInscribedClientsCard = ({ clients }) => {
  if (!clients || clients.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaUsers className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Inscribed Clients</h2>
        </div>
        <p className="text-sm text-zinc-500">No clients inscribed yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaUsers className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Inscribed Clients</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {clients.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div
            key={client.clientId}
            className="rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-4 hover:border-orange-500/40 hover:bg-zinc-800/60 transition-all duration-200"
          >
            <p className="text-sm font-bold text-white">{client.name}</p>
            <p className="text-xs text-zinc-400 mt-1">{client.email}</p>
            <p className="mt-2 text-[10px] font-mono text-zinc-600 break-all">{client.clientId}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GymClassInscribedClientsCard
