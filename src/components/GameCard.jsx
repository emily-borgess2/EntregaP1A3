import { Link } from 'react-router-dom'
import { NOMES_PERFIL } from '../services/dadosLocais'

function GameCard({ jogo, categorias }) {
  let nomeCategoria = ''
  if (categorias && jogo.fk_categoria) {
    const cat = categorias.find(c => c.id === jogo.fk_categoria)
    nomeCategoria = cat ? cat.nome : ''
  } else if (jogo.categoria) {
    nomeCategoria = jogo.categoria
  }

  const perfil = jogo.perfilAprendizagem || jogo.perfil_aprendizagem

  return (
    <article className="card-jogo">
      <div className="card-jogo-icone" aria-hidden="true">🎮</div>
      <h3>{jogo.nome}</h3>
      {perfil && <span className="tag">{NOMES_PERFIL[perfil] || perfil}</span>}
      {nomeCategoria && <span className="tag tag-suave">{nomeCategoria}</span>}
      <p className="incluso-plano">Incluso no plano</p>
      {jogo.id && (
        <Link to={'/jogos/' + jogo.id} className="btn btn-primario btn-pequeno">
          Ver detalhes
        </Link>
      )}
    </article>
  )
}

export default GameCard
