import { useEffect, useState } from 'react'
import { getJogos, getCategorias } from '../services/api'
import { getPlano, getCrianca, NOMES_PERFIL, PLANOS } from '../services/dadosLocais'
import GameCard from '../components/GameCard'

function Jogos() {
  const crianca = getCrianca()
  const [jogos, setJogos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  const perfil = crianca ? crianca.transtorno : ''

  useEffect(function () {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const listaJogos = await getJogos(perfil, categoriaFiltro || null)
        const listaCategorias = await getCategorias()
        setJogos(listaJogos || [])
        setCategorias(listaCategorias || [])
      } catch (err) {
        setErro(err.message)
      }
      setCarregando(false)
    }
    carregar()
  }, [perfil, categoriaFiltro])

  const jogosFiltrados = jogos.filter(function (jogo) {
    if (busca && !jogo.nome.toLowerCase().includes(busca.toLowerCase())) {
      return false
    }
    return true
  })

  const planoId = getPlano()
  const limite = planoId ? PLANOS[planoId].limiteJogos : 4
  const jogosDoPlano = jogosFiltrados.slice(0, limite)
  const nomePlano = planoId ? PLANOS[planoId].nome : 'Básico'

  return (
    <div className="pagina">
      <h1>Jogos educativos</h1>
      {crianca && (
        <p className="texto-ajuda">
          Jogos para <strong>{crianca.nome}</strong> — perfil <strong>{NOMES_PERFIL[perfil]}</strong>.
          Plano {nomePlano}: até {limite} jogos. Sem preço individual — inclusos na assinatura.
        </p>
      )}

      <div className="filtros">
        <div className="campo">
          <label htmlFor="busca">Buscar por nome</label>
          <input
            id="busca"
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite o nome do jogo"
          />
        </div>

        <div className="campo">
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map(function (cat) {
              return <option key={cat.id} value={cat.nome}>{cat.nome}</option>
            })}
          </select>
        </div>
      </div>

      {erro && <p className="msg-erro" role="alert">{erro}</p>}
      {carregando && <p>Carregando jogos...</p>}

      <div className="grid-jogos">
        {jogosDoPlano.map(function (jogo) {
          return <GameCard key={jogo.id} jogo={jogo} categorias={categorias} />
        })}
      </div>

      {!carregando && jogosDoPlano.length === 0 && (
        <p>Nenhum jogo encontrado para este perfil.</p>
      )}
    </div>
  )
}

export default Jogos
