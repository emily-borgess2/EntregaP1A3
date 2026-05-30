import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlanos } from '../services/api'
import { getCrianca, salvarPlano, NOMES_PERFIL, formatarPrecoPlano, PLANOS } from '../services/dadosLocais'

function Planos() {
  const navigate = useNavigate()
  const crianca = getCrianca()
  const [planoEscolhido, setPlanoEscolhido] = useState('')
  const [planos, setPlanos] = useState([])
  const [erro, setErro] = useState('')

  useEffect(function () {
    async function carregar() {
      try {
        const lista = await getPlanos()
        setPlanos(lista || Object.values(PLANOS))
      } catch (err) {
        setPlanos(Object.values(PLANOS))
      }
    }
    carregar()
  }, [])

  function getPreco(plano) {
    const perfil = crianca ? crianca.transtorno : 'tdah'
    if (plano.precos && plano.precos[perfil] !== undefined) {
      return plano.precos[perfil]
    }
    return PLANOS[plano.id]?.precos[perfil] ?? 0
  }

  function handleConfirmar() {
    if (!planoEscolhido) return
    salvarPlano(planoEscolhido)
    navigate('/dashboard')
  }

  return (
    <div className="pagina">
      <h1>Escolha seu plano</h1>
      <p className="texto-ajuda">
        {crianca
          ? 'Preços para o perfil ' + NOMES_PERFIL[crianca.transtorno] + ' de ' + crianca.nome + '. Os jogos não têm preço avulso — vêm inclusos no plano.'
          : 'O plano define quantos jogos a criança pode acessar.'}
      </p>

      {erro && <p className="msg-erro">{erro}</p>}

      <div className="grid-planos">
        {planos.map(function (plano) {
          const selecionado = planoEscolhido === plano.id
          const preco = getPreco(plano)
          const precoTxt = preco === 0 ? 'Grátis' : 'R$ ' + preco + '/mês'

          return (
            <article
              key={plano.id}
              className={'card-plano' + (selecionado ? ' card-plano--ativo' : '')}
            >
              <h3>{plano.nome}</h3>
              <p className="plano-preco">{precoTxt}</p>
              <p>Até {plano.limiteJogos} jogos</p>
              <p className="texto-pequeno">Jogos inclusos no plano</p>
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

      {crianca && planoEscolhido && (
        <p className="msg-sucesso">
          Valor: {formatarPrecoPlano(planoEscolhido, crianca.transtorno)} para perfil {NOMES_PERFIL[crianca.transtorno]}
        </p>
      )}

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
