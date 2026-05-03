/*
  JavaScript do protótipo Cognify

  O que este arquivo faz:
  - Troca de telas (mostra/oculta .pagina)
  - Carrinho simples (salvo no localStorage)
  - Cadastro (salva dados no localStorage)
  - Pagamento simulado (resumo do carrinho + seleção de forma)

  Observação: é propositalmente simples (nível iniciante).
*/

// Chaves de armazenamento no navegador (localStorage)
var CHAVE_CARRINHO = "cognify_carrinho_demo";

// Lê carrinho do localStorage (sempre retorna um array)
function obterCarrinho() {
  try {
    var txt = localStorage.getItem(CHAVE_CARRINHO);
    if (!txt) return [];
    var arr = JSON.parse(txt);
    if (Array.isArray(arr)) return arr;
  } catch (e) {
    // ignora erro de JSON
  }
  return [];
}

// Salva carrinho e atualiza contadores na tela
function salvarCarrinho(lista) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(lista));
  atualizarContadorCarrinho();
}

// Adiciona 1 item (plano) no carrinho
function adicionarPlanoNoCarrinho(codigo) {
  var lista = obterCarrinho();
  lista.push(codigo);
  salvarCarrinho(lista);
}

// Atualiza todas as badges do carrinho (home, saiba mais, planos, pagamento)
function atualizarContadorCarrinho() {
  var n = obterCarrinho().length;
  var badges = document.querySelectorAll(".contador-carrinho");
  for (var b = 0; b < badges.length; b++) {
    badges[b].textContent = String(n);
  }
}

// Nome "bonito" para cada código de plano
function nomesPlanos() {
  return { basico: "Básico", intermediario: "Intermediário", premium: "Premium" };
}

// Mostra um resumo do carrinho via alert (bem simples)
function mostrarResumoCarrinho() {
  var lista = obterCarrinho();
  if (lista.length === 0) {
    alert("Carrinho vazio. Clique no ícone do carrinho no card do plano para adicionar.");
    return;
  }
  var nomes = nomesPlanos();
  var linhas = [];
  for (var i = 0; i < lista.length; i++) {
    var cod = lista[i];
    linhas.push("- " + (nomes[cod] || cod));
  }
  alert("Itens no carrinho (protótipo):\n\n" + linhas.join("\n"));
}

// Troca de telas:
// - remove "ativa" de todas
// - adiciona "ativa" na tela indicada
function mostrarPagina(id) {
  var paginas = document.querySelectorAll(".pagina");
  for (var i = 0; i < paginas.length; i++) {
    paginas[i].classList.remove("ativa");
  }
  var alvo = document.getElementById(id);
  if (alvo) {
    alvo.classList.add("ativa");
  }
  atualizarContadorCarrinho();
}

// ==========================
// Eventos da TELA INICIAL
// ==========================
document.getElementById("btnEntrar").onclick = function () {
  alert("No prototipo, use Criar conta para ver o fluxo completo.");
};

document.getElementById("btnCriar").onclick = function () {
  mostrarPagina("tela-cadastro");
};

document.getElementById("voltarInicio1").onclick = function () {
  mostrarPagina("tela-inicial");
};

document.getElementById("btnSaibaMais").onclick = function () {
  mostrarPagina("tela-saiba-mais");
};

document.getElementById("voltarInicioSaibaMais").onclick = function () {
  mostrarPagina("tela-inicial");
};

document.getElementById("btnAbrirCarrinho").onclick = function () {
  mostrarResumoCarrinho();
};

document.getElementById("btnAbrirCarrinhoSaibaMais").onclick = function () {
  mostrarResumoCarrinho();
};

// botoes de carrinho em cada card de plano
document.body.addEventListener("click", function (ev) {
  var alvo = ev.target.closest(".btn-so-carrinho");
  if (!alvo) return;
  var cod = alvo.getAttribute("data-plano");
  if (!cod) return;
  adicionarPlanoNoCarrinho(cod);
});

// ao carregar a pagina, mostra o numero certo no carrinho
atualizarContadorCarrinho();
