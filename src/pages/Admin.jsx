import { useEffect, useState } from 'react'
import {
  getEmpresas,
  criarEmpresa,
  atualizarEmpresa,
  excluirEmpresa,
  getJogos,
  criarJogo,
  atualizarJogo,
  excluirJogo,
  getCategorias
} from '../services/api'

function Admin() {
  const [aba, setAba] = useState('empresas')
  const [empresas, setEmpresas] = useState([])
  const [jogos, setJogos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [msg, setMsg] = useState('')
  const [erro, setErro] = useState('')

  // Formulários
  const [nomeEmpresa, setNomeEmpresa] = useState('')
  const [editEmpresaId, setEditEmpresaId] = useState(null)

  const [formJogo, setFormJogo] = useState({
    nome: '', descricao: '', ano: '', preco: 0, desconto: '', fkEmpresa: '', fkCategoria: '', perfilAprendizagem: 'tdah'
  })
  const [editJogoId, setEditJogoId] = useState(null)

  async function carregarDados() {
    setErro('')
    try {
      const listaEmpresas = await getEmpresas()
      const listaJogos = await getJogos()
      const listaCategorias = await getCategorias()
      setEmpresas(listaEmpresas || [])
      setJogos(listaJogos || [])
      setCategorias(listaCategorias || [])
    } catch (err) {
      setErro(err.message)
    }
  }

  useEffect(function () {
    carregarDados()
  }, [])

  // --- Empresas ---
  async function handleSalvarEmpresa(e) {
    e.preventDefault()
    setMsg('')
    setErro('')
    try {
      if (editEmpresaId) {
        await atualizarEmpresa(editEmpresaId, nomeEmpresa)
        setMsg('Empresa atualizada!')
      } else {
        await criarEmpresa(nomeEmpresa)
        setMsg('Empresa criada!')
      }
      setNomeEmpresa('')
      setEditEmpresaId(null)
      carregarDados()
    } catch (err) {
      setErro(err.message)
    }
  }

  async function handleExcluirEmpresa(id) {
    if (!window.confirm('Excluir esta empresa?')) return
    setErro('')
    try {
      await excluirEmpresa(id)
      setMsg('Empresa excluída.')
      carregarDados()
    } catch (err) {
      setErro(err.message)
    }
  }

  function editarEmpresa(emp) {
    setEditEmpresaId(emp.id)
    setNomeEmpresa(emp.nome)
  }

  // --- Jogos ---
  async function handleSalvarJogo(e) {
    e.preventDefault()
    setMsg('')
    setErro('')

    const dados = {
      nome: formJogo.nome,
      descricao: formJogo.descricao,
      ano: Number(formJogo.ano),
      preco: 0,
      desconto: null,
      fkEmpresa: Number(formJogo.fkEmpresa),
      fkCategoria: Number(formJogo.fkCategoria),
      perfilAprendizagem: formJogo.perfilAprendizagem
    }

    try {
      if (editJogoId) {
        await atualizarJogo(editJogoId, dados)
        setMsg('Jogo atualizado!')
      } else {
        await criarJogo(dados)
        setMsg('Jogo criado!')
      }
      setFormJogo({ nome: '', descricao: '', ano: '', preco: 0, desconto: '', fkEmpresa: '', fkCategoria: '', perfilAprendizagem: 'tdah' })
      setEditJogoId(null)
      carregarDados()
    } catch (err) {
      setErro(err.message)
    }
  }

  async function handleExcluirJogo(id) {
    if (!window.confirm('Excluir este jogo?')) return
    setErro('')
    try {
      await excluirJogo(id)
      setMsg('Jogo excluído.')
      carregarDados()
    } catch (err) {
      setErro(err.message)
    }
  }

  function editarJogo(jogo) {
    setEditJogoId(jogo.id)
    setFormJogo({
      nome: jogo.nome,
      descricao: jogo.descricao || '',
      ano: jogo.ano,
      preco: 0,
      desconto: '',
      fkEmpresa: jogo.fk_empresa || jogo.fkEmpresa,
      fkCategoria: jogo.fk_categoria || jogo.fkCategoria,
      perfilAprendizagem: jogo.perfil_aprendizagem || jogo.perfilAprendizagem || 'tdah'
    })
  }

  function nomeCategoria(id) {
    const cat = categorias.find(c => c.id === id)
    return cat ? cat.nome : '-'
  }

  function buscarNomeEmpresa(id) {
    const emp = empresas.find(e => e.id === id)
    return emp ? emp.nome : '-'
  }

  return (
    <div className="pagina">
      <h1>Painel Administrativo</h1>
      <p className="texto-ajuda">Gerencie empresas, jogos e consulte categorias.</p>

      <div className="abas-admin">
        <button type="button" className={'btn btn-pequeno' + (aba === 'empresas' ? ' btn-primario' : ' btn-secundario')} onClick={() => setAba('empresas')}>Empresas</button>
        <button type="button" className={'btn btn-pequeno' + (aba === 'jogos' ? ' btn-primario' : ' btn-secundario')} onClick={() => setAba('jogos')}>Jogos</button>
        <button type="button" className={'btn btn-pequeno' + (aba === 'categorias' ? ' btn-primario' : ' btn-secundario')} onClick={() => setAba('categorias')}>Categorias</button>
      </div>

      {msg && <p className="msg-sucesso" role="status">{msg}</p>}
      {erro && <p className="msg-erro" role="alert">{erro}</p>}

      {aba === 'empresas' && (
        <section className="secao-admin">
          <h2>Gerenciar empresas</h2>
          <form onSubmit={handleSalvarEmpresa} className="form-admin">
            <div className="campo">
              <label htmlFor="nomeEmpresa">Nome da empresa</label>
              <input id="nomeEmpresa" type="text" value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primario">{editEmpresaId ? 'Atualizar' : 'Cadastrar'}</button>
          </form>
          <ul className="lista-admin">
            {empresas.map(function (emp) {
              return (
                <li key={emp.id}>
                  <span>{emp.nome}</span>
                  <div>
                    <button type="button" className="btn btn-pequeno btn-secundario" onClick={() => editarEmpresa(emp)}>Editar</button>
                    <button type="button" className="btn btn-pequeno btn-perigo" onClick={() => handleExcluirEmpresa(emp.id)}>Excluir</button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {aba === 'jogos' && (
        <section className="secao-admin">
          <h2>Gerenciar jogos</h2>
          <form onSubmit={handleSalvarJogo} className="form-admin">
            <div className="campo">
              <label htmlFor="nomeJogo">Nome</label>
              <input id="nomeJogo" type="text" value={formJogo.nome} onChange={(e) => setFormJogo({ ...formJogo, nome: e.target.value })} required />
            </div>
            <div className="campo">
              <label htmlFor="descJogo">Descrição</label>
              <textarea id="descJogo" value={formJogo.descricao} onChange={(e) => setFormJogo({ ...formJogo, descricao: e.target.value })} rows="2" />
            </div>
            <div className="form-linha">
              <div className="campo">
                <label htmlFor="anoJogo">Ano</label>
                <input id="anoJogo" type="number" value={formJogo.ano} onChange={(e) => setFormJogo({ ...formJogo, ano: e.target.value })} required />
              </div>
              <div className="campo">
                <label htmlFor="perfilJogo">Perfil de aprendizagem</label>
                <select id="perfilJogo" value={formJogo.perfilAprendizagem} onChange={(e) => setFormJogo({ ...formJogo, perfilAprendizagem: e.target.value })} required>
                  <option value="tdah">TDAH</option>
                  <option value="tea">TEA leve</option>
                  <option value="dislexia">Dislexia</option>
                </select>
              </div>
            </div>
            <p className="texto-pequeno">Jogos não têm preço — inclusos no plano.</p>
            <div className="form-linha">
              <div className="campo">
                <label htmlFor="empresaJogo">Empresa</label>
                <select id="empresaJogo" value={formJogo.fkEmpresa} onChange={(e) => setFormJogo({ ...formJogo, fkEmpresa: e.target.value })} required>
                  <option value="">Selecione</option>
                  {empresas.map(function (emp) {
                    return <option key={emp.id} value={emp.id}>{emp.nome}</option>
                  })}
                </select>
              </div>
              <div className="campo">
                <label htmlFor="catJogo">Categoria</label>
                <select id="catJogo" value={formJogo.fkCategoria} onChange={(e) => setFormJogo({ ...formJogo, fkCategoria: e.target.value })} required>
                  <option value="">Selecione</option>
                  {categorias.map(function (cat) {
                    return <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  })}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primario">{editJogoId ? 'Atualizar jogo' : 'Cadastrar jogo'}</button>
          </form>
          <ul className="lista-admin">
            {jogos.map(function (jogo) {
              const empId = jogo.fk_empresa || jogo.fkEmpresa
              const catId = jogo.fk_categoria || jogo.fkCategoria
              return (
                <li key={jogo.id}>
                  <span><strong>{jogo.nome}</strong> — {buscarNomeEmpresa(empId)} · {nomeCategoria(catId)} · {jogo.perfil_aprendizagem || jogo.perfilAprendizagem}</span>
                  <div>
                    <button type="button" className="btn btn-pequeno btn-secundario" onClick={() => editarJogo(jogo)}>Editar</button>
                    <button type="button" className="btn btn-pequeno btn-perigo" onClick={() => handleExcluirJogo(jogo.id)}>Excluir</button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {aba === 'categorias' && (
        <section className="secao-admin">
          <h2>Consultar categorias</h2>
          <p className="texto-ajuda">A API permite listar categorias. Cadastro é feito pelo seed do backend.</p>
          <ul className="lista-admin">
            {categorias.map(function (cat) {
              return (
                <li key={cat.id}>
                  <span><strong>#{cat.id}</strong> — {cat.nome}</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}

export default Admin
