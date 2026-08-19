import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const PAGE_SIZE_OPTIONS = [10, 25, 50]
const MAX_VISIBLE_PAGES = 5

const getPageRange = (currentPage, totalPages) => {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  let start = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2))
  let end = start + MAX_VISIBLE_PAGES - 1

  if (end > totalPages) {
    end = totalPages
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1)
  }

  const pages = []
  if (start > 1) pages.push(1, '...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages) pages.push('...', totalPages)
  return pages
}

const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  itemLabel = 'elementos',
  idPrefix = 'pagination',
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, totalItems)
  const pages = getPageRange(currentPage, totalPages)

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

      <p className="text-sm text-zinc-500">
        Mostrando <span className="text-zinc-300 font-medium">{from}–{to}</span> de{' '}
        <span className="text-zinc-300 font-medium">{totalItems}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <button
          id={`${idPrefix}-prev`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            flex items-center justify-center w-8 h-8 rounded-lg
            border border-zinc-700 text-zinc-400
            hover:border-orange-500/60 hover:text-orange-400
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-150 cursor-pointer
          "
        >
          <FaChevronLeft className="text-xs" />
        </button>

        {pages.map((page, i) =>
          page === '...'
            ? <span key={`ellipsis-${i}`} className="px-1 text-zinc-600 text-sm select-none">…</span>
            : (
              <button
                key={page}
                id={`${idPrefix}-page-${page}`}
                onClick={() => onPageChange(page)}
                className={`
                  flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium
                  border transition-all duration-150 cursor-pointer
                  ${page === currentPage
                    ? 'border-orange-500 bg-orange-500/15 text-orange-400'
                    : 'border-zinc-700 text-zinc-400 hover:border-orange-500/60 hover:text-orange-400'
                  }
                `}
              >
                {page}
              </button>
            )
        )}

        <button
          id={`${idPrefix}-next`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            flex items-center justify-center w-8 h-8 rounded-lg
            border border-zinc-700 text-zinc-400
            hover:border-orange-500/60 hover:text-orange-400
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-150 cursor-pointer
          "
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <span>Filas:</span>
        <select
          id={`${idPrefix}-page-size`}
          value={pageSize}
          onChange={e => {
            onPageSizeChange(Number(e.target.value))
            onPageChange(1)
          }}
          className="
            px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm
            focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500
            transition-all duration-150 cursor-pointer
          "
        >
          {PAGE_SIZE_OPTIONS.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

    </div>
  )
}

export default Pagination
