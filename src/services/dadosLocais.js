// Dados locais do Cognify (criança, plano e sessões de jogo)

const CHAVE_CRIANCA = 'cognify_crianca'
const CHAVE_PLANO = 'cognify_plano'
const CHAVE_SESSOES = 'cognify_sessoes'

// Fallback — preços espelham a API
export const PLANOS = {
  basico: {
    id: 'basico', nome: 'Básico', limiteJogos: 4,
    precos: { tdah: 0, tea: 0, dislexia: 0 }
  },
  intermediario: {
    id: 'intermediario', nome: 'Intermediário', limiteJogos: 8,
    precos: { tdah: 29, tea: 29, dislexia: 27 }
  },
  premium: {
    id: 'premium', nome: 'Premium', limiteJogos: 12,
    precos: { tdah: 49, tea: 49, dislexia: 45 }
  }
}

export const NOMES_PERFIL = {
  tdah: 'TDAH',
  tea: 'TEA leve',
  dislexia: 'Dislexia'
}

export function getPrecoPlano(planoId, transtorno) {
  const plano = PLANOS[planoId]
  if (!plano || !transtorno) return 0
  return plano.precos[transtorno] ?? 0
}

export function formatarPrecoPlano(planoId, transtorno) {
  const preco = getPrecoPlano(planoId, transtorno)
  return preco === 0 ? 'Grátis' : 'R$ ' + preco + '/mês'
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
