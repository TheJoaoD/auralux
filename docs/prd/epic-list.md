# Epic List

## Epic 1: Fundação do Catálogo e Autenticação Simplificada

**Goal:** Estabelecer infraestrutura de banco de dados para o catálogo, implementar sistema de autenticação via WhatsApp, e criar estrutura de rotas públicas no Next.js.

**Key Deliverables:**
- Novas tabelas: `catalog_users`, `catalog_items`, `catalog_favorites`, `catalog_cart`, `catalog_requests`
- Sistema de autenticação customizado (JWT + cookie)
- Rotas públicas `/catalogo` com layout base

---

## Epic 2: Visualização Pública do Catálogo e Navegação

**Goal:** Implementar interface pública do catálogo com listagem de produtos, filtros por categoria, busca textual, e página de detalhes do produto.

**Key Deliverables:**
- Home do catálogo com produtos em destaque e novidades
- Grid de produtos com paginação infinita
- Filtros e busca
- Página de detalhes com informações completas

---

## Epic 3: Favoritos, Carrinho e Solicitação de Produtos

**Goal:** Permitir que usuários autenticados salvem favoritos, montem carrinhos e solicitem produtos específicos, com persistência por WhatsApp.

**Key Deliverables:**
- Sistema de favoritos com adicionar/remover
- Carrinho com adicionar/remover/atualizar quantidades
- Finalização de carrinho (geração de mensagem WhatsApp)
- Formulário de solicitação de produtos

---

## Epic 4: Gestão de Catálogo no App Administrativo

**Goal:** Criar nova seção no app autenticado para gestores controlarem o catálogo: ativar/desativar produtos, adicionar detalhes extras, gerenciar produtos em destaque.

**Key Deliverables:**
- Tela de listagem de produtos com toggle "Exibir no catálogo"
- Formulário de detalhes extras (notas de fragrância, ocasião, data prevista)
- Gestão de produtos em destaque (drag-and-drop para ordenação)
- Preview do catálogo público para validação

---

## Epic 5: Gestão de Solicitações e Notificações em Tempo Real

**Goal:** Implementar sistema de notificações em tempo real para gestor visualizar e gerenciar solicitações de clientes e carrinhos finalizados.

**Key Deliverables:**
- Tela "Solicitações de Clientes" no app administrativo
- Notificações em tempo real (badge no menu, toast)
- Filtros por status (Pendente, Em análise, Atendida, Não disponível)
- Ações: marcar como atendida, adicionar observações internas

---

## Epic 6: Analytics, Otimizações e Lançamento

**Goal:** Implementar analytics do catálogo para gestor, otimizar performance (caching, lazy loading, SEO), e preparar para produção.

**Key Deliverables:**
- Dashboard de analytics: produtos mais vistos, taxa de conversão, solicitações por categoria
- Otimizações de performance (ISR, Edge caching, image optimization)
- SEO completo (meta tags, structured data, sitemap)
- Testes E2E da jornada completa
- Deploy em subdomínio ou path dedicado

---
