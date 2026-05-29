import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { getJogosMaisVendidos, getHistorico, getCategorias, getJogos } from '../services/api'

// Cores suaves para os gráficos
const CORES = ['#7c9cbf', '#a8c5a0', '#d4a5a5', '#c9b8d9', '#f0c987']

function Relatorios() {
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

        // Monta dados do gráfico de pizza por categoria
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

  // Indicadores simples
  const totalCompras = vendas.length
  const valorTotal = vendas.reduce(function (soma, v) {
    return soma + Number(v.valor_total)
  }, 0)
  const totalItens = vendas.reduce(function (soma, v) {
    return soma + Number(v.quantidade)
  }, 0)

  // Prepara dados do gráfico de barras
  const dadosBarras = topJogos.map(function (j) {
    return {
      nome: j.nome.length > 15 ? j.nome.substring(0, 15) + '...' : j.nome,
      vendas: j.total
    }
  })

  return (
    <div className="pagina">
      <h1>Relatórios</h1>
      <p className="texto-ajuda">
        Gráficos simples para acompanhar vendas e catálogo de jogos.
      </p>

      {carregando && <p>Carregando relatórios...</p>}
      {erro && <p className="msg-erro" role="alert">{erro}</p>}

      {/* Cards com indicadores */}
      <div className="cards-indicadores">
        <div className="card-indicador">
          <span className="indicador-numero">{totalCompras}</span>
          <span className="indicador-label">Compras feitas</span>
        </div>
        <div className="card-indicador">
          <span className="indicador-numero">R$ {valorTotal.toFixed(2)}</span>
          <span className="indicador-label">Valor total gasto</span>
        </div>
        <div className="card-indicador">
          <span className="indicador-numero">{totalItens}</span>
          <span className="indicador-label">Jogos comprados</span>
        </div>
      </div>

      {/* Gráfico de barras - jogos mais vendidos */}
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

      {/* Gráfico de pizza - jogos por categoria */}
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
