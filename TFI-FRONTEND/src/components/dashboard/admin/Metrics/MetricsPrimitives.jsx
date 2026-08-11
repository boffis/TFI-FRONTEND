/**
 * Small building blocks shared by the metrics sections. Kept separate so each section reads as
 * data rather than as a wall of Tailwind classes.
 */

export const StatCard = ({ label, value, hint, tone = 'default' }) => {
  const toneClass =
    tone === 'positive' ? 'text-emerald-400'
      : tone === 'warning' ? 'text-amber-400'
      : tone === 'accent' ? 'text-orange-500'
      : 'text-white'

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold tracking-tight ${toneClass}`}>{value}</p>
      {hint && <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>}
    </div>
  )
}

export const Section = ({ title, subtitle, children }) => (
  <section className="mb-8">
    <div className="mb-3">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
    </div>
    {children}
  </section>
)

/**
 * Generic table. `columns` entries are { key, label, align, render }.
 * Wrapped in an overflow-x container so narrow screens scroll the table, not the page.
 */
export const DataTable = ({ columns, rows, rowKey, emptyMessage = 'No data yet.' }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-zinc-800">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-800 bg-zinc-900/80">
          {columns.map((col) => (
            <th
              key={col.key}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap ${
                col.align === 'right' ? 'text-right' : 'text-left'
              }`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={rowKey(row, index)} className="border-b border-zinc-800/60 last:border-0">
            {columns.map((col) => (
              <td
                key={col.key}
                className={`px-4 py-3 whitespace-nowrap ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                } text-zinc-300`}
              >
                {col.render(row)}
              </td>
            ))}
          </tr>
        ))}

        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="px-4 py-12 text-center text-zinc-500">
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)
