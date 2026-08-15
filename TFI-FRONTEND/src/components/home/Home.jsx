import { Link } from 'react-router'
import Layout from '../layout/Layout'

const features = [
  {
    title: 'Equipamiento moderno',
    description: 'Entrená con máquinas de primer nivel y peso libre en un espacio amplio.',
  },
  {
    title: 'Entrenadores expertos',
    description: 'Contá con el acompañamiento de profesionales certificados que te ayudan a alcanzar tus objetivos.',
  },
  {
    title: 'Clases grupales',
    description: 'Sumate a HIIT, yoga, spinning y más: hay algo para cada nivel.',
  },
]

const Home = () => {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-orange-500">
            Bienvenido a High Level Performance
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Exigite más. Entrená mejor. Volvete más fuerte.
          </h1>
          <p className="mt-6 text-lg text-zinc-400">
            Un gimnasio pensado para los que están presentes. Membresías flexibles, entrenadores
            expertos y una comunidad que te mantiene motivado.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/memberships"
              className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Comenzá tu membresía
            </Link>
            <Link
              to="/classes"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              Ver clases
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-3 sm:px-6">
          {features.map(({ title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default Home
