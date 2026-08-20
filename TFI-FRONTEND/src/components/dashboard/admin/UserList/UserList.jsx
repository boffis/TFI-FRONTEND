import { useEffect, useMemo, useState } from 'react'
import useFetch from '../../../../hooks/useFetch'
import UserFilters from './UserFilters'
import UserSortControls from './UserSortControls'
import UserTable from './UserTable'
import UserPagination from './UserPagination'
import { explainApiError } from '../../../../utils/errorMessages'

const DEFAULT_PAGE_SIZE = 10

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

const UserList = () => {
  const { get, isLoading } = useFetch()

  const [allUsers, setAllUsers] = useState([])
  const [error, setError]       = useState(null)

  const [searchQuery,      setSearchQuery]      = useState('')
  const [roleFilter,       setRoleFilter]       = useState('')
  const [membershipFilter, setMembershipFilter] = useState('')

  const [sortField,     setSortField]     = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize,    setPageSize]    = useState(DEFAULT_PAGE_SIZE)

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
      (err) => setError(explainApiError(err, 'No se pudieron cargar los usuarios.'))
    )
  }, [])

  const resetPage = () => setCurrentPage(1)

  const handleSearch      = v => { setSearchQuery(v);      resetPage() }
  const handleRole        = v => { setRoleFilter(v);       resetPage() }
  const handleMembership  = v => { setMembershipFilter(v); resetPage() }
  const handleSortField   = v => { setSortField(v);        resetPage() }
  const handleDirectionToggle = () => {
    setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    resetPage()
  }

  const filteredUsers = useMemo(() => {
    let list = [...allUsers]

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.dni?.toLowerCase().includes(q)
      )
    }

    if (roleFilter) {
      list = list.filter(u => u.role === roleFilter)
    }

    // Only Clients carry isMembershipActive.
    if (membershipFilter !== '') {
      const active = membershipFilter === 'true'
      list = list.filter(u => u.role === 'Client' && u.isMembershipActive === active)
    }

    list.sort((a, b) => compareValues(a, b, sortField, sortDirection))

    return list
  }, [allUsers, searchQuery, roleFilter, membershipFilter, sortField, sortDirection])

  const totalPages    = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const safePage      = Math.min(currentPage, totalPages)
  const start         = (safePage - 1) * pageSize
  const currentUsers  = filteredUsers.slice(start, start + pageSize)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">Usuarios</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Gestioná todos los clientes, entrenadores y administradores.
        </p>
      </div>

      {error && !isLoading && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-10 text-center">
          <p className="font-semibold text-red-400">{error}</p>
          <p className="mt-1 text-sm text-zinc-500">Intentá de nuevo más tarde.</p>
        </div>
      )}

      {!error && (
        <>
          <UserFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            roleFilter={roleFilter}
            onRoleChange={handleRole}
            membershipFilter={membershipFilter}
            onMembershipChange={handleMembership}
          />

          <UserSortControls
            sortField={sortField}
            sortDirection={sortDirection}
            onSortFieldChange={handleSortField}
            onSortDirectionToggle={handleDirectionToggle}
          />

          <UserTable users={currentUsers} isLoading={isLoading} />

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
