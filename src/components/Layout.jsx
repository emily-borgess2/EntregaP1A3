import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="conteudo-principal">
        {children}
      </main>
      <footer className="rodape">
        <p>Cognify — Jogos educativos adaptativos para crianças neurodivergentes</p>
      </footer>
    </div>
  )
}

export default Layout
