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
      (err) => setResult({ ok: false, message: err.message || 'Something went wrong. Please try again.' })
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold text-white">Forgot password</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Remembered it?{' '}
          <Link to="/login" className="font-medium text-orange-500 hover:text-orange-400">
            Log in
          </Link>
        </p>

        {/* ── Success ── */}
        {result?.ok && (
          <div className="mt-8 rounded-lg border border-orange-500/40 bg-orange-500/10 px-5 py-4">
            <p className="text-sm font-medium text-orange-300">Check your inbox</p>
            <p className="mt-1 text-sm text-zinc-400">
              If an account with that email exists, we&apos;ve sent a link to reset your password.
            </p>
          </div>
        )}

        {/* ── Error ── */}
        {result && !result.ok && (
          <div className="mt-8 rounded-lg border border-red-500/40 bg-red-500/10 px-5 py-4">
            <p className="text-sm font-medium text-red-400">Request failed</p>
            <p className="mt-1 text-sm text-zinc-400">{result.message}</p>
          </div>
        )}

        {/* ── Form — hidden once a result arrives ── */}
        {!result && (
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email address
              </label>
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass(emailError)}
              />
              <p className="text-xs text-zinc-500">
                We&apos;ll send a reset link to this address if it&apos;s registered.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
      </section>
    </Layout>
  )
}

export default ForgotPassword
