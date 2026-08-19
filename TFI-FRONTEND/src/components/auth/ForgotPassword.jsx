import { useState } from 'react'
import { Link } from 'react-router'
import useFetch from '../../hooks/useFetch'
import Layout from '../layout/Layout'
import { validateEmail } from './validation'

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none ${
    hasError
      ? 'border-red-500 focus:border-red-500'
      : 'border-zinc-700 focus:border-orange-500'
  }`

const ForgotPassword = () => {
  const { post, isLoading } = useFetch()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [result, setResult] = useState(null) // null | { ok: true } | { ok: false, message: string }

  const handleSubmit = (e) => {
    e.preventDefault()

    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }

    setEmailError('')

    post(
      'auth/forgotpassword',
      false,
      { Email: email },
      () => setResult({ ok: true }),
      (err) => setResult({ ok: false, message: err.message || 'Algo salió mal. Intentá de nuevo.' })
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold text-white">Recuperar contraseña</h1>
        <p className="mt-2 text-sm text-zinc-400">
          ¿Ya te acordaste?{' '}
          <Link to="/login" className="font-medium text-orange-500 hover:text-orange-400">
            Iniciá sesión
          </Link>
        </p>

        {result?.ok && (
          <div className="mt-8 rounded-lg border border-orange-500/40 bg-orange-500/10 px-5 py-4">
            <p className="text-sm font-medium text-orange-300">Revisá tu bandeja de entrada</p>
            <p className="mt-1 text-sm text-zinc-400">
              Si existe una cuenta con ese correo, te enviamos un enlace para restablecer tu contraseña.
            </p>
          </div>
        )}

        {result && !result.ok && (
          <div className="mt-8 rounded-lg border border-red-500/40 bg-red-500/10 px-5 py-4">
            <p className="text-sm font-medium text-red-400">No se pudo completar la solicitud</p>
            <p className="mt-1 text-sm text-zinc-400">{result.message}</p>
          </div>
        )}

        {!result && (
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Dirección de correo
              </label>
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className={inputClass(emailError)}
              />
              <p className="text-xs text-zinc-500">
                Si esta dirección está registrada, te enviamos un enlace para restablecerla.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Enviando…' : 'Enviar enlace'}
            </button>
          </form>
        )}
      </section>
    </Layout>
  )
}

export default ForgotPassword
