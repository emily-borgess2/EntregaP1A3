import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [modoCadastro, setModoCadastro] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      if (modoCadastro) {
        if (!nome || !email || !senha) {
          setErro('Preencha todos os campos obrigatórios.')
          setCarregando(false)
          return
        }
        await register(nome, email, senha, dataNascimento)
        setErro('')
        alert('Cadastro realizado! Faça login para continuar.')
        setModoCadastro(false)
      } else {
        const resposta = await login(email, senha)
        const token = resposta.token
        localStorage.setItem('cognify_token', token)

        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          if (payload.perfil === 'Administrador') {
            navigate('/admin')
            setCarregando(false)
            return
          }
        } catch (e) {
          // segue fluxo normal
        }

        const crianca = localStorage.getItem('cognify_crianca')
        const plano = localStorage.getItem('cognify_plano')
        if (!crianca) navigate('/cadastro-crianca')
        else if (!plano) navigate('/planos')
        else navigate('/dashboard')
      }
    } catch (err) {
      setErro(err.message)
    }

    setCarregando(false)
  }

  return (
    <div className="pagina-login">
      <div className="login-card">
        <h1>Cognify</h1>
        <p className="subtitulo">
          Plataforma de jogos educativos para crianças neurodivergentes
        </p>

        <form onSubmit={handleSubmit}>
          {modoCadastro && (
            <>
              <div className="campo">
                <label htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="campo">
                <label htmlFor="dataNasc">Data de nascimento</label>
                <input
                  id="dataNasc"
                  type="text"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  placeholder="DD/MM/AAAA"
                />
              </div>
            </>
          )}

          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>

          {erro && <p className="msg-erro" role="alert">{erro}</p>}

          <button type="submit" className="btn btn-primario btn-largo" disabled={carregando}>
            {carregando ? 'Aguarde...' : (modoCadastro ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>

        <p className="login-alternar">
          {modoCadastro ? (
            <>Já tem conta? <button type="button" className="link-btn" onClick={() => setModoCadastro(false)}>Fazer login</button></>
          ) : (
            <>Não tem conta? <button type="button" className="link-btn" onClick={() => setModoCadastro(true)}>Cadastrar</button></>
          )}
        </p>

        <div className="login-dica">
          <p><strong>Conta cliente:</strong> cliente@avjd.com / cliente123</p>
          <p><strong>Conta admin:</strong> admin@avjd.com / admin123</p>
        </div>
      </div>
    </div>
  )
}

export default Login
