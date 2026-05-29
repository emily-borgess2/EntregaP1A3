// URL base da API - ajuste se necessário
const BASE_URL = 'http://localhost:3000/api/v1'

// Pega o token JWT salvo no navegador
function getToken() {
  return localStorage.getItem('cognify_token')
}

// Função genérica para fazer requisições
async function request(url, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  // Adiciona JWT se o usuário estiver logado
  if (token) {
    headers['Authorization'] = 'Bearer ' + token
  }

  const response = await fetch(BASE_URL + url, {
    ...options,
    headers
  })

  // Resposta vazia (204)
  if (response.status === 204) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Erro na requisição')
  }

  return data
}

// --- Autenticação ---
export async function login(email, senha) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  })
}

export async function register(nome, email, senha, dataNascimento) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha, dataNascimento })
  })
}

// --- Jogos ---
export async function getJogos(categoria) {
  const url = categoria ? '/jogos?categoria=' + categoria : '/jogos'
  return request(url)
}

export async function getJogo(id) {
  return request('/jogos/' + id)
}

export async function getJogosPublicos() {
  return request('/public/jogos')
}

// --- Categorias ---
export async function getCategorias() {
  return request('/categorias')
}

// --- Carrinho ---
export async function getCarrinho() {
  return request('/carrinho/ativo')
}

export async function addAoCarrinho(jogoId) {
  return request('/carrinho/add', {
    method: 'POST',
    body: JSON.stringify({ jogoId })
  })
}

export async function removerDoCarrinho(gameId) {
  return request('/carrinho/' + gameId, {
    method: 'DELETE'
  })
}

// --- Vendas ---
export async function getHistorico() {
  return request('/vendas')
}

export async function finalizarCompra() {
  return request('/vendas/checkout', {
    method: 'POST'
  })
}

export async function pagar(metodo, dados) {
  return request('/vendas/pay', {
    method: 'POST',
    body: JSON.stringify({ metodo, dados })
  })
}

// --- Avaliações ---
export async function getAvaliacoes(jogoId) {
  return request('/avaliacoes?jogoId=' + jogoId)
}

export async function getMediaAvaliacoes(jogoId) {
  return request('/avaliacoes/media/' + jogoId)
}

export async function criarAvaliacao(jogoId, nota, comentario) {
  return request('/avaliacoes', {
    method: 'POST',
    body: JSON.stringify({ jogoId, nota, comentario })
  })
}

// --- Relatórios ---
export async function getJogosMaisVendidos(top) {
  const qtd = top || 5
  return request('/relatorios/jogos-mais-vendidos?top=' + qtd)
}
