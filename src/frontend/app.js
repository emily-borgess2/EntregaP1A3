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
var CHAVE_APOS_CADASTRO = "cognify_apos_cadastro";

// Abre a tela de cadastro e define o que acontece depois do cadastro:
function entrarCadastro(destinoAposCadastro) {
  if (destinoAposCadastro === "pagamento") {
    localStorage.setItem(CHAVE_APOS_CADASTRO, "pagamento");
    document.getElementById("btnSubmitCadastro").textContent =
      "Continuar para o pagamento";
  } else {
    localStorage.setItem(CHAVE_APOS_CADASTRO, "planos");
    document.getElementById("btnSubmitCadastro").textContent =
      "Continuar para os planos";
  }
  mostrarPagina("tela-cadastro");
}

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
  entrarCadastro("planos");
};

document.getElementById("voltarInicio1").onclick = function () {
  localStorage.removeItem(CHAVE_APOS_CADASTRO);
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

document.getElementById("btnFinalizarCompra").onclick = function () {
  entrarCadastro("pagamento");
};

// botoes de carrinho em cada card de plano
document.body.addEventListener("click", function (ev) {
  var alvo = ev.target.closest(".btn-so-carrinho");
  if (!alvo) return;
  var cod = alvo.getAttribute("data-plano");
  if (!cod) return;
  adicionarPlanoNoCarrinho(cod);
});

// ==========================
// Eventos do CADASTRO
// ==========================
document.getElementById("formCadastro").onsubmit = function (e) {
  e.preventDefault();

  var nomeResp = document.getElementById("nomeResp").value.trim();
  var email = document.getElementById("email").value.trim();
  var senha = document.getElementById("senha").value;
  var nomeCrianca = document.getElementById("nomeCrianca").value.trim();
  var idade = document.getElementById("idade").value;
  var transtorno = document.getElementById("transtorno").value;

  var msg = document.getElementById("msgErroCadastro");
  msg.hidden = true;
  msg.textContent = "";

  if (!nomeResp || !email || !senha || !nomeCrianca || !idade || !transtorno) {
    msg.textContent = "Preencha todos os campos.";
    msg.hidden = false;
    return;
  }

  if (senha.length < 4) {
    msg.textContent = "A senha deve ter pelo menos 4 caracteres (regra simples do prototipo).";
    msg.hidden = false;
    return;
  }

  var dados = {
    nomeResp: nomeResp,
    email: email,
    nomeCrianca: nomeCrianca,
    idade: idade,
    transtorno: transtorno
  };
  localStorage.setItem("cognify_cadastro_demo", JSON.stringify(dados));

  var depois = localStorage.getItem(CHAVE_APOS_CADASTRO);
  localStorage.removeItem(CHAVE_APOS_CADASTRO);

  if (depois === "pagamento") {
    mostrarPagina("tela-pagamento");
  } else {
    mostrarPagina("tela-planos");
  }
};

// ao carregar a pagina, mostra o numero certo no carrinho
atualizarContadorCarrinho();
