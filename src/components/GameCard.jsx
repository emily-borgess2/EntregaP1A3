import { Link } from 'react-router-dom'

function GameCard({ jogo, categorias }) {
  // Busca nome da categoria pelo id
  let nomeCategoria = ''
  if (categorias && jogo.fk_categoria) {
    const cat = categorias.find(c => c.id === jogo.fk_categoria)
    nomeCategoria = cat ? cat.nome : ''
  } else if (jogo.categoria) {
    nomeCategoria = jogo.categoria
  }

  const precoFinal = jogo.desconto
    ? (jogo.preco - jogo.desconto).toFixed(2)
    : jogo.preco.toFixed(2)

  return (
    <article className="card-jogo">
      <div className="card-jogo-icone" aria-hidden="true">🎮</div>
      <h3>{jogo.nome}</h3>
      {nomeCategoria && <span className="tag">{nomeCategoria}</span>}
      <p className="preco">R$ {precoFinal}</p>
      {jogo.id && (
        <Link to={'/jogos/' + jogo.id} className="btn btn-primario btn-pequeno">
          Ver detalhes
        </Link>
      )}
    </article>
  )
}

export default GameCard
