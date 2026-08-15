import Navbar from './navbar/Navbar'

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
        <Navbar />
        <main className="flex-1">
            {children}
        </main>
        <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} IronFit Gym. Todos los derechos reservados.
        </footer>
        </div>
    )
}

export default Layout
