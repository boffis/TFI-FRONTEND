import { Link } from 'react-router'
import Layout from '../layout/Layout'

const SuccessfulRegister = () => {
  return (
    <Layout>
      <section className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-24 text-center">

        {/* Animated checkmark circle */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/15 ring-1 ring-orange-500/40">
          <svg
            className="h-10 w-10 text-orange-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white">¡Registro exitoso!</h1>

        <p className="mt-4 text-zinc-400 leading-relaxed">
          Tu cuenta fue creada. Enviamos un correo de confirmación a la dirección que indicaste:
          revisá tu bandeja de entrada y hacé clic en el enlace para activar tu cuenta.
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          ¿No encontrás el correo? Revisá la carpeta de spam o correo no deseado.
        </p>

        <Link
          to="/login"
          className="mt-10 inline-block rounded-lg bg-orange-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Ir a iniciar sesión
        </Link>
      </section>
    </Layout>
  )
}

export default SuccessfulRegister
