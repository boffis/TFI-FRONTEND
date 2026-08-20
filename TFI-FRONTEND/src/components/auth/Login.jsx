import { useState, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import useFetch from '../../hooks/useFetch'
import Layout from '../layout/Layout'
import { validateEmail, validatePassword } from './validation'
import { AuthContext } from '../../services/authContext/AuthContext'
import { explainApiError } from '../../utils/errorMessages'

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none ${
    hasError
      ? 'border-red-500 focus:border-red-500'
      : 'border-zinc-700 focus:border-orange-500'
  }`

const Field = ({ label, id, error, children }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
      {label}
    </label>
    {error && <p className="text-sm text-red-500">{error}</p>}
    {children}
  </div>
)

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { handleLogin } = useContext(AuthContext)
  // Set by useFetch or ProtectedLogin when they end the session.
  const sessionExpired = location.state?.sessionExpired === true
  const { post, isLoading } = useFetch()
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}

    const emailError = validateEmail(form.email)
    if (emailError) newErrors.email = emailError

    const passwordError = validatePassword(form.password)
    if (passwordError) newErrors.password = passwordError

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setApiError(null)

    post(
      'auth/signin',
      false,
      { email: form.email, password: form.password },
      (res) => {
        console.log(res)
        handleLogin(res)
        navigate('/home')
      },
      (err) => setApiError(explainApiError(err, 'No se pudo iniciar sesión'))
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold text-white">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-zinc-400">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-medium text-orange-500 hover:text-orange-400">
            Registrate
          </Link>
        </p>

        {sessionExpired && !apiError && (
          <p className="mt-6 rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm text-orange-300">
            Tu sesión venció. Iniciá sesión de nuevo para continuar.
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <Field label="Correo electrónico" id="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tucorreo@ejemplo.com"
              className={inputClass(errors.email)}
            />
          </Field>

          <Field label="Contraseña" id="password" error={errors.password}>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass(errors.password)}
            />
          </Field>

          <div className="text-right -mt-2">
            <Link
              to="/forgot-password"
              className="text-xs text-zinc-400 hover:text-orange-400 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {apiError && (
            <p className="text-sm text-red-500">{apiError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>
      </section>
    </Layout>
  )
}

export default Login
