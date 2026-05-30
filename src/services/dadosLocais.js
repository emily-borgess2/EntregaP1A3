// Dados locais do Cognify (criança, plano e sessões de jogo)
// Usamos localStorage porque a API não tem esses endpoints

const CHAVE_CRIANCA = 'cognify_crianca'
const CHAVE_PLANO = 'cognify_plano'
const CHAVE_SESSOES = 'cognify_sessoes'

export const PLANOS = {
  basico: { id: 'basico', nome: 'Básico', preco: 0, limiteJogos: 4 },
  intermediario: { id: 'intermediario', nome: 'Intermediário', preco: 29, limiteJogos: 8 },
  premium: { id: 'premium', nome: 'Premium', preco: 49, limiteJogos: 12 }
}

export function getCrianca() {
  try {
    const txt = localStorage.getItem(CHAVE_CRIANCA)
    return txt ? JSON.parse(txt) : null
  } catch (e) {
    return null
  }
}

export function salvarCrianca(dados) {
  localStorage.setItem(CHAVE_CRIANCA, JSON.stringify(dados))
}

export function getPlano() {
  return localStorage.getItem(CHAVE_PLANO)
}

export function salvarPlano(plano) {
  localStorage.setItem(CHAVE_PLANO, plano)
}

export function getSessoes() {
  try {
    const txt = localStorage.getItem(CHAVE_SESSOES)
    return txt ? JSON.parse(txt) : []
  } catch (e) {
    return []
  }
}

export function salvarSessao(sessao) {
  const lista = getSessoes()
  lista.push(sessao)
  localStorage.setItem(CHAVE_SESSOES, JSON.stringify(lista))
}

// Regras simples de adaptação (sem IA)
export function calcularAdaptacao(acertos, erros, tempo) {
  const total = acertos + erros
  if (total === 0) {
    return { dificuldade: 'Média', tempo: 'Normal', estimulos: 'Padrão' }
  }

  const taxaAcerto = acertos / total

  if (taxaAcerto >= 0.8 && tempo < 5) {
    return { dificuldade: 'Alta', tempo: 'Reduzido', estimulos: 'Mínimos' }
  }
  if (taxaAcerto >= 0.6) {
    return { dificuldade: 'Média', tempo: 'Normal', estimulos: 'Padrão' }
  }
  return { dificuldade: 'Baixa', tempo: 'Ampliado', estimulos: 'Reforçados' }
}
