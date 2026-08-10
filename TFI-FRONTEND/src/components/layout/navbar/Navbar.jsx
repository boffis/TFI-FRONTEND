import { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { HiUser, HiChevronDown } from 'react-icons/hi'
import { AuthContext, ROLE } from '../../../services/authContext/AuthContext'
import { capitalizeWords, capitalizeFirst } from '../../../utils/formatters'

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/classes', label: 'Classes' },
  { to: '/memberships', label: 'Memberships' },
]

// ─── User dropdown ────────────────────────────────────────────────────────────
const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const go = (path) => {
    setOpen(false)
    navigate(path)
  }

  const handleLogout = () => {
    setOpen(false)
    onLogout()
    navigate('/home')
  }

  const menuItems = [
    { label: 'Account', path: '/account', show: true },
    {
      label: 'Trainer Dashboard',
      path: '/trainer/dashboard',
      show: user.role === ROLE.TRAINER,
    },
    {
      label: 'Admin Dashboard',
      path: '/admin/dashboard',
      show: user.role === ROLE.ADMIN,
    },
  ].filter((item) => item.show)

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white focus:outline-none"
      >
        <HiUser className="h-4 w-4 text-orange-500" />
        <span>Welcome, {capitalizeFirst(user.name?.split(" ")[0])}</span>
        <HiChevronDown
          className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/40">
          <div className="border-b border-zinc-800 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Signed in as
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-white">
              {capitalizeWords(user.name)}
            </p>
          </div>

          <ul className="py-1">
            {menuItems.map(({ label, path }) => (
              <li key={path}>
                <button
                  onClick={() => go(path)}
                  className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-zinc-800 py-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-400 transition-colors hover:bg-zinc-800 hover:text-red-300"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, handleLogout } = useContext(AuthContext)

  return (
    <header className="relative z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Brand */}
        <NavLink to="/home" className="text-xl font-bold tracking-tight text-white">
          High Level <span className="text-orange-500">Performance</span>
        </NavLink>

        {/* Nav links */}
        <ul className="hidden items-center gap-6 sm:flex">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-orange-500' : 'text-zinc-400 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Join now
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
