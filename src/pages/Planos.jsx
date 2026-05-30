import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PLANOS, salvarPlano } from '../services/dadosLocais'

function Planos() {
  const navigate = useNavigate()
  const [planoEscolhido, setPlanoEscolhido] = useState('')

  function handleConfirmar() {
    if (!planoEscolhido) return
    salvarPlano(planoEscolhido)
    navigate('/dashboard')
  }

  return (
    <div className="pagina">
      <h1>Escolha seu plano</h1>
      <p className="texto-ajuda">
        O plano define quantos jogos a criança pode acessar na plataforma.
      </p>

      <div className="grid-planos">
        {Object.values(PLANOS).map(function (plano) {
          const selecionado = planoEscolhido === plano.id
          const precoTxt = plano.preco === 0 ? 'Grátis' : 'R$ ' + plano.preco + '/mês'

          return (
            <article
              key={plano.id}
              className={'card-plano' + (selecionado ? ' card-plano--ativo' : '')}
            >
              <h3>{plano.nome}</h3>
              <p className="plano-preco">{precoTxt}</p>
              <p>Até {plano.limiteJogos} jogos</p>
              <button
                type="button"
                className="btn btn-secundario btn-pequeno"
                onClick={() => setPlanoEscolhido(plano.id)}
              >
                {selecionado ? 'Selecionado' : 'Escolher'}
              </button>
            </article>
          )
        })}
      </div>

      <button
        type="button"
        className="btn btn-primario"
        disabled={!planoEscolhido}
        onClick={handleConfirmar}
      >
        Confirmar plano
      </button>
    </div>
  )
}

export default Planos
