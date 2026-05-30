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
export async function getJogos(perfil, categoria) {
  let url = '/jogos'
  const params = []
  if (perfil) params.push('perfil=' + perfil)
  if (categoria) params.push('categoria=' + encodeURIComponent(categoria))
  if (params.length) url += '?' + params.join('&')
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

export async function finalizarCompra(planoId, perfilAprendizagem) {
  return request('/vendas/checkout', {
    method: 'POST',
    body: JSON.stringify({ planoId, perfilAprendizagem })
  })
}

// --- Planos ---
export async function getPlanos() {
  return request('/planos')
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
export async function getJogosMaisVendidos(top, empresaId) {
  let url = '/relatorios/jogos-mais-vendidos?top=' + (top || 5)
  if (empresaId) {
    url += '&empresa=' + empresaId
  }
  return request(url)
}

// --- Empresas (admin) ---
export async function getEmpresas() {
  return request('/empresas')
}

export async function criarEmpresa(nome) {
  return request('/empresas', {
    method: 'POST',
    body: JSON.stringify({ nome })
  })
}

export async function atualizarEmpresa(id, nome) {
  return request('/empresas/' + id, {
    method: 'PUT',
    body: JSON.stringify({ nome })
  })
}

export async function excluirEmpresa(id) {
  return request('/empresas/' + id, {
    method: 'DELETE'
  })
}

// --- Jogos CRUD (admin) ---
export async function criarJogo(dados) {
  return request('/jogos', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
}

export async function atualizarJogo(id, dados) {
  return request('/jogos/' + id, {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
}

export async function excluirJogo(id) {
  return request('/jogos/' + id, {
    method: 'DELETE'
  })
}

export async function getCategoria(id) {
  return request('/categorias/' + id)
}

