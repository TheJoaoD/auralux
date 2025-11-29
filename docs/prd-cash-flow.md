# Auralux - Sistema de Fluxo de Caixa e Gestão de Parcelas

## PRD Brownfield Enhancement

**Versão:** 1.0
**Data:** 2025-11-29
**Status:** Aprovado para Implementação

---

## 1. Análise do Projeto e Contexto

### 1.1 Visão Geral do Projeto Existente

**Auralux** é um sistema de gestão para loja de perfumes de luxo com:

| Módulo | Status |
|--------|--------|
| Vendas Admin | ✅ Implementado |
| Catálogo Público | ✅ Implementado |
| Gestão de Estoque | ✅ Implementado |
| Gestão de Clientes | ✅ Implementado |
| **Fluxo de Caixa** | ❌ Não existe |

### 1.2 Problema Identificado

O sistema atual **mascara o fluxo de caixa real** em vendas parceladas:

| Venda | Total | Parcelas | Recebido | Problema |
|-------|-------|----------|----------|----------|
| `b7d102b0...` | R$ 730 | 3x | R$ 243 | Só registra entrada inicial, não rastreia parcelas restantes |
| `90035617...` | R$ 490 | 2x | R$ 490 | Parece que recebeu tudo, mas são parcelas futuras |

**Situação atual:**
- Não existe tabela de parcelas individuais
- Sem controle de vencimentos nem baixa de parcelas
- Dashboard mostra "receita" como se fosse caixa real
- Campo `actual_amount_received` é ambíguo
- Vendas parceladas marcadas como "completed" mesmo sem receber todas as parcelas

### 1.3 Escopo da Melhoria

| Tipo | Aplicável |
|------|-----------|
| New Feature Addition | ✅ |
| Major Feature Modification | ✅ |
| Database Schema Changes | ✅ |
| **Impacto** | Significativo |

### 1.4 Objetivos

- Ter visibilidade real do caixa (apenas dinheiro que efetivamente entrou)
- Controlar vencimento e pagamento de parcelas
- Projetar recebimentos futuros por período
- Identificar inadimplência e parcelas vencidas
- Separar receita de vendas vs. caixa real

### 1.5 Contexto de Fundo

O sistema Auralux permite vendas parceladas (até 12x), mas atualmente:
1. Registra apenas o `total_amount` e `installment_count` na tabela `sales`
2. O campo `actual_amount_received` é ambíguo (às vezes entrada, às vezes total)
3. Não existe tabela de parcelas individuais
4. Dashboard mostra "receita" como se fosse caixa real
5. Não há controle de vencimentos nem baixa de parcelas

---

## 2. Requisitos

### 2.1 Requisitos Funcionais

| ID | Requisito |
|----|-----------|
| **FR1** | O sistema deve criar parcelas individuais automaticamente ao registrar uma venda parcelada, com datas de vencimento calculadas (mensal a partir da data da venda) |
| **FR2** | O sistema deve permitir registrar a baixa de parcelas individualmente, informando valor pago, data do pagamento e método de pagamento |
| **FR3** | O sistema deve registrar entradas no fluxo de caixa apenas quando o dinheiro efetivamente entrar (entrada à vista ou baixa de parcela) |
| **FR4** | O sistema deve exibir dashboard de recebíveis com: parcelas a vencer (por período), parcelas vencidas, e projeção de caixa |
| **FR5** | O sistema deve permitir visualizar histórico de parcelas por cliente e por venda |
| **FR6** | O sistema deve alertar sobre parcelas vencidas há mais de X dias (configurável) |
| **FR7** | O sistema deve suportar entrada/sinal no ato da venda parcelada (ex: R$ 200 de entrada + 3x de R$ 176,67) |
| **FR8** | O sistema deve permitir pagamento parcial de parcelas (cliente pagou R$ 100 de uma parcela de R$ 200) |
| **FR9** | O sistema deve calcular e exibir métricas reais: caixa do dia, caixa do mês, a receber no mês |
| **FR10** | O sistema deve migrar vendas parceladas existentes para o novo modelo de parcelas |

### 2.2 Requisitos Não Funcionais

| ID | Requisito |
|----|-----------|
| **NFR1** | A criação de parcelas deve ser atômica com a criação da venda (transação única) |
| **NFR2** | O sistema deve manter compatibilidade com vendas existentes (não quebrar histórico) |
| **NFR3** | Queries de fluxo de caixa devem retornar em < 500ms para períodos de até 1 ano |
| **NFR4** | O modelo deve suportar até 24 parcelas por venda |
| **NFR5** | Todas as operações financeiras devem ter audit trail (quem, quando, o quê) |

