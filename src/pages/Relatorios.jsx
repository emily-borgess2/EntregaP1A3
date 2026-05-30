import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { getJogosMaisVendidos, getHistorico, getCategorias, getJogos } from '../services/api'
import { getCrianca, getSessoes } from '../services/dadosLocais'

const CORES = ['#7c9cbf', '#a8c5a0', '#d4a5a5', '#c9b8d9', '#f0c987']

function Relatorios() {
  const crianca = getCrianca()
  const sessoes = getSessoes()

  const [topJogos, setTopJogos] = useState([])
  const [vendas, setVendas] = useState([])
  const [dadosPizza, setDadosPizza] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(function () {
    async function carregar() {
      try {
        const maisVendidos = await getJogosMaisVendidos(5)
        const historico = await getHistorico()
        const categorias = await getCategorias()
        const jogos = await getJogos()

        setTopJogos(maisVendidos || [])
        setVendas(historico || [])

        if (jogos && categorias) {
          const contagem = {}
          categorias.forEach(function (cat) {
            contagem[cat.id] = { nome: cat.nome, qtd: 0 }
          })
          jogos.forEach(function (jogo) {
            if (contagem[jogo.fk_categoria]) {
              contagem[jogo.fk_categoria].qtd += 1
            }
          })
          const pizza = Object.values(contagem)
            .filter(function (c) { return c.qtd > 0 })
            .map(function (c) {
              return { name: c.nome, value: c.qtd }
            })
          setDadosPizza(pizza)
        }
      } catch (err) {
        setErro(err.message)
      }
      setCarregando(false)
    }
    carregar()
  }, [])

  const totalCompras = vendas.length
  const valorTotal = vendas.reduce(function (soma, v) {
    return soma + Number(v.valor_total)
  }, 0)

  // Dados das sessões da criança
  const totalAcertos = sessoes.reduce(function (s, x) { return s + x.acertos }, 0)
  const totalErros = sessoes.reduce(function (s, x) { return s + x.erros }, 0)

  const dadosSessoes = sessoes.map(function (s, i) {
    return {
      nome: 'Sessão ' + (i + 1),
      acertos: s.acertos,
      erros: s.erros
    }
  })

  const dadosDesempenho = [
    { name: 'Acertos', value: totalAcertos },
    { name: 'Erros', value: totalErros }
  ]

  const dadosBarras = topJogos.map(function (j) {
    return {
      nome: j.nome.length > 15 ? j.nome.substring(0, 15) + '...' : j.nome,
      vendas: j.total
    }
  })

  return (
    <div className="pagina">
      <h1>Relatórios</h1>
      {crianca && (
        <p className="texto-ajuda">
          Desempenho de <strong>{crianca.nome}</strong> e dados da plataforma.
        </p>
      )}

      {carregando && <p>Carregando relatórios...</p>}
      {erro && <p className="msg-erro" role="alert">{erro}</p>}

      <div className="cards-indicadores">
        <div className="card-indicador">
          <span className="indicador-numero">{sessoes.length}</span>
          <span className="indicador-label">Sessões da criança</span>
        </div>
        <div className="card-indicador">
          <span className="indicador-numero">{totalAcertos}</span>
          <span className="indicador-label">Acertos totais</span>
        </div>
        <div className="card-indicador">
          <span className="indicador-numero">{totalErros}</span>
          <span className="indicador-label">Erros totais</span>
        </div>
        <div className="card-indicador">
          <span className="indicador-numero">{totalCompras}</span>
          <span className="indicador-label">Compras feitas</span>
        </div>
        <div className="card-indicador">
          <span className="indicador-numero">R$ {valorTotal.toFixed(2)}</span>
          <span className="indicador-label">Valor gasto</span>
        </div>
      </div>

      <section className="secao-grafico">
        <h2>Desempenho por sessão — {crianca ? crianca.nome : 'criança'}</h2>
        {dadosSessoes.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosSessoes}>
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="acertos" fill="#a8c5a0" name="Acertos" />
              <Bar dataKey="erros" fill="#d4a5a5" name="Erros" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Jogue uma sessão para ver o desempenho aqui.</p>
        )}
      </section>

      <section className="secao-grafico">
        <h2>Acertos vs erros (total)</h2>
        {totalAcertos + totalErros > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dadosDesempenho}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                <Cell fill="#a8c5a0" />
                <Cell fill="#d4a5a5" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Sem dados de desempenho ainda.</p>
        )}
      </section>

      <section className="secao-grafico">
        <h2>Jogos mais vendidos</h2>
        {dadosBarras.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosBarras}>
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="vendas" fill="#7c9cbf" name="Vendas" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Sem dados de vendas ainda.</p>
        )}
      </section>

      <section className="secao-grafico">
        <h2>Jogos por categoria</h2>
        {dadosPizza.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosPizza}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {dadosPizza.map(function (_, i) {
                  return <Cell key={i} fill={CORES[i % CORES.length]} />
                })}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Sem dados de categorias.</p>
        )}
      </section>
    </div>
  )
}

export default Relatorios
