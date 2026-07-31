import { Link } from 'react-router'
import Layout from '../layout/Layout'

const features = [
  {
    title: 'Modern Equipment',
    description: 'Train with top-tier machines and free weights in a spacious facility.',
  },
  {
    title: 'Expert Trainers',
    description: 'Get guidance from certified coaches who help you reach your goals.',
  },
  {
    title: 'Group Classes',
    description: 'Join HIIT, yoga, spinning, and more — something for every level.',
  },
]

const Home = () => {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-orange-500">
            Welcome to high Level Performance
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Push harder. Train smarter. Become stronger.
          </h1>
          <p className="mt-6 text-lg text-zinc-400">
            A gym built for people who show up. Flexible memberships, expert coaching,
            and a community that keeps you motivated.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/memberships"
              className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Start your membership
            </Link>
            <Link
              to="/classes"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              Browse classes
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