### 2.3 Requisitos de Compatibilidade

| ID | Requisito |
|----|-----------|
| **CR1** | **API Existente**: A função `createSale()` deve manter assinatura compatível, adicionando geração de parcelas internamente |
| **CR2** | **Schema do Banco**: Tabela `sales` deve manter campos existentes; novos campos são aditivos |
| **CR3** | **UI/UX**: Fluxo de nova venda deve permanecer similar, com adição de campo "entrada/sinal" para parcelados |
| **CR4** | **Integrações**: Triggers existentes de estoque e métricas de cliente devem continuar funcionando |

---

## 3. Restrições Técnicas e Requisitos de Integração

### 3.1 Stack Tecnológica Existente

| Componente | Tecnologia | Versão |
|------------|------------|--------|
| **Frontend** | Next.js (App Router) | 14.x |
| **UI** | Tailwind CSS + shadcn/ui | - |
| **Backend** | Supabase (PostgreSQL) | 15.8 |
| **Auth** | Supabase Auth | - |
| **Linguagem** | TypeScript | 5.x |

### 3.2 Schema do Banco de Dados

#### Nova Tabela: `sale_installments`

```sql
CREATE TABLE sale_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  installment_number INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  paid_amount DECIMAL(10,2) DEFAULT 0,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('pending', 'paid', 'partial', 'overdue', 'cancelled')),
  CONSTRAINT valid_amount CHECK (amount > 0),
  CONSTRAINT valid_paid CHECK (paid_amount >= 0 AND paid_amount <= amount)
);

CREATE INDEX idx_installments_sale ON sale_installments(sale_id);
CREATE INDEX idx_installments_user_due ON sale_installments(user_id, due_date);
CREATE INDEX idx_installments_status ON sale_installments(status) WHERE status != 'paid';
```

#### Nova Tabela: `cash_flow`

```sql
CREATE TABLE cash_flow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference_type TEXT,
  reference_id UUID,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_type CHECK (type IN ('income', 'expense')),
  CONSTRAINT valid_amount CHECK (amount > 0)
);

CREATE INDEX idx_cashflow_user_date ON cash_flow(user_id, transaction_date DESC);
CREATE INDEX idx_cashflow_type_date ON cash_flow(user_id, type, transaction_date);
CREATE INDEX idx_cashflow_reference ON cash_flow(reference_type, reference_id);
```

#### Alterações em `sales`

```sql
ALTER TABLE sales
  ADD COLUMN payment_status TEXT DEFAULT 'paid',
  ADD COLUMN down_payment DECIMAL(10,2) DEFAULT 0;

ALTER TABLE sales ADD CONSTRAINT valid_payment_status
  CHECK (payment_status IN ('paid', 'partial', 'pending'));
```

### 3.3 Estrutura de Arquivos

```
lib/services/
├── installmentService.ts      # Gestão de parcelas
└── cashFlowService.ts         # Fluxo de caixa

app/admin/
└── financeiro/
    ├── page.tsx               # Dashboard financeiro
    ├── parcelas/
    │   └── page.tsx           # Lista de parcelas
    └── fluxo-caixa/
        └── page.tsx           # Extrato de caixa

components/
└── financeiro/
    ├── InstallmentCard.tsx
    ├── InstallmentTable.tsx
    ├── CashFlowSummary.tsx
    └── ReceivablesChart.tsx
```

### 3.4 Avaliação de Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Vendas existentes sem parcelas | Alta | Médio | Script de migração para criar parcelas retroativas |
| Performance em queries de período longo | Média | Médio | Índices otimizados + paginação |
| Triggers conflitantes | Baixa | Alto | Testar triggers existentes antes de deploy |
| Inconsistência de dados | Média | Alto | Transações atômicas + validações |

---

## 4. Epic e Stories

### Epic 1: Sistema de Fluxo de Caixa e Gestão de Parcelas

**Epic Goal**: Implementar controle financeiro real que rastreie entradas de caixa no momento em que efetivamente ocorrem, com gestão completa de parcelas para vendas parceladas.

---

### Story 1.1: Schema de Parcelas e Fluxo de Caixa

> **Como** administrador do sistema,
> **Quero** que o banco de dados suporte parcelas individuais e registros de fluxo de caixa,
> **Para que** eu possa rastrear cada entrada financeira separadamente.

#### Acceptance Criteria

| # | Critério |
|---|----------|
| AC1 | Tabela `sale_installments` criada com todos os campos especificados |
| AC2 | Tabela `cash_flow` criada com todos os campos especificados |
| AC3 | Coluna `payment_status` adicionada à tabela `sales` |
| AC4 | Coluna `down_payment` adicionada à tabela `sales` |
| AC5 | RLS policies configuradas para ambas as novas tabelas |
| AC6 | Índices criados para queries de vencimento e período |
| AC7 | Tipos TypeScript gerados e atualizados |

