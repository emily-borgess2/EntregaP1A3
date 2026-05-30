# Cognify

Plataforma web de jogos educativos para crianças neurodivergentes (TDAH, TEA leve e dislexia).

Projeto acadêmico — frontend React + API Node.js integrados no mesmo repositório.

## Estrutura

```
api/          # API REST (Node.js + SQLite)
src/          # Frontend React
docs/         # Documentação
```

## Modelo de negócio

- **Jogos não têm preço avulso** — são inclusos no plano
- **Planos** (Básico, Intermediário, Premium) têm preço mensal por **perfil de aprendizagem** (TDAH, TEA, Dislexia)
- Os jogos são filtrados conforme o perfil cadastrado da criança

## Pré-requisitos

- Node.js 18+

## Como instalar

```bash
git clone https://github.com/emily-borgess2/EntregaP1A3.git
cd EntregaP1A3
npm run install:all
cp api/.env.exemple api/.env
```

## Como rodar

```bash
npm run dev
```

- API: http://localhost:3000
- Frontend: http://localhost:5173

## Contas de teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Cliente | cliente@avjd.com | cliente123 |
| Admin | admin@avjd.com | admin123 |

## Fluxo

1. Login → cadastro da criança (perfil TDAH/TEA/Dislexia)
2. Escolha do plano (preço varia por perfil)
3. Jogos filtrados pelo perfil da criança
4. Carrinho cobra o **plano**, não jogos individuais

## Endpoints principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/jogos?perfil=tdah` | Jogos por perfil |
| GET | `/api/v1/planos` | Planos e preços |
| POST | `/api/v1/vendas/checkout` | Checkout com plano |

## Equipe

Projeto acadêmico — Entrega P1 A3.
