# Cognify

Plataforma web de vendas de jogos educativos digitais para crianças neurodivergentes (TDAH, TEA leve e dislexia).

Projeto acadêmico de Usabilidade e Desenvolvimento Web — frontend React integrado com a [API de Vendas de Jogos Digitais](https://github.com/shandragon/api-vendas-jogos-digitais).

## Tecnologias

- React.js + Vite
- React Router
- fetch (API REST)
- Recharts (gráficos)
- CSS simples

## Pré-requisitos

- Node.js 18+ instalado
- API rodando localmente na porta 3000

## Como instalar

```bash
# 1. Clone este repositório
git clone https://github.com/emily-borgess2/EntregaP1A3.git
cd EntregaP1A3

# 2. Instale as dependências do frontend
npm install

# 3. Clone e configure a API (em outra pasta/terminal)
git clone https://github.com/shandragon/api-vendas-jogos-digitais.git
cd api-vendas-jogos-digitais
cp .env.exemple .env
npm install
npm start
```

## Como rodar

```bash
# Com a API já rodando em http://localhost:3000
npm run dev
```

Acesse: **http://localhost:5173**

## Como usar

1. Abra o navegador em `http://localhost:5173`
2. Faça login com a conta de teste:
   - **E-mail:** cliente@avjd.com
   - **Senha:** cliente123
3. Navegue pelas telas:
   - **Início** — visão geral e jogos em destaque
   - **Jogos** — listagem com filtros por nome e categoria
   - **Detalhes** — simulação de adaptação, avaliações e comentários
   - **Carrinho** — adicionar/remover jogos e finalizar compra
   - **Histórico** — compras realizadas
   - **Relatórios** — gráficos de barras, pizza e indicadores

## Endpoints da API utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/auth/login` | Login com JWT |
| POST | `/api/v1/auth/register` | Cadastro de usuário |
| GET | `/api/v1/jogos` | Listar jogos (autenticado) |
| GET | `/api/v1/jogos/:id` | Detalhes de um jogo |
| GET | `/api/v1/categorias` | Listar categorias |
| GET | `/api/v1/carrinho/ativo` | Ver carrinho ativo |
| POST | `/api/v1/carrinho/add` | Adicionar jogo ao carrinho |
| DELETE | `/api/v1/carrinho/:gameId` | Remover do carrinho |
| POST | `/api/v1/vendas/checkout` | Finalizar compra |
| POST | `/api/v1/vendas/pay` | Simular pagamento |
| GET | `/api/v1/vendas` | Histórico de compras |
| GET | `/api/v1/avaliacoes/media/:jogoId` | Média de avaliações |
| POST | `/api/v1/avaliacoes` | Criar avaliação |
| GET | `/api/v1/relatorios/jogos-mais-vendidos` | Jogos mais vendidos |

## Estrutura do projeto

```
src/
├── components/     # Navbar, Layout, GameCard, ProtectedRoute
├── pages/          # Login, Home, Jogos, Detalhe, Carrinho, Histórico, Relatórios
├── services/       # api.js (fetch + JWT)
├── styles/         # global.css
├── App.jsx
└── main.jsx
```

## Equipe

Projeto acadêmico — Entrega P1 A3.
