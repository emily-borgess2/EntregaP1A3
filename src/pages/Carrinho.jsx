import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getCarrinho,
  getJogos,
  removerDoCarrinho,
  finalizarCompra,
  pagar
} from '../services/api'
import { getCrianca, getPlano, getPrecoPlano, NOMES_PERFIL, PLANOS } from '../services/dadosLocais'

function Carrinho() {
  const crianca = getCrianca()
  const planoId = getPlano()
  const [itens, setItens] = useState([])
  const [jogosMap, setJogosMap] = useState({})
  const [erro, setErro] = useState('')
  const [msg, setMsg] = useState('')
  const [metodoPagamento, setMetodoPagamento] = useState('pix')
  const [carregando, setCarregando] = useState(true)

  const precoPlano = crianca && planoId
    ? getPrecoPlano(planoId, crianca.transtorno)
    : 0
  const nomePlano = planoId ? PLANOS[planoId].nome : '-'

  async function carregarCarrinho() {
    setCarregando(true)
    setErro('')
    try {
      const resposta = await getCarrinho()
      const perfil = crianca ? crianca.transtorno : null
      const listaJogos = await getJogos(perfil)

      const mapa = {}
      if (listaJogos) {
        listaJogos.forEach(function (j) {
          mapa[j.id] = j
        })
      }
      setJogosMap(mapa)

      if (resposta && resposta.carrinho && resposta.carrinho.itens) {
        setItens(resposta.carrinho.itens)
      } else {
        setItens([])
      }
    } catch (err) {
      setErro(err.message)
    }
    setCarregando(false)
  }

  useEffect(function () {
    carregarCarrinho()
  }, [])

  async function handleRemover(jogoId) {
    setErro('')
    try {
      await removerDoCarrinho(jogoId)
      setMsg('Jogo removido do carrinho.')
      carregarCarrinho()
    } catch (err) {
      setErro(err.message)
    }
  }

  async function handleFinalizar() {
    setErro('')
    setMsg('')
    if (!planoId || !crianca) {
      setErro('Selecione um plano e cadastre a criança antes de finalizar.')
      return
    }
    try {
      await pagar(metodoPagamento, { confirmado: true })
      const resposta = await finalizarCompra(planoId, crianca.transtorno)
      setMsg(resposta.message || 'Assinatura do plano confirmada!')
      setItens([])
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <div className="pagina">
      <h1>Carrinho</h1>
      <p className="texto-ajuda">
        Os jogos não têm preço individual. Você paga a assinatura do plano
        {crianca ? ' para o perfil ' + NOMES_PERFIL[crianca.transtorno] : ''}.
      </p>

      {carregando && <p>Carregando carrinho...</p>}
      {erro && <p className="msg-erro" role="alert">{erro}</p>}
      {msg && <p className="msg-sucesso" role="status">{msg}</p>}

      {!carregando && itens.length === 0 && (
        <div className="carrinho-vazio">
          <p>Seu carrinho está vazio.</p>
          <Link to="/jogos" className="btn btn-primario">Ver jogos</Link>
        </div>
      )}

      {itens.length > 0 && (
        <>
          <div className="card-plano-resumo">
            <p><strong>Plano:</strong> {nomePlano}</p>
            {crianca && (
              <p><strong>Perfil:</strong> {NOMES_PERFIL[crianca.transtorno]}</p>
            )}
            <p className="plano-preco">
              {precoPlano === 0 ? 'Grátis' : 'R$ ' + precoPlano.toFixed(2) + '/mês'}
            </p>
          </div>

          <h2>Jogos selecionados (inclusos no plano)</h2>
          <ul className="lista-carrinho">
            {itens.map(function (item) {
              const jogo = jogosMap[item.fkJogo]
              const nome = jogo ? jogo.nome : 'Jogo #' + item.fkJogo

              return (
                <li key={item.id} className="item-carrinho">
                  <div>
                    <strong>{nome}</strong>
                    <p className="incluso-plano">Incluso no plano</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-perigo btn-pequeno"
                    onClick={() => handleRemover(item.fkJogo)}
                  >
                    Remover
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="pagamento">
            <h2>Forma de pagamento</h2>
            <div className="campo">
              <label htmlFor="metodo">Escolha o método</label>
              <select
                id="metodo"
                value={metodoPagamento}
                onChange={(e) => setMetodoPagamento(e.target.value)}
              >
                <option value="pix">PIX</option>
                <option value="cartao">Cartão de crédito</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>

            <button type="button" className="btn btn-primario btn-largo" onClick={handleFinalizar}>
              Finalizar assinatura
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Carrinho
