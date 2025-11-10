# Epic 5: Gestão de Solicitações e Notificações em Tempo Real

**Epic Goal:** Implementar sistema completo de notificações em tempo real usando Supabase Realtime para gestor visualizar e gerenciar solicitações de clientes e pedidos finalizados, com inbox centralizado e ações de resposta.

---

## Story 5.1: Configurar Supabase Realtime para Notificações

**As a** desenvolvedor,
**I want** configurar Supabase Realtime para broadcasts de solicitações e pedidos,
**so that** gestor receba notificações instantâneas quando clientes interagirem com o catálogo.

### Acceptance Criteria

1. Migração SQL cria função `notify_catalog_request()` que envia broadcast no canal `catalog_requests` ao inserir em `catalog_requests`
2. Migração SQL cria trigger `after_catalog_request_insert` que executa `notify_catalog_request()` após INSERT
3. Migração SQL cria função `notify_catalog_order()` que envia broadcast no canal `catalog_orders` ao inserir em `catalog_orders`
4. Migração SQL cria trigger `after_catalog_order_insert` que executa `notify_catalog_order()` após INSERT
5. Payload do broadcast inclui: `id`, `user_whatsapp`, `user_name`, `product_name` (requests) ou `total`, `items_count` (orders), `created_at`
6. Arquivo `/lib/services/catalog-realtime.ts` criado com hooks: `useCatalogRequestsSubscription()`, `useCatalogOrdersSubscription()`
7. Hook `useCatalogRequestsSubscription()` subscreve canal `catalog_requests` e retorna array de notificações
8. Hook `useCatalogOrdersSubscription()` subscreve canal `catalog_orders` e retorna array de notificações
9. Notificações armazenadas em estado local (React Context ou Zustand)
10. Teste de integração confirma que inserir em `catalog_requests` aciona broadcast
11. Teste de integração confirma que subscrição recebe payload correto em tempo real

---

## Story 5.2: Implementar Sistema de Notificações no Header Administrativo

**As a** gestor,
**I want** visualizar notificações em tempo real no header do app administrativo,
**so that** possa ser alertado imediatamente sobre solicitações e pedidos.

### Acceptance Criteria

1. Componente `/components/admin/NotificationBell.tsx` criado no header do app autenticado
2. Ícone de sino exibe badge com contador de notificações não lidas
3. Ao clicar no sino, abre dropdown com lista de notificações (últimas 10)
4. Cada notificação exibe: ícone (🛒 pedido, 📝 solicitação), mensagem resumida, tempo relativo (ex: "há 2 minutos")
5. Notificação de pedido: "Novo pedido de {nome} - R$ {total}"
6. Notificação de solicitação: "{nome} solicitou {produto}"
7. Ao clicar em notificação, navega para página de detalhes (pedido ou solicitação) e marca como lida
8. Botão "Ver todas" no footer do dropdown navega para `/catalogo-admin/notificacoes`
9. Notificações não lidas destacadas em negrito
10. Som de notificação (opcional) toca ao receber nova notificação (configurável em settings)
11. Context Provider `NotificationProvider` gerencia estado de notificações e subscrições Realtime
12. Notificações persistidas em localStorage para sobreviver refresh da página
13. Teste E2E confirma que finalizar pedido no catálogo público exibe notificação instantânea no admin
14. Teste E2E confirma que contador de badge atualiza em tempo real

---

## Story 5.3: Implementar Inbox de Solicitações de Clientes

**As a** gestor,
**I want** visualizar todas as solicitações de clientes em inbox centralizado,
**so that** possa gerenciar e responder solicitações de forma organizada.

### Acceptance Criteria

