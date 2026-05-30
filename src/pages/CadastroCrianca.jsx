import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { salvarCrianca } from '../services/dadosLocais'

function CadastroCrianca() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [transtorno, setTranstorno] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!nome || !idade || !transtorno) {
      setErro('Preencha todos os campos.')
      return
    }

    if (Number(idade) < 3 || Number(idade) > 18) {
      setErro('Informe uma idade entre 3 e 18 anos.')
      return
    }

    salvarCrianca({ nome, idade: Number(idade), transtorno })
    navigate('/planos')
  }

  return (
    <div className="pagina">
      <div className="form-card">
        <h1>Cadastro da criança</h1>
        <p className="texto-ajuda">
          Informe os dados da criança para personalizar a experiência nos jogos.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="nomeCrianca">Nome da criança</label>
            <input
              id="nomeCrianca"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ana"
            />
          </div>

          <div className="campo">
            <label htmlFor="idade">Idade</label>
            <input
              id="idade"
              type="number"
              min="3"
              max="18"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              placeholder="Ex: 8"
            />
          </div>

          <div className="campo">
            <label htmlFor="transtorno">Perfil de aprendizagem</label>
            <select
              id="transtorno"
              value={transtorno}
              onChange={(e) => setTranstorno(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="tdah">TDAH</option>
              <option value="tea">TEA leve</option>
              <option value="dislexia">Dislexia</option>
            </select>
          </div>

          {erro && <p className="msg-erro" role="alert">{erro}</p>}

          <button type="submit" className="btn btn-primario btn-largo">
            Continuar
          </button>
        </form>
      </div>
    </div>
  )
}

export default CadastroCrianca
