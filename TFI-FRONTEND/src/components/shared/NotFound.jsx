import { Link } from 'react-router'
import Layout from '../layout/Layout'

const NotFound = () => {
  return (
    <Layout>
      <section className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-24 text-center">

        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/15 ring-1 ring-orange-500/40">
          <svg
            className="h-10 w-10 text-orange-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M12 21a9 9 0 100-18 9 9 0 000 18z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white">404</h1>

        <p className="mt-4 text-zinc-400 leading-relaxed">
          No encontramos la página que estás buscando. Puede que el enlace esté roto o que la página haya sido movida.
        </p>

        <Link
          to="/home"
          className="mt-10 inline-block rounded-lg bg-orange-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Volver al inicio
        </Link>
      </section>
    </Layout>
  )
}

export default NotFound