#### Integration Verification

| # | Verificação |
|---|-------------|
| IV1 | Vendas existentes continuam funcionando sem erros |
| IV2 | Triggers de estoque não são afetados |
| IV3 | RLS das tabelas existentes permanece intacto |

---

### Story 1.2: Geração Automática de Parcelas na Venda

> **Como** vendedor,
> **Quero** que parcelas sejam criadas automaticamente ao registrar venda parcelada,
> **Para que** eu não precise cadastrar cada parcela manualmente.

#### Acceptance Criteria

| # | Critério |
|---|----------|
| AC1 | Ao criar venda com `payment_method: 'installment'`, parcelas são geradas automaticamente |
| AC2 | Número de parcelas corresponde ao `installment_count` da venda |
| AC3 | Datas de vencimento são calculadas mensalmente a partir da data da venda |
| AC4 | Valor de cada parcela é calculado corretamente: `(total - entrada) / parcelas` |
| AC5 | Campo de entrada/sinal disponível na UI de pagamento |
| AC6 | Se entrada > 0, registro imediato no `cash_flow` como income |
| AC7 | `payment_status` da venda é setado como 'partial' ou 'pending' conforme entrada |
| AC8 | Vendas à vista registram diretamente no `cash_flow` com status 'paid' |

#### Integration Verification

| # | Verificação |
|---|-------------|
| IV1 | Fluxo de venda à vista continua funcionando normalmente |
| IV2 | Triggers de cliente executam corretamente |
| IV3 | Rollback funciona: se falhar criar parcelas, venda não é criada |

---

### Story 1.3: Serviço de Gestão de Parcelas

> **Como** administrador,
> **Quero** funções para consultar, filtrar e dar baixa em parcelas,
> **Para que** eu possa gerenciar os recebíveis do negócio.

#### Acceptance Criteria

| # | Critério |
|---|----------|
| AC1 | Função `getInstallmentsBySale(saleId)` retorna parcelas de uma venda |
| AC2 | Função `getInstallmentsByCustomer(customerId)` retorna parcelas do cliente |
| AC3 | Função `getPendingInstallments(filters)` com filtros de período e status |
| AC4 | Função `getOverdueInstallments()` retorna parcelas vencidas |
| AC5 | Função `payInstallment(id, amount, method)` registra pagamento |
| AC6 | Ao pagar parcela, registro automático no `cash_flow` |
| AC7 | Ao pagar última parcela, `payment_status` da venda atualiza para 'paid' |
| AC8 | Suporte a pagamento parcial |

#### Integration Verification

| # | Verificação |
|---|-------------|
| IV1 | Queries respeitam RLS |
| IV2 | Performance < 500ms para consultas de até 1000 parcelas |
| IV3 | Não há side effects em outras tabelas além de `cash_flow` |

---

### Story 1.4: Serviço de Fluxo de Caixa

> **Como** administrador,
> **Quero** consultar o fluxo de caixa por período,
> **Para que** eu saiba exatamente quanto dinheiro entrou e saiu.

#### Acceptance Criteria

| # | Critério |
|---|----------|
| AC1 | Função `getCashFlowByPeriod(startDate, endDate)` retorna lançamentos |
| AC2 | Função `getCashFlowSummary(period)` retorna totais de entrada/saída |
| AC3 | Função `getDailyCashFlow(date)` retorna caixa do dia |
| AC4 | Função `getReceivablesForecast(months)` projeta recebimentos futuros |
| AC5 | Função `getCashFlowMetrics()` retorna: caixa hoje, a receber no mês, vencidas |
| AC6 | Dados agrupáveis por dia, semana, mês |
| AC7 | Filtro por categoria |

#### Integration Verification

| # | Verificação |
|---|-------------|
| IV1 | Métricas existentes do dashboard não são afetadas |
| IV2 | Queries funcionam com timezone correto |
| IV3 | RLS garante isolamento por usuário |

---

### Story 1.5: Interface de Gestão de Parcelas

> **Como** administrador,
> **Quero** uma tela para visualizar e dar baixa em parcelas,
> **Para que** eu possa controlar os recebíveis de forma prática.

#### Acceptance Criteria

