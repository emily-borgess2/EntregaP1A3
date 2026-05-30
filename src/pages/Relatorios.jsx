import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import {
  getJogosMaisVendidos,
  getHistorico,
  getCategorias,
  getJogos,
  getEmpresas
} from '../services/api'
import { getCrianca, getSessoes } from '../services/dadosLocais'

const CORES = ['#7c9cbf', '#a8c5a0', '#d4a5a5', '#c9b8d9', '#f0c987']

function Relatorios() {
  const crianca = getCrianca()
  const sessoes = getSessoes()

  const [topJogos, setTopJogos] = useState([])
  const [rankingCategorias, setRankingCategorias] = useState([])
  const [vendas, setVendas] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [empresaFiltro, setEmpresaFiltro] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(function () {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const listaEmpresas = await getEmpresas()
        const maisVendidos = await getJogosMaisVendidos(10, empresaFiltro || null)
        const historico = await getHistorico()
        const categorias = await getCategorias()
        const jogos = await getJogos()

        setEmpresas(listaEmpresas || [])
        setTopJogos(maisVendidos || [])
        setVendas(historico || [])

        // Ranking de vendas por categoria
        if (maisVendidos && jogos && categorias) {
          const totais = {}
          categorias.forEach(function (cat) {
            totais[cat.nome] = 0
          })

          maisVendidos.forEach(function (item) {
            const jogo = jogos.find(function (j) { return j.nome === item.nome })
            if (jogo) {
              const cat = categorias.find(function (c) { return c.id === jogo.fk_categoria })
              const nome = cat ? cat.nome : 'Outros'
              totais[nome] = (totais[nome] || 0) + Number(item.total)
            }
          })

          const ranking = Object.keys(totais)
            .filter(function (nome) { return totais[nome] > 0 })
            .map(function (nome) {
              return { name: nome, value: totais[nome] }
            })
            .sort(function (a, b) { return b.value - a.value })

          setRankingCategorias(ranking)
        }
      } catch (err) {
        setErro(err.message)
      }
      setCarregando(false)
    }
    carregar()
  }, [empresaFiltro])

  const totalCompras = vendas.length
  const valorTotal = vendas.reduce(function (soma, v) {
    return soma + Number(v.valor_total)
  }, 0)
  const totalAcertos = sessoes.reduce(function (s, x) { return s + x.acertos }, 0)
  const totalErros = sessoes.reduce(function (s, x) { return s + x.erros }, 0)

  const dadosSessoes = sessoes.map(function (s, i) {
    return { nome: 'Sessão ' + (i + 1), acertos: s.acertos, erros: s.erros }
  })

  const dadosDesempenho = [
    { name: 'Acertos', value: totalAcertos },
    { name: 'Erros', value: totalErros }
  ]

  const dadosRanking = topJogos.map(function (j, i) {
    return {
      posicao: '#' + (i + 1),
      nome: j.nome.length > 20 ? j.nome.substring(0, 20) + '...' : j.nome,
      empresa: j.empresa,
      vendas: j.total
    }
  })

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

      <div className="filtros">
        <div className="campo">
          <label htmlFor="empresaRel">Filtrar por empresa</label>
          <select
            id="empresaRel"
            value={empresaFiltro}
            onChange={(e) => setEmpresaFiltro(e.target.value)}
          >
            <option value="">Todas as empresas</option>
            {empresas.map(function (emp) {
              return <option key={emp.id} value={emp.id}>{emp.nome}</option>
            })}
          </select>
        </div>
      </div>

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
          <span className="indicador-numero">{totalCompras}</span>
          <span className="indicador-label">Compras feitas</span>
        </div>
        <div className="card-indicador">
          <span className="indicador-numero">R$ {valorTotal.toFixed(2)}</span>
          <span className="indicador-label">Valor gasto</span>
        </div>
      </div>

      <section className="secao-grafico">
        <h2>Ranking de jogos mais vendidos</h2>
        {dadosRanking.length > 0 ? (
          <table className="tabela-ranking">
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Jogo</th>
                <th>Empresa</th>
                <th>Vendas</th>
              </tr>
            </thead>
            <tbody>
              {dadosRanking.map(function (item, i) {
                return (
                  <tr key={i}>
                    <td>{item.posicao}</td>
                    <td>{item.nome}</td>
                    <td>{item.empresa}</td>
                    <td>{item.vendas}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <p>Sem dados de vendas ainda. Faça compras para gerar o ranking.</p>
        )}
      </section>

      <section className="secao-grafico">
        <h2>Jogos mais vendidos {empresaFiltro ? '(por empresa)' : '(geral)'}</h2>
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
          <p>Sem dados de vendas.</p>
        )}
      </section>

      <section className="secao-grafico">
        <h2>Ranking de vendas por categoria</h2>
        {rankingCategorias.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rankingCategorias} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#a8c5a0" name="Vendas" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Sem vendas por categoria ainda.</p>
        )}
      </section>

      {crianca && (
        <>
          <section className="secao-grafico">
            <h2>Desempenho por sessão — {crianca.nome}</h2>
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
              <p>Jogue uma sessão para ver o desempenho.</p>
            )}
          </section>

          <section className="secao-grafico">
            <h2>Acertos vs erros (total)</h2>
            {totalAcertos + totalErros > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={dadosDesempenho} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    <Cell fill="#a8c5a0" />
                    <Cell fill="#d4a5a5" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>Sem dados de desempenho.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default Relatorios
