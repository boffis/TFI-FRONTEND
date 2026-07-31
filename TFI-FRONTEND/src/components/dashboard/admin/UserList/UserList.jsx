import { useEffect, useMemo, useState } from 'react'
import useFetch from '../../../../hooks/useFetch'
import UserFilters from './UserFilters'
import UserSortControls from './UserSortControls'
import UserTable from './UserTable'
import UserPagination from './UserPagination'

const DEFAULT_PAGE_SIZE = 10

// ─── Helpers ──────────────────────────────────────────────────────────────────

const compareValues = (a, b, field, direction) => {
  let valA = a[field] ?? ''
  let valB = b[field] ?? ''

  if (field === 'DateOfBirth') {
    valA = valA ? new Date(valA).getTime() : 0
    valB = valB ? new Date(valB).getTime() : 0
    return direction === 'asc' ? valA - valB : valB - valA
  }

  valA = String(valA).toLowerCase()
  valB = String(valB).toLowerCase()
  if (valA < valB) return direction === 'asc' ? -1 : 1
  if (valA > valB) return direction === 'asc' ? 1 : -1
  return 0
}

// ─── Component ────────────────────────────────────────────────────────────────

const UserList = () => {
  const { get, isLoading } = useFetch()

  const [allUsers, setAllUsers] = useState([])
  const [error, setError]       = useState(null)

  // Filter state
  const [searchQuery,      setSearchQuery]      = useState('')
  const [roleFilter,       setRoleFilter]       = useState('')
  const [membershipFilter, setMembershipFilter] = useState('')

  // Sort state
  const [sortField,     setSortField]     = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize,    setPageSize]    = useState(DEFAULT_PAGE_SIZE)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    get(
      'User',
      true,
      (data) => {
        const merged = [
          ...(data?.clientList  ?? []),
          ...(data?.trainerList ?? []),
          ...(data?.adminList   ?? []),
        ]
        setAllUsers(merged)
      },
      (err) => setError(err?.message ?? 'Failed to load users.')
    )
  }, [])

  // Reset to page 1 whenever filters/sort change
  const resetPage = () => setCurrentPage(1)

  const handleSearch      = v => { setSearchQuery(v);      resetPage() }
  const handleRole        = v => { setRoleFilter(v);       resetPage() }
  const handleMembership  = v => { setMembershipFilter(v); resetPage() }
  const handleSortField   = v => { setSortField(v);        resetPage() }
  const handleDirectionToggle = () => {
    setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    resetPage()
  }

  // ── Derived list ───────────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    let list = [...allUsers]

    // 1. Search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.dni?.toLowerCase().includes(q)
      )
    }

    // 2. Role filter
    if (roleFilter) {
      list = list.filter(u => u.role === roleFilter)
    }

    // 3. Membership filter (only Clients have IsMembershipActive)
    if (membershipFilter !== '') {
      const active = membershipFilter === 'true'
      list = list.filter(u => u.role === 'Client' && u.isMembershipActive === active)
    }

    // 4. Sort
    list.sort((a, b) => compareValues(a, b, sortField, sortDirection))

    return list
  }, [allUsers, searchQuery, roleFilter, membershipFilter, sortField, sortDirection])

  // ── Paginated slice ────────────────────────────────────────────────────────
  const totalPages    = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const safePage      = Math.min(currentPage, totalPages)
  const start         = (safePage - 1) * pageSize
  const currentUsers  = filteredUsers.slice(start, start + pageSize)

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Section header */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">Users</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Manage all clients, trainers and administrators.
        </p>
      </div>

      {/* Error state */}
      {error && !isLoading && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-10 text-center">
          <p className="font-semibold text-red-400">{error}</p>
          <p className="mt-1 text-sm text-zinc-500">Please try again later.</p>
        </div>
      )}

      {!error && (
        <>
          {/* Filters row */}
          <UserFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            roleFilter={roleFilter}
            onRoleChange={handleRole}
            membershipFilter={membershipFilter}
            onMembershipChange={handleMembership}
          />

          {/* Sort row */}
          <UserSortControls
            sortField={sortField}
            sortDirection={sortDirection}
            onSortFieldChange={handleSortField}
            onSortDirectionToggle={handleDirectionToggle}
          />

          {/* Table */}
          <UserTable users={currentUsers} isLoading={isLoading} />

          {/* Pagination */}
          {!isLoading && (
            <UserPagination
              currentPage={safePage}
              totalItems={filteredUsers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}
    </div>
  )
}

export default UserList