| # | Critério |
|---|----------|
| AC1 | Página `/admin/financeiro/parcelas` lista parcelas pendentes |
| AC2 | Filtros por: status, período de vencimento, cliente |
| AC3 | Indicador visual de parcelas vencidas (vermelho) e a vencer em 7 dias (amarelo) |
| AC4 | Botão "Dar baixa" abre modal com: valor, método de pagamento, data |
| AC5 | Histórico de pagamentos visível em cada parcela |
| AC6 | Link para detalhes da venda e do cliente |
| AC7 | Totalizadores no topo: Total pendente, Vencidas, A vencer esta semana |
| AC8 | Responsivo para mobile |

#### Integration Verification

| # | Verificação |
|---|-------------|
| IV1 | Navegação integrada ao menu admin existente |
| IV2 | Padrão visual consistente com demais páginas |
| IV3 | Loading states e error handling implementados |

---

### Story 1.6: Dashboard de Fluxo de Caixa

> **Como** administrador,
> **Quero** visualizar o fluxo de caixa em um dashboard,
> **Para que** eu tenha visão geral da saúde financeira do negócio.

#### Acceptance Criteria

| # | Critério |
|---|----------|
| AC1 | Página `/admin/financeiro` com visão consolidada |
| AC2 | Card "Caixa Hoje" mostrando entradas do dia |
| AC3 | Card "Caixa do Mês" mostrando entradas do mês atual |
| AC4 | Card "A Receber" mostrando total de parcelas pendentes |
| AC5 | Card "Vencidas" mostrando total de parcelas em atraso |
| AC6 | Gráfico de linha com evolução do caixa (últimos 30 dias) |
| AC7 | Lista de próximos vencimentos (7 dias) |
| AC8 | Acesso rápido para dar baixa em parcelas |

#### Integration Verification

| # | Verificação |
|---|-------------|
| IV1 | Dashboard principal de vendas continua funcionando |
| IV2 | Dados são consistentes entre dashboard de vendas e financeiro |
| IV3 | Performance adequada (< 2s para carregar) |

---

### Story 1.7: Migração de Vendas Parceladas Existentes

> **Como** administrador,
> **Quero** que vendas parceladas já registradas sejam convertidas para o novo modelo,
> **Para que** eu tenha histórico completo no sistema de parcelas.

#### Acceptance Criteria

| # | Critério |
|---|----------|
| AC1 | Script identifica vendas com `payment_method: 'installment'` |
| AC2 | Para cada venda, cria parcelas retroativas baseadas em `installment_count` |
| AC3 | Parcelas passadas são marcadas como 'paid' (assumindo que foram pagas) |
| AC4 | Registros correspondentes criados no `cash_flow` |
| AC5 | Campo `payment_status` atualizado para 'paid' nas vendas migradas |
| AC6 | Log de migração para auditoria |
| AC7 | Script é idempotente |

#### Integration Verification

| # | Verificação |
|---|-------------|
| IV1 | Dados existentes não são perdidos ou corrompidos |
| IV2 | Vendas à vista não são afetadas |
| IV3 | Métricas históricas permanecem consistentes |

---

### Story 1.8: Integração com Detalhes do Cliente

> **Como** administrador,
> **Quero** ver parcelas pendentes na ficha do cliente,
> **Para que** eu saiba a situação financeira de cada cliente.

#### Acceptance Criteria

| # | Critério |
|---|----------|
| AC1 | Página de detalhes do cliente exibe aba/seção "Parcelas" |
| AC2 | Lista parcelas pendentes e histórico de pagas |
| AC3 | Totalizador: "Deve: R$ X" |
| AC4 | Indicador visual se cliente tem parcelas vencidas |
| AC5 | Ação rápida para dar baixa direto da ficha do cliente |
| AC6 | Campo `total_due` em customers atualizado automaticamente |

#### Integration Verification

| # | Verificação |
|---|-------------|
| IV1 | Página de cliente existente não quebra |
| IV2 | Performance mantida ao adicionar nova seção |
| IV3 | Dados consistentes com tela de parcelas |

---

## 5. Sequência de Implementação

```
1.1 Schema        → Base de dados (sem isso, nada funciona)
       ↓
1.2 Geração       → Novas vendas já criam parcelas
       ↓
1.3 Serviço       → Backend pronto para consultas
       ↓
1.4 Cash Flow     → Serviço de fluxo de caixa
       ↓
1.5 UI Parcelas   → Gestão visual de parcelas
       ↓
1.6 Dashboard     → Visão consolidada
       ↓
1.7 Migração      → Dados históricos
       ↓
1.8 Cliente       → Enhancement final
```

---

## 6. Change Log

| Mudança | Data | Versão | Descrição | Autor |
|---------|------|--------|-----------|-------|
| Criação inicial | 2025-11-29 | 1.0 | PRD completo para sistema de fluxo de caixa | PM Agent (John) |

---

*🤖 Generated with [Claude Code](https://claude.com/claude-code)*