1. Página `/app/(authenticated)/catalogo-admin/solicitacoes/page.tsx` criada com lista de solicitações
2. Tabela exibe colunas: Status, Cliente (nome + WhatsApp), Produto Solicitado, Observações, Data, Ações
3. Filtros disponíveis: Status (Pendente, Em análise, Atendida, Não disponível), Período (Hoje, Última semana, Último mês)
4. Solicitações ordenadas por data (mais recentes primeiro)
5. Badges coloridos para status: Pendente (amarelo), Em análise (azul), Atendida (verde), Não disponível (vermelho)
6. Ações incluem: "Ver Detalhes", "Alterar Status", "Adicionar Observações"
7. Ao clicar em "Ver Detalhes", abre modal com informações completas + histórico de alterações de status
8. Modal permite alterar status via dropdown e adicionar observações internas (textarea)
9. Botão "Contatar Cliente" no modal abre WhatsApp com mensagem pré-formatada: "Olá {nome}, sobre sua solicitação de {produto}..."
10. Contador de solicitações pendentes exibido no tab "Solicitações"
11. Atualização em tempo real quando nova solicitação chegar (sem refresh manual)
12. Busca por nome de cliente ou produto solicitado
13. Paginação de 20 solicitações por página
14. Teste E2E confirma que alterar status atualiza imediatamente na tabela
15. Teste E2E confirma que nova solicitação aparece instantaneamente na lista (Realtime)

---

## Story 5.4: Implementar Gestão de Pedidos Recebidos

**As a** gestor,
**I want** visualizar pedidos finalizados pelos clientes com detalhes completos,
**so that** possa processar vendas e acompanhar conversões.

### Acceptance Criteria

1. Página `/app/(authenticated)/catalogo-admin/pedidos/page.tsx` criada com lista de pedidos
2. Tabela exibe colunas: ID, Cliente (nome + WhatsApp), Total, Qtd. Itens, Status, Data, Ações
3. Filtros disponíveis: Status (Enviado, Contatado, Convertido, Cancelado), Período
4. Pedidos ordenados por data (mais recentes primeiro)
5. Badges coloridos para status: Enviado (azul), Contatado (amarelo), Convertido (verde), Cancelado (cinza)
6. Ao clicar em pedido, abre modal com detalhes: lista de produtos (nome, quantidade, preço), total, dados do cliente, timestamp
7. Modal permite alterar status e adicionar observações internas
8. Botão "Contatar Cliente" abre WhatsApp com mensagem: "Olá {nome}, recebi seu pedido de R$ {total}..."
9. Botão "Converter em Venda" navega para `/sales/nova` pré-preenchendo produtos do pedido (integração com módulo de vendas existente)
10. Atualização em tempo real quando novo pedido chegar
11. Contador de pedidos enviados (não processados) exibido no tab "Pedidos"
12. Busca por nome de cliente ou ID do pedido
13. Paginação de 20 pedidos por página
14. Teste E2E confirma que finalizar pedido no catálogo aparece instantaneamente na lista (Realtime)
15. Teste E2E confirma que converter pedido em venda cria registro correto em `sales`

---

## Story 5.5: Implementar Página Centralizada de Notificações

**As a** gestor,
**I want** visualizar histórico completo de notificações em página dedicada,
**so that** possa revisar notificações antigas e não perder informações importantes.

### Acceptance Criteria

1. Página `/app/(authenticated)/catalogo-admin/notificacoes/page.tsx` criada com lista completa de notificações
2. Lista exibe todas as notificações (solicitações + pedidos) em ordem cronológica reversa
3. Cada notificação exibe: tipo (ícone), mensagem, timestamp, status (lida/não lida), botão de ação
4. Filtros disponíveis: Tipo (Solicitações, Pedidos), Status (Não lidas, Lidas), Período
5. Ao clicar em notificação, navega para página de detalhes (solicitação ou pedido) e marca como lida
6. Botão "Marcar todas como lidas" limpa contador de não lidas
7. Botão "Limpar notificações lidas" remove notificações antigas (mais de 30 dias e lidas)
8. Notificações persistidas em `localStorage` + banco (tabela `admin_notifications`)
9. Migração SQL cria tabela `admin_notifications` com campos: `id`, `type`, `reference_id`, `message`, `read`, `created_at`
10. Server Action `markNotificationAsRead(id)` atualiza status no banco
11. Paginação de 50 notificações por página
12. Teste E2E confirma que notificações antigas são mantidas no histórico
13. Teste E2E confirma que marcar como lida atualiza badge no header instantaneamente

---
