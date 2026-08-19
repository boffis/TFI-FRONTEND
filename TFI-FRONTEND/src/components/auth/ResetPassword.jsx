import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import useFetch from '../../hooks/useFetch'
import Layout from '../layout/Layout'
import { validatePassword, validateRepeatPassword } from './validation'

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

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const { post, isLoading } = useFetch()

  const [form, setForm] = useState({ password: '', repeatPassword: '' })
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null) // null | { ok: true } | { ok: false, message: string }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}

    const passwordError = validatePassword(form.password)
    if (passwordError) newErrors.password = passwordError

    const repeatPasswordError = validateRepeatPassword(form.password, form.repeatPassword)
    if (repeatPasswordError) newErrors.repeatPassword = repeatPasswordError

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    const email = searchParams.get('email')
    const token = searchParams.get('token')

    post(
      'auth/resetpassword',
      false,
      { Email:email, Token:token, NewPassword: form.password },
      () => setResult({ ok: true }),
      (err) => { console.log(err);
        setResult({ ok: false, message: err.message || 'Algo salió mal. Intentá de nuevo.' })}
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold text-white">Restablecer contraseña</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Elegí una nueva contraseña para tu cuenta.
        </p>

        {result?.ok && (
          <div className="mt-8 rounded-lg border border-orange-500/40 bg-orange-500/10 px-5 py-4">
            <p className="text-sm font-medium text-orange-300">¡Contraseña actualizada!</p>
            <p className="mt-1 text-sm text-zinc-400">
              Tu contraseña se restableció correctamente. Ya podés iniciar sesión con la nueva.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-block rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Ir a iniciar sesión
            </Link>
          </div>
        )}

        {result && !result.ok && (
          <div className="mt-8 rounded-lg border border-red-500/40 bg-red-500/10 px-5 py-4">
            <p className="text-sm font-medium text-red-400">No se pudo restablecer</p>
            <p className="mt-1 text-sm text-zinc-400">{result.message}</p>
            <Link
              to="/home"
              className="mt-4 inline-block rounded-lg bg-zinc-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-600"
            >
              Volver al inicio
            </Link>
          </div>
        )}

        {!result && (
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <Field label="Nueva contraseña" id="password" error={errors.password}>
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

            <Field label="Repetir nueva contraseña" id="repeatPassword" error={errors.repeatPassword}>
              <input
                id="repeatPassword"
                name="repeatPassword"
                type="password"
                value={form.repeatPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass(errors.repeatPassword)}
              />
            </Field>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Restableciendo…' : 'Restablecer contraseña'}
            </button>
          </form>
        )}
      </section>
    </Layout>
  )
}

export default ResetPassword
