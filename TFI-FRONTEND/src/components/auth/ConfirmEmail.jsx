import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import useFetch from '../../hooks/useFetch'
import Layout from '../layout/Layout'

const Spinner = () => (
  <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center">
    <svg
      className="h-10 w-10 animate-spin text-orange-400"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Cargando"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  </div>
)

const CheckIcon = () => (
  <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/15 ring-1 ring-orange-500/40">
    <svg
      className="h-10 w-10 text-orange-400"
      fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2.2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
)

const ErrorIcon = () => (
  <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/40">
    <svg
      className="h-10 w-10 text-red-400"
      fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2.2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </div>
)

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams()
  const { post } = useFetch()

  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  // Guards against React Strict Mode double-firing.
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const email = searchParams.get('email')
    const token = searchParams.get('token')

    const query = new URLSearchParams({ email, token }).toString()

    post(
      `auth/confirmemail?${query}`,
      false,
      null,
      () => setStatus('success'),
      (err) => {
        setErrorMessage(err.message || 'Ocurrió un error inesperado.')
        setStatus('error')
      }
    )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      <section className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-24 text-center">

        {status === 'loading' && (
          <>
            <Spinner />
            <h1 className="text-2xl font-bold text-white">Confirmando tu correo…</h1>
            <p className="mt-3 text-zinc-400">
              Esperá un momento mientras verificamos tu cuenta.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckIcon />
            <h1 className="text-3xl font-bold text-white">¡Correo confirmado!</h1>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              Tu dirección de correo fue verificada. Ya podés iniciar sesión en tu cuenta.
            </p>
            <Link
              to="/login"
              className="mt-10 inline-block rounded-lg bg-orange-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Ir a iniciar sesión
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorIcon />
            <h1 className="text-3xl font-bold text-white">Algo salió mal</h1>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              Lo sentimos, no pudimos confirmar tu dirección de correo.
            </p>
            {errorMessage && (
              <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errorMessage}
              </p>
            )}
            <Link
              to="/home"
              className="mt-10 inline-block rounded-lg bg-zinc-700 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-600"
            >
              Volver al inicio
            </Link>
          </>
        )}

      </section>
    </Layout>
  )
}

export default ConfirmEmail
