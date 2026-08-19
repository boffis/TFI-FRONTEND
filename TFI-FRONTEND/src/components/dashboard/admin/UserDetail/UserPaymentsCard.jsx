import { FaCreditCard } from 'react-icons/fa'
import { capitalizeWords, formatDateTime } from '../../../../utils/formatters'

const TONE = {
  green:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  blue:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  sky:    'bg-sky-500/15 text-sky-400 border-sky-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  red:    'bg-red-500/15 text-red-400 border-red-500/30',
  grey:   'bg-zinc-700/30 text-zinc-400 border-zinc-600/30',
}

/**
 * Method and state are stored verbatim by writers that disagree on casing and spacing, so both
 * sides of the lookup are lower-cased and de-spaced — as the backend does for metrics.
 */
const badgeKey = (value) => (value ?? '').toString().trim().toLowerCase().replace(/\s+/g, '')

/**
 * [label, tone]. Cards only: every path that writes PaymentMethod today is card-funded. Cash and
 * wallet ids belong to Checkout Pro, whose webhook only ever touches PaymentState — add them here
 * if it ever starts writing PaymentMethodId too.
 */
const METHOD_BADGE = {
  // Keys are normalised wire values and must keep matching what the backend writes.
  mercadopago:  ['Mercado Pago', TONE.sky],   // MercadoPagoService:151/647 and PaymentService:38
  cash:         ['Efectivo', TONE.green],     // legacy — kept for hand-entered / pre-MP rows
  card:         ['Tarjeta', TONE.blue],
  transfer:     ['Transferencia', TONE.purple],
  // payment_method_id — credit cards
  visa:         ['Visa', TONE.blue],
  master:       ['Mastercard', TONE.blue],
  amex:         ['Amex', TONE.blue],
  naranja:      ['Naranja', TONE.blue],
  cabal:        ['Cabal', TONE.blue],
  diners:       ['Diners', TONE.blue],
  argencard:    ['Argencard', TONE.blue],
  cencosud:     ['Cencosud', TONE.blue],
  cordobesa:    ['Cordobesa', TONE.blue],
  tarshop:      ['Tarjeta Shopping', TONE.blue],
  cmr:          ['CMR', TONE.blue],
  // ...and debit cards
  debvisa:      ['Visa Débito', TONE.blue],
  debmaster:    ['Mastercard Débito', TONE.blue],
  debcabal:     ['Cabal Débito', TONE.blue],
  maestro:      ['Maestro', TONE.blue],
}

// Mercado Pago's status vocabulary, plus the success/failed the previous map assumed.
const STATE_BADGE = {
  approved:     ['Aprobado', TONE.green],
  authorized:   ['Autorizado', TONE.green],
  success:      ['Exitoso', TONE.green],
  pending:      ['Pendiente', TONE.orange],
  in_process:   ['En proceso', TONE.orange],
  in_mediation: ['En mediación', TONE.orange],
  rejected:     ['Rechazado', TONE.red],
  cancelled:    ['Cancelado', TONE.red],
  canceled:     ['Cancelado', TONE.red],
  failed:       ['Fallido', TONE.red],
  refunded:     ['Reembolsado', TONE.purple],
  charged_back: ['Contracargo', TONE.purple],
}

/** Unknown values keep their raw text and fall back to the grey badge. */
const resolveBadge = (map, value) =>
  map[badgeKey(value)] ?? [capitalizeWords((value ?? '').toString().replace(/_/g, ' ')), TONE.grey]

const UserPaymentsCard = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FaCreditCard className="text-orange-500" />
          <h2 className="text-lg font-bold text-white">Pagos</h2>
        </div>
        <p className="text-sm text-zinc-500">No se encontraron pagos.</p>
      </div>
    )
  }

  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
  )

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <FaCreditCard className="text-orange-500" />
        <h2 className="text-lg font-bold text-white">Pagos</h2>
        <span className="ml-auto rounded-full bg-zinc-800 px-3 py-0.5 text-xs font-bold text-zinc-400">
          {payments.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              {['Precio', 'Método', 'Estado', 'Fecha y hora'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPayments.map((p) => {
              const [methodLabel, methodBadgeClass] = resolveBadge(METHOD_BADGE, p.paymentMethod)
              const [stateLabel, stateBadgeClass] = resolveBadge(STATE_BADGE, p.paymentState)
              const date = formatDateTime(p.paymentDate)
              return (
                <tr key={p.paymentId} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors duration-150">
                  <td className="px-4 py-3 font-semibold text-emerald-400">${p.price?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {p.paymentMethod ? (
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${methodBadgeClass}`}>
                        {methodLabel}
                      </span>
                    ) : (
                      <span className="text-zinc-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {p.paymentState ? (
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${stateBadgeClass}`}>
                        {stateLabel}
                      </span>
                    ) : (
                      <span className="text-zinc-500">—</span>
                    )}
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
