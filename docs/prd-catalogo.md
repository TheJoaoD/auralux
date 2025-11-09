# Auralux Catálogo Público - Product Requirements Document (PRD)

## Goals and Background Context

### Goals

**Desired outcomes this PRD will deliver:**

1. **Democratizar acesso aos produtos** - Permitir que qualquer pessoa visualize o catálogo de produtos Auralux via acesso público mobile-first
2. **Simplificar experiência do cliente** - Autenticação rápida apenas com WhatsApp (sem senha, sem fricção)
3. **Aumentar conversões** - Sistema de favoritos e carrinho gerenciado por WhatsApp para facilitar solicitações de compra
4. **Empoderar o gestor** - Nova interface dentro do app atual para controlar catálogo, detalhes de produtos e gerenciar solicitações de clientes
5. **Automatizar processo de vendas** - Gatilhos automáticos que notificam gestor quando clientes solicitam produtos
6. **Aproveitar infraestrutura existente** - Reutilizar produtos do estoque atual sem duplicação de dados

### Background Context

O **Auralux** é um sistema PWA mobile-first de gestão de loja de luxo focado em perfumes, atualmente em produção com funcionalidades completas de inventário, vendas e gestão de clientes. O sistema é utilizado exclusivamente por gestores autenticados para operações internas.

Esta nova fase do projeto visa **expandir o alcance comercial** criando um **catálogo público** que permite clientes finais explorarem produtos disponíveis, salvarem favoritos, montarem carrinhos e solicitarem produtos diretamente ao gestor via WhatsApp. A estratégia elimina barreiras de entrada (autenticação complexa) enquanto mantém controle total do gestor sobre quais produtos aparecem no catálogo e quais detalhes adicionais são apresentados (notas de fragrância, ocasião de uso, previsão de retorno ao estoque).

O modelo de negócio mantém a operação via WhatsApp como canal de conversão, mas moderniza a experiência de descoberta de produtos, transformando o processo manual atual em uma experiência digital de alto padrão inspirado nos melhores catálogos de e-commerce do mundo.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-09 | v1.0 | PRD inicial do Catálogo Público Auralux | John (PM) |

---

## Requirements

### Functional Requirements

**FR1:** O sistema deve permitir acesso público ao catálogo sem autenticação prévia para navegação inicial

**FR2:** O sistema deve solicitar WhatsApp do usuário ao tentar adicionar favoritos ou itens ao carrinho

**FR3:** O sistema deve validar se o WhatsApp já existe no banco de dados de clientes do catálogo (`catalog_users`)

**FR4:** Se WhatsApp existir, o sistema deve autenticar automaticamente e restaurar favoritos/carrinho do usuário

**FR5:** Se WhatsApp não existir, o sistema deve solicitar nome completo e criar novo registro em `catalog_users`

**FR6:** O sistema deve exibir produtos organizados por categorias (reutilizando `categories` existente)

**FR7:** O sistema deve exibir preço de venda de cada produto no catálogo

**FR8:** O sistema deve permitir que usuários marquem produtos como favoritos

**FR9:** O sistema deve permitir que usuários adicionem produtos ao carrinho

**FR10:** O sistema deve exibir contador de itens no carrinho na navegação

**FR11:** O sistema deve permitir que usuários solicitem produtos específicos via formulário livre (nome do produto desejado + observações)

**FR12:** Solicitações de produtos devem gerar notificação para o gestor no app autenticado (Dashboard ou nova seção)

**FR13:** O gestor deve poder visualizar todas as solicitações de produtos pendentes com dados do cliente (WhatsApp, nome)

**FR14:** O gestor deve poder marcar solicitações como "Atendida", "Em análise" ou "Não disponível"

**FR15:** O gestor deve poder ativar/desativar produtos no catálogo público (toggle "Exibir no catálogo")

**FR16:** O gestor deve poder adicionar detalhes extras aos produtos para o catálogo: notas de fragrância (topo/corpo/fundo), ocasião de uso, intensidade, durabilidade

**FR17:** O gestor deve poder definir "Data prevista de retorno" para produtos sem estoque

**FR18:** O catálogo deve exibir badge "Em breve" para produtos sem estoque com data prevista

**FR19:** O catálogo deve exibir badge "Indisponível" para produtos sem estoque sem previsão

**FR20:** O sistema deve permitir filtrar produtos por categoria no catálogo

**FR21:** O sistema deve permitir busca textual de produtos por nome no catálogo

**FR22:** O carrinho deve persistir por sessão de WhatsApp (mesmo se usuário fechar e reabrir)

**FR23:** O sistema deve gerar link compartilhável do carrinho via WhatsApp (formato: mensagem pré-formatada com lista de produtos)

**FR24:** Ao finalizar carrinho, sistema deve gerar mensagem WhatsApp com lista de produtos, quantidades e preços para enviar ao gestor

**FR25:** O gestor deve receber notificação em tempo real quando carrinho é finalizado (WebSocket)

**FR26:** O catálogo deve exibir imagem principal do produto (reutilizar `image_url` de `products`)

**FR27:** Página de detalhes do produto deve exibir: imagem, nome, preço, categoria, descrição, detalhes extras (notas de fragrância, ocasião, etc), status de estoque

**FR28:** O sistema deve rastrear visualizações de produtos para analytics do gestor

**FR29:** O gestor deve poder marcar produtos como "Destaque" para aparecerem em banner rotativo na home do catálogo

**FR30:** O catálogo deve ter página inicial com: produtos em destaque, novidades (últimos 10 produtos adicionados ao catálogo), categorias em destaque

### Non-Functional Requirements

**NFR1:** O catálogo deve ser otimizado para mobile-first com breakpoint principal em 768px

**NFR2:** Todas as interações devem ter feedback visual imediato (loading states, toasts)

**NFR3:** O tempo de carregamento inicial do catálogo deve ser inferior a 2 segundos em conexão 3G

**NFR4:** Imagens de produtos devem usar lazy loading e otimização WebP

**NFR5:** O catálogo deve funcionar offline para produtos já carregados (PWA service worker)

**NFR6:** A validação de WhatsApp deve ser apenas formato válido (regex), sem verificação via SMS/API externa

**NFR7:** O sistema deve usar React Query para cache de produtos e evitar chamadas desnecessárias ao banco

**NFR8:** Todos os dados do catálogo devem usar Row-Level Security (RLS) do Supabase

**NFR9:** `catalog_users` não pode ter acesso aos dados administrativos (tabelas `users`, `sales`, `customers`)

**NFR10:** O catálogo deve ter URL pública separada do app administrativo (ex: `catalogo.auralux.com` ou `/catalogo`)

**NFR11:** O sistema deve suportar até 500 usuários simultâneos visualizando o catálogo

**NFR12:** Notificações em tempo real devem usar Supabase Realtime (WebSocket)

**NFR13:** O catálogo deve seguir padrões de acessibilidade WCAG 2.1 AA mínimo

**NFR14:** Todas as ações críticas (adicionar ao carrinho, favoritar) devem ter debounce de 300ms

**NFR15:** O sistema deve logar todas as solicitações de produtos e finalizações de carrinho para auditoria

---

## User Interface Design Goals

### Overall UX Vision

O catálogo público deve proporcionar uma experiência de **descoberta aspiracional** inspirada em marcas de luxo como Sephora, Fragrantica e The Perfume Shop. A interface deve comunicar sofisticação, simplicidade e confiança, utilizando espaçamento generoso, tipografia elegante e fotografia de produto em alta qualidade.

A jornada do usuário deve ser **sem fricção**: navegar livremente, autenticar-se apenas quando necessário (favoritos/carrinho), e converter via WhatsApp de forma natural. Cada tela deve ter um objetivo claro e guiar o usuário suavemente para a próxima ação.

O gestor, por sua vez, deve ter uma experiência de **controle total** dentro do app administrativo: gerenciar catálogo, enriquecer produtos com detalhes, monitorar solicitações e conversões em tempo real.

### Key Interaction Paradigms

- **Scroll infinito com lazy loading** para listagem de produtos
- **Cards de produto** com imagem grande, nome, preço e ícones de ação rápida (favorito/carrinho)
- **Bottom sheet modal** para detalhes de produto (slide up)
- **Floating Action Button (FAB)** para carrinho fixo no canto inferior direito
- **Swipe gestures** para remover itens do carrinho/favoritos
- **Pull-to-refresh** para atualizar catálogo
- **Skeleton screens** durante carregamentos
- **Toast notifications** para feedback de ações
- **Sticky header** com busca e filtros no catálogo

### Core Screens and Views

**Catálogo Público (Nova aplicação):**
1. **Home do Catálogo** - Destaques, novidades, categorias
2. **Listagem de Produtos** - Grid de produtos com filtros e busca
3. **Detalhes do Produto** - Informações completas, adicionar favorito/carrinho
4. **Favoritos** - Lista de produtos salvos pelo usuário
5. **Carrinho** - Itens selecionados com opção de finalizar
6. **Autenticação (WhatsApp)** - Modal simples solicitando WhatsApp (+ nome se novo)
7. **Solicitar Produto** - Formulário para pedidos especiais
8. **Confirmação de Pedido** - Mensagem pré-formatada para enviar via WhatsApp

**App Administrativo (Extensão do Auralux atual):**
9. **Gestão de Catálogo** - Lista de produtos com toggle "Exibir no catálogo" e edição de detalhes extras
10. **Detalhes do Produto para Catálogo** - Formulário para notas de fragrância, ocasião, data prevista de retorno
11. **Solicitações de Clientes** - Inbox com solicitações de produtos e carrinhos finalizados
12. **Analytics do Catálogo** - Visualizações, produtos mais acessados, taxa de conversão

### Accessibility

**WCAG 2.1 AA** - Contraste de cores, navegação por teclado, labels ARIA, textos alternativos em imagens

### Branding

Manter identidade visual do Auralux atual (paleta de cores, tipografia, logo). O catálogo deve ser uma extensão natural da marca, com ajustes para comunicar luxo e aspiração:
- **Paleta:** Tons neutros (branco, cinza claro) com acentos dourados ou pretos para CTAs
- **Tipografia:** Fontes serifadas para títulos (elegância), sans-serif para corpo (legibilidade)
- **Imagens:** Alta resolução, fundo clean, iluminação profissional
- **Iconografia:** Minimalista e moderna (Lucide Icons ou similar)

### Target Device and Platforms

**Mobile-first responsive web** (PWA instalável)
- Otimizado para iOS Safari e Android Chrome
- Breakpoints: 320px (mobile), 768px (tablet), 1024px+ (desktop)
- Touch targets mínimo 44x44px
- Suporte a gestos nativos (swipe, pinch-to-zoom em imagens)

---

## Technical Assumptions

### Repository Structure

**Monorepo** - O catálogo público será parte do mesmo repositório Next.js do Auralux, organizado em:
- `/app/catalogo/*` - Rotas públicas do catálogo
- `/app/(authenticated)/catalogo-admin/*` - Gestão do catálogo (autenticado)
- `/lib/services/catalog-*` - Serviços específicos do catálogo
- `/components/catalog/*` - Componentes do catálogo
- `/types/catalog.ts` - Tipos TypeScript do catálogo

### Service Architecture

**Monolito Next.js com separação lógica:**
- **Catálogo Público:** App Routes públicas (`/catalogo`)
- **Gestão:** App Routes autenticadas (middleware protege `/catalogo-admin`)
- **Backend:** Server Actions + Supabase (PostgreSQL + Realtime)
- **Cache:** React Query para dados do catálogo
- **State:** Zustand para carrinho e favoritos

### Testing Requirements

**Estratégia de testes:**
- **Unit tests:** Serviços de catálogo (Vitest)
- **Integration tests:** Fluxos de autenticação e carrinho (Playwright)
- **E2E tests:** Jornada completa usuário (navegação → adicionar carrinho → finalizar)
- **Manual testing:** Validação de notificações em tempo real e mensagens WhatsApp

### Additional Technical Assumptions and Requests

**Database:**
- Novas tabelas compartilham mesmo Supabase project do Auralux
- RLS policies isolam `catalog_users` de dados administrativos
- Índices em `catalog_items.visible`, `catalog_favorites.user_whatsapp`, `catalog_cart.user_whatsapp`
- Triggers para atualizar `updated_at` automaticamente

**Authentication:**
- Catálogo usa validação simples de WhatsApp (sem Supabase Auth)
- Sessão gerenciada por cookie HTTP-only com JWT customizado (payload: WhatsApp)
- TTL de sessão: 30 dias
- Middleware custom para rotas `/catalogo/favoritos`, `/catalogo/carrinho`

**Real-time:**
- Gestor subscreve canal `catalog_requests` para notificações de solicitações
- Gestor subscreve canal `catalog_orders` para carrinhos finalizados
- Supabase Realtime (WebSocket) já configurado no projeto

**WhatsApp Integration:**
- Formato de mensagem: `https://wa.me/5511999999999?text=Olá, gostaria de finalizar meu pedido...`
- Mensagem pré-formatada com lista de produtos do carrinho
- Não usa API do WhatsApp Business (apenas links deep link)

**Image Optimization:**
- Next.js Image component para lazy loading e WebP
- Supabase Storage para imagens (mesmo bucket de `products`)
- Transformações de imagem on-the-fly (thumbnails, blur placeholder)

**Performance:**
- Static Generation (SSG) para home do catálogo e categorias
- Incremental Static Regeneration (ISR) com revalidação a cada 60 segundos
- Edge caching via Vercel CDN
- Prefetch de produtos na viewport (Intersection Observer)

**SEO:**
- Meta tags dinâmicas para produtos (Open Graph, Twitter Cards)
- Schema.org structured data (Product, Offer)
- Sitemap dinâmico para produtos do catálogo
- Robots.txt permite indexação do `/catalogo`

**Security:**
- Rate limiting para autenticação (5 tentativas/minuto por IP)
- Sanitização de inputs (WhatsApp, nome, solicitações)
- CORS restrito ao domínio do catálogo
- CSP (Content Security Policy) para prevenir XSS

---

## Epic List

### Epic 1: Fundação do Catálogo e Autenticação Simplificada

**Goal:** Estabelecer infraestrutura de banco de dados para o catálogo, implementar sistema de autenticação via WhatsApp, e criar estrutura de rotas públicas no Next.js.

**Key Deliverables:**
- Novas tabelas: `catalog_users`, `catalog_items`, `catalog_favorites`, `catalog_cart`, `catalog_requests`
- Sistema de autenticação customizado (JWT + cookie)
- Rotas públicas `/catalogo` com layout base

---

### Epic 2: Visualização Pública do Catálogo e Navegação

**Goal:** Implementar interface pública do catálogo com listagem de produtos, filtros por categoria, busca textual, e página de detalhes do produto.

**Key Deliverables:**
- Home do catálogo com produtos em destaque e novidades
- Grid de produtos com paginação infinita
- Filtros e busca
- Página de detalhes com informações completas

---

### Epic 3: Favoritos, Carrinho e Solicitação de Produtos

**Goal:** Permitir que usuários autenticados salvem favoritos, montem carrinhos e solicitem produtos específicos, com persistência por WhatsApp.

**Key Deliverables:**
- Sistema de favoritos com adicionar/remover
- Carrinho com adicionar/remover/atualizar quantidades
- Finalização de carrinho (geração de mensagem WhatsApp)
- Formulário de solicitação de produtos

---

### Epic 4: Gestão de Catálogo no App Administrativo

**Goal:** Criar nova seção no app autenticado para gestores controlarem o catálogo: ativar/desativar produtos, adicionar detalhes extras, gerenciar produtos em destaque.

**Key Deliverables:**
- Tela de listagem de produtos com toggle "Exibir no catálogo"
- Formulário de detalhes extras (notas de fragrância, ocasião, data prevista)
- Gestão de produtos em destaque (drag-and-drop para ordenação)
- Preview do catálogo público para validação

---

### Epic 5: Gestão de Solicitações e Notificações em Tempo Real

**Goal:** Implementar sistema de notificações em tempo real para gestor visualizar e gerenciar solicitações de clientes e carrinhos finalizados.

**Key Deliverables:**
- Tela "Solicitações de Clientes" no app administrativo
- Notificações em tempo real (badge no menu, toast)
- Filtros por status (Pendente, Em análise, Atendida, Não disponível)
- Ações: marcar como atendida, adicionar observações internas

---

### Epic 6: Analytics, Otimizações e Lançamento

**Goal:** Implementar analytics do catálogo para gestor, otimizar performance (caching, lazy loading, SEO), e preparar para produção.

**Key Deliverables:**
- Dashboard de analytics: produtos mais vistos, taxa de conversão, solicitações por categoria
- Otimizações de performance (ISR, Edge caching, image optimization)
- SEO completo (meta tags, structured data, sitemap)
- Testes E2E da jornada completa
- Deploy em subdomínio ou path dedicado

---

## Epic 1: Fundação do Catálogo e Autenticação Simplificada

**Epic Goal:** Estabelecer infraestrutura de banco de dados para o catálogo público, implementar sistema de autenticação customizado via WhatsApp (sem senha), criar estrutura de rotas Next.js, e configurar RLS policies para isolamento de dados.

---

### Story 1.1: Criar Schema de Banco de Dados do Catálogo

**As a** desenvolvedor,
**I want** criar as tabelas necessárias para o catálogo público no Supabase,
**so that** possamos armazenar usuários do catálogo, produtos habilitados, favoritos, carrinhos e solicitações de forma estruturada e segura.

#### Acceptance Criteria

1. Migração SQL cria tabela `catalog_users` com campos: `id` (UUID PK), `whatsapp` (VARCHAR unique), `name` (VARCHAR), `created_at`, `updated_at`
2. Migração SQL cria tabela `catalog_items` com campos: `id` (UUID PK), `product_id` (FK para `products`), `visible` (BOOLEAN default true), `featured` (BOOLEAN default false), `featured_order` (INTEGER), `fragrance_notes_top` (TEXT), `fragrance_notes_heart` (TEXT), `fragrance_notes_base` (TEXT), `occasion` (TEXT), `intensity` (VARCHAR), `longevity` (VARCHAR), `stock_return_date` (DATE nullable), `created_at`, `updated_at`
3. Migração SQL cria tabela `catalog_favorites` com campos: `id` (UUID PK), `user_whatsapp` (VARCHAR FK para `catalog_users.whatsapp`), `product_id` (FK para `products`), `created_at` - com unique constraint (user_whatsapp, product_id)
4. Migração SQL cria tabela `catalog_cart` com campos: `id` (UUID PK), `user_whatsapp` (VARCHAR FK para `catalog_users.whatsapp`), `product_id` (FK para `products`), `quantity` (INTEGER default 1), `created_at`, `updated_at` - com unique constraint (user_whatsapp, product_id)
5. Migração SQL cria tabela `catalog_requests` com campos: `id` (UUID PK), `user_whatsapp` (VARCHAR FK para `catalog_users.whatsapp`), `product_name` (TEXT), `observations` (TEXT), `status` (ENUM: 'pending', 'analyzing', 'fulfilled', 'unavailable'), `admin_notes` (TEXT), `created_at`, `updated_at`
6. Migração SQL cria tabela `catalog_orders` com campos: `id` (UUID PK), `user_whatsapp` (VARCHAR FK para `catalog_users.whatsapp`), `items` (JSONB - array de {product_id, name, price, quantity}), `total` (DECIMAL), `status` (ENUM: 'sent', 'contacted', 'converted', 'cancelled'), `created_at`
7. Migração cria índices: `catalog_items.visible`, `catalog_items.featured`, `catalog_favorites.user_whatsapp`, `catalog_cart.user_whatsapp`, `catalog_requests.status`, `catalog_requests.user_whatsapp`
8. Migração cria trigger `update_catalog_items_updated_at` para atualizar `updated_at` automaticamente
9. Migração cria trigger `update_catalog_requests_updated_at` para atualizar `updated_at` automaticamente
10. Arquivo de migração é executado com sucesso no Supabase local e produção

---

### Story 1.2: Configurar Row-Level Security (RLS) para Catálogo

**As a** desenvolvedor,
**I want** configurar políticas RLS no Supabase para isolar dados do catálogo,
**so that** usuários do catálogo público não tenham acesso a dados administrativos e vice-versa.

#### Acceptance Criteria

1. RLS habilitado em `catalog_users` com policy `public_read_own` permitindo SELECT apenas para próprio WhatsApp
2. RLS habilitado em `catalog_users` com policy `public_insert_new` permitindo INSERT sem autenticação (validação no app)
3. RLS habilitado em `catalog_items` com policy `public_read_visible` permitindo SELECT apenas onde `visible = true`
4. RLS habilitado em `catalog_items` com policy `admin_full_access` permitindo ALL para usuários autenticados em `auth.users`
5. RLS habilitado em `catalog_favorites` com policy `user_manage_own` permitindo SELECT/INSERT/DELETE apenas para próprio WhatsApp
6. RLS habilitado em `catalog_cart` com policy `user_manage_own` permitindo SELECT/INSERT/UPDATE/DELETE apenas para próprio WhatsApp
7. RLS habilitado em `catalog_requests` com policy `user_read_own` permitindo SELECT apenas para próprio WhatsApp
8. RLS habilitado em `catalog_requests` com policy `user_create_request` permitindo INSERT para usuários do catálogo
9. RLS habilitado em `catalog_requests` com policy `admin_full_access` permitindo SELECT/UPDATE para usuários autenticados em `auth.users`
10. RLS habilitado em `catalog_orders` com policy `admin_read_all` permitindo SELECT para usuários autenticados em `auth.users`
11. Testes locais confirmam que usuário do catálogo não consegue acessar tabelas `users`, `sales`, `customers`
12. Testes locais confirmam que admin consegue gerenciar todas as tabelas do catálogo

---

### Story 1.3: Criar Sistema de Autenticação Customizado via WhatsApp

**As a** desenvolvedor,
**I want** implementar sistema de autenticação customizado que valida WhatsApp sem senha,
**so that** usuários do catálogo possam se autenticar rapidamente usando apenas número de telefone.

#### Acceptance Criteria

1. Arquivo `/lib/services/catalog-auth.ts` criado com funções: `validateWhatsApp()`, `checkUserExists()`, `createCatalogUser()`, `generateCatalogToken()`
2. Função `validateWhatsApp()` valida formato internacional (ex: +5511999999999) usando regex
3. Função `checkUserExists()` consulta `catalog_users` por WhatsApp e retorna boolean + dados se existir
4. Função `createCatalogUser()` insere novo registro em `catalog_users` com WhatsApp + nome
5. Função `generateCatalogToken()` cria JWT customizado com payload `{whatsapp, name}` e TTL de 30 dias usando secret do Supabase
6. Server Action `/app/catalogo/actions/auth.ts` criado com `authenticateWithWhatsApp(whatsapp, name?)`
7. Server Action valida formato do WhatsApp, verifica existência, cria usuário se necessário, gera token
8. Server Action retorna `{success: boolean, user?: CatalogUser, requiresName?: boolean, error?: string}`
9. Cookie HTTP-only `catalog_token` é setado com JWT após autenticação bem-sucedida
10. Middleware `/middleware.ts` estendido para validar `catalog_token` em rotas `/catalogo/favoritos`, `/catalogo/carrinho`
11. Middleware decodifica JWT e anexa dados do usuário em `request.catalogUser`
12. Teste unitário confirma que WhatsApp inválido retorna erro
13. Teste unitário confirma que novo usuário sem nome retorna `requiresName: true`
14. Teste unitário confirma que usuário existente autentica e retorna dados

---

### Story 1.4: Criar Estrutura de Rotas e Layout do Catálogo Público

**As a** desenvolvedor,
**I want** criar estrutura de rotas Next.js para o catálogo público com layout base,
**so that** tenhamos fundação para implementar páginas do catálogo.

#### Acceptance Criteria

1. Diretório `/app/catalogo` criado com arquivo `layout.tsx`
2. Layout do catálogo (`/app/catalogo/layout.tsx`) inclui: header público (logo, busca, carrinho), footer, navegação sticky
3. Layout do catálogo não inclui menu lateral administrativo do Auralux
4. Layout do catálogo usa paleta de cores diferenciada (tons neutros + acentos dourados)
5. Arquivo `/app/catalogo/page.tsx` criado como página inicial (home do catálogo)
6. Home do catálogo renderiza placeholder "Bem-vindo ao Catálogo Auralux" (implementação completa em Epic 2)
7. Arquivo `/app/catalogo/produto/[id]/page.tsx` criado como página de detalhes (implementação completa em Epic 2)
8. Arquivo `/app/catalogo/favoritos/page.tsx` criado (protegido por middleware)
9. Arquivo `/app/catalogo/carrinho/page.tsx` criado (protegido por middleware)
10. Componente `/components/catalog/CatalogHeader.tsx` criado com logo, busca (placeholder), ícone carrinho com contador
11. Componente `/components/catalog/CatalogFooter.tsx` criado com links institucionais e redes sociais
12. Arquivo `/types/catalog.ts` criado com types: `CatalogUser`, `CatalogItem`, `CatalogFavorite`, `CatalogCart`, `CatalogRequest`
13. Navegação funcional entre páginas do catálogo usando `next/link`
14. Middleware redireciona usuários não autenticados de `/catalogo/favoritos` e `/catalogo/carrinho` para modal de login

---

### Story 1.5: Criar Modal de Autenticação (WhatsApp Input)

**As a** usuário do catálogo,
**I want** autenticar-me via modal simples que solicita apenas WhatsApp,
**so that** possa acessar favoritos e carrinho sem fricção de cadastro complexo.

#### Acceptance Criteria

1. Componente `/components/catalog/AuthModal.tsx` criado como bottom sheet modal mobile-friendly
2. Modal exibe input de WhatsApp com máscara internacional (+55 11 99999-9999)
3. Modal valida formato do WhatsApp em tempo real com feedback visual (check verde ou erro)
4. Ao submeter WhatsApp válido, modal chama Server Action `authenticateWithWhatsApp()`
5. Se `requiresName: true`, modal exibe campo adicional para nome completo (obrigatório)
6. Ao submeter nome, modal cria usuário e autentica automaticamente
7. Se autenticação bem-sucedida, modal fecha e usuário permanece na página atual
8. Estado de autenticação é armazenado em Context Provider (`CatalogAuthProvider`)
9. Context Provider expõe `{user, isAuthenticated, login, logout}` para componentes do catálogo
10. Hook `useCatalogAuth()` criado para facilitar acesso ao contexto
11. Modal exibe loading state durante autenticação
12. Modal exibe mensagem de erro se autenticação falhar (ex: erro de rede)
13. Modal pode ser acionado por qualquer componente usando `openAuthModal()` do contexto
14. Teste de integração confirma fluxo completo: abrir modal → inserir WhatsApp → autenticar → fechar modal

---

## Epic 2: Visualização Pública do Catálogo e Navegação

**Epic Goal:** Implementar interface pública do catálogo com home (destaques + novidades), grid de produtos com filtros por categoria e busca textual, página de detalhes do produto, e otimizações de performance (lazy loading, caching).

---

### Story 2.1: Criar Serviço de Catálogo (Data Layer)

**As a** desenvolvedor,
**I want** criar serviço TypeScript para buscar produtos do catálogo com cache e otimizações,
**so that** componentes do catálogo possam consumir dados de forma performática e consistente.

#### Acceptance Criteria

1. Arquivo `/lib/services/catalog.ts` criado com funções: `getFeaturedProducts()`, `getNewProducts()`, `getProductsByCategory()`, `searchProducts()`, `getProductDetails()`
2. Função `getFeaturedProducts()` retorna produtos onde `catalog_items.featured = true AND visible = true` ordenados por `featured_order`
3. Função `getNewProducts()` retorna últimos 10 produtos adicionados ao catálogo (`catalog_items.created_at DESC`)
4. Função `getProductsByCategory(categoryId)` retorna produtos filtrados por categoria com paginação (20 itens por página)
5. Função `searchProducts(query)` busca produtos por nome usando `ILIKE` no PostgreSQL
6. Função `getProductDetails(productId)` retorna produto com JOIN em `catalog_items` para buscar detalhes extras (notas de fragrância, ocasião, etc)
7. Todas as funções usam Supabase client com validação de RLS (apenas produtos `visible = true`)
8. Todas as funções incluem campos: `id`, `name`, `price`, `image_url`, `category_id`, `description`, `stock_quantity`, `catalog_details` (notas, ocasião, data prevista)
9. React Query hooks criados: `useFeaturedProducts()`, `useNewProducts()`, `useProductsByCategory()`, `useSearchProducts()`, `useProductDetails()`
10. Hooks configurados com `staleTime: 60000` (1 minuto) para cache agressivo
11. Teste unitário confirma que produtos com `visible = false` não são retornados
12. Teste unitário confirma que busca funciona com termos parciais (ex: "Dior" encontra "Dior Sauvage")

---

### Story 2.2: Implementar Home do Catálogo com Produtos em Destaque e Novidades

**As a** usuário do catálogo,
**I want** visualizar home com produtos em destaque e novidades,
**so that** possa descobrir produtos relevantes rapidamente ao acessar o catálogo.

#### Acceptance Criteria

1. Página `/app/catalogo/page.tsx` implementada com seções: Hero Banner, Produtos em Destaque, Novidades, Categorias em Destaque
2. Hero Banner exibe imagem de alta qualidade com CTA "Explorar Catálogo" (link para `/catalogo/produtos`)
3. Seção "Produtos em Destaque" exibe até 6 produtos em carrossel horizontal swipeable
4. Seção "Novidades" exibe últimos 10 produtos adicionados ao catálogo em grid 2 colunas (mobile)
5. Seção "Categorias em Destaque" exibe cards de categorias com imagem e nome (link para `/catalogo/produtos?categoria={id}`)
6. Componente `/components/catalog/ProductCard.tsx` criado para exibir produto: imagem, nome, preço, ícone de favorito, badge de estoque
7. ProductCard exibe badge "Em breve" se `stock_quantity = 0` e `stock_return_date` existe
8. ProductCard exibe badge "Indisponível" se `stock_quantity = 0` e `stock_return_date` é null
9. ProductCard usa Next.js Image component com `loading="lazy"` e placeholder blur
10. Ao clicar em ProductCard, navega para `/catalogo/produto/[id]`
11. Skeleton screens exibidos durante carregamento de produtos em destaque e novidades
12. Erro de carregamento exibe mensagem amigável "Não foi possível carregar produtos. Tente novamente."
13. Home usa ISR (Incremental Static Regeneration) com revalidação a cada 60 segundos
14. Teste E2E confirma que home carrega em menos de 2 segundos em conexão 3G simulada

---

### Story 2.3: Implementar Listagem de Produtos com Filtros e Busca

**As a** usuário do catálogo,
**I want** visualizar lista completa de produtos com filtros por categoria e busca textual,
**so that** possa encontrar produtos específicos facilmente.

#### Acceptance Criteria

1. Página `/app/catalogo/produtos/page.tsx` criada com grid de produtos, barra de filtros e busca
2. Grid exibe produtos em 2 colunas (mobile) ou 4 colunas (desktop) usando ProductCard component
3. Barra de filtros sticky no topo inclui: dropdown de categorias, input de busca
4. Dropdown de categorias lista todas as categorias ativas com contador de produtos
5. Ao selecionar categoria, URL atualiza para `/catalogo/produtos?categoria={id}` e grid filtra produtos
6. Ao digitar na busca (debounce 300ms), URL atualiza para `/catalogo/produtos?q={query}` e grid exibe resultados
7. Se categoria e busca aplicados simultaneamente, filtro é combinado (AND logic)
8. Grid implementa scroll infinito (Intersection Observer) carregando 20 produtos por página
9. Mensagem "Carregando mais produtos..." exibida ao final do scroll
10. Se nenhum produto encontrado, exibe mensagem "Nenhum produto encontrado. Tente outra busca ou categoria."
11. Botão "Limpar filtros" reseta categoria e busca, voltando para `/catalogo/produtos`
12. Estado de filtros persiste ao navegar entre páginas (query params)
13. Skeleton grid exibido durante carregamento inicial
14. Teste E2E confirma que busca por "Dior" retorna apenas produtos com "Dior" no nome
15. Teste E2E confirma que scroll infinito carrega próxima página ao chegar no final

---

### Story 2.4: Implementar Página de Detalhes do Produto

**As a** usuário do catálogo,
**I want** visualizar detalhes completos de um produto,
**so that** possa conhecer informações detalhadas antes de adicionar ao carrinho ou favoritos.

#### Acceptance Criteria

1. Página `/app/catalogo/produto/[id]/page.tsx` implementada com layout de detalhes
2. Seção superior exibe: imagem do produto em alta resolução (pinch-to-zoom habilitado), nome, preço, categoria
3. Badge de estoque exibido: "Disponível", "Em breve (data prevista)", ou "Indisponível"
4. Seção de descrição exibe texto completo do produto (`description` de `products`)
5. Se `catalog_items` possui detalhes extras, exibe seção "Detalhes de Fragrância": Notas de Topo, Corpo, Fundo
6. Se `catalog_items` possui ocasião, exibe chip "Ocasião: {ocasião}"
7. Se `catalog_items` possui intensidade, exibe chip "Intensidade: {intensidade}"
8. Se `catalog_items` possui longevidade, exibe chip "Durabilidade: {longevidade}"
9. Botões de ação fixos no bottom: "Adicionar aos Favoritos" (ícone coração) e "Adicionar ao Carrinho" (ícone carrinho)
10. Ao clicar em "Adicionar aos Favoritos" sem autenticação, abre modal de login
11. Ao clicar em "Adicionar ao Carrinho" sem autenticação, abre modal de login
12. Se produto já está nos favoritos, botão exibe "Remover dos Favoritos" (coração preenchido)
13. Ao adicionar/remover favorito, exibe toast "Adicionado aos favoritos" / "Removido dos favoritos"
14. Ao adicionar ao carrinho, exibe toast "Produto adicionado ao carrinho" com link para ver carrinho
15. Seção "Produtos Relacionados" no final exibe 4 produtos da mesma categoria
16. Meta tags Open Graph e Twitter Cards configuradas dinamicamente com dados do produto
17. Structured data (Schema.org Product) adicionado para SEO
18. Página usa SSG com ISR (revalidação a cada 60 segundos)
19. Teste E2E confirma que adicionar produto ao carrinho estando autenticado persiste no banco

---

### Story 2.5: Implementar Sistema de Categorias e Navegação

**As a** usuário do catálogo,
**I want** navegar facilmente entre categorias de produtos,
**so that** possa explorar o catálogo de forma organizada.

#### Acceptance Criteria

1. Componente `/components/catalog/CategoryNav.tsx` criado para navegação horizontal de categorias
2. CategoryNav exibe lista de categorias scrolláveis horizontalmente com chips (mobile)
3. Chip "Todos" exibe contador total de produtos no catálogo
4. Cada chip de categoria exibe nome e contador de produtos
5. Categoria ativa destacada visualmente (cor de fundo diferente)
6. CategoryNav é sticky abaixo do header durante scroll
7. Ao clicar em categoria, navega para `/catalogo/produtos?categoria={id}`
8. Página `/app/catalogo/categoria/[id]/page.tsx` criada (redireciona para `/catalogo/produtos?categoria={id}`)
9. Serviço `catalog.ts` inclui função `getCategories()` que retorna categorias com contador de produtos visíveis
10. Hook `useCategories()` criado usando React Query com cache de 5 minutos
11. CategoryNav exibe skeleton durante carregamento
12. Se nenhuma categoria tem produtos visíveis, não exibe a categoria
13. Teste E2E confirma que navegar entre categorias atualiza grid de produtos corretamente

---

## Epic 3: Favoritos, Carrinho e Solicitação de Produtos

**Epic Goal:** Permitir que usuários autenticados salvem produtos favoritos, montem carrinhos de compras, finalizem pedidos via WhatsApp, e solicitem produtos específicos através de formulário livre.

---

### Story 3.1: Implementar Sistema de Favoritos

**As a** usuário do catálogo autenticado,
**I want** salvar produtos como favoritos e visualizá-los em página dedicada,
**so that** possa acessar rapidamente produtos que me interessam.

#### Acceptance Criteria

1. Arquivo `/lib/services/catalog-favorites.ts` criado com funções: `addFavorite()`, `removeFavorite()`, `getUserFavorites()`, `isFavorite()`
2. Função `addFavorite(userWhatsapp, productId)` insere registro em `catalog_favorites`
3. Função `removeFavorite(userWhatsapp, productId)` deleta registro de `catalog_favorites`
4. Função `getUserFavorites(userWhatsapp)` retorna lista de produtos favoritados com JOIN em `products` e `catalog_items`
5. Função `isFavorite(userWhatsapp, productId)` verifica se produto está nos favoritos
6. Hooks React Query criados: `useFavorites()`, `useAddFavorite()`, `useRemoveFavorite()`, `useIsFavorite()`
7. Página `/app/catalogo/favoritos/page.tsx` implementada exibindo grid de produtos favoritos
8. Se nenhum favorito, exibe mensagem "Você ainda não tem favoritos. Explore o catálogo!"
9. Cada ProductCard na página de favoritos exibe botão "Remover dos Favoritos" (ícone X ou coração preenchido)
10. Ao remover favorito, produto desaparece da lista com animação suave
11. Toast exibido ao remover: "Produto removido dos favoritos"
12. Ícone de favorito em ProductCard (catálogo geral) atualiza instantaneamente ao adicionar/remover (optimistic update)
13. Contador de favoritos exibido no header do catálogo (badge no ícone de coração)
14. Swipe gesture para remover favorito (swipe left no mobile)
15. Teste E2E confirma que favorito persiste após logout e login novamente
16. Teste de integração confirma que RLS impede usuário de ver favoritos de outro WhatsApp

---

### Story 3.2: Implementar Sistema de Carrinho

**As a** usuário do catálogo autenticado,
**I want** adicionar produtos ao carrinho e gerenciar quantidades,
**so that** possa preparar meu pedido antes de enviar ao gestor.

#### Acceptance Criteria

1. Arquivo `/lib/services/catalog-cart.ts` criado com funções: `addToCart()`, `removeFromCart()`, `updateCartQuantity()`, `getUserCart()`, `clearCart()`
2. Função `addToCart(userWhatsapp, productId, quantity)` insere ou atualiza registro em `catalog_cart`
3. Função `removeFromCart(userWhatsapp, productId)` deleta item do carrinho
4. Função `updateCartQuantity(userWhatsapp, productId, quantity)` atualiza quantidade (validação: min 1, max stock_quantity)
5. Função `getUserCart(userWhatsapp)` retorna itens do carrinho com JOIN em `products` incluindo nome, preço, imagem
6. Função `clearCart(userWhatsapp)` deleta todos os itens do carrinho
7. Hooks React Query: `useCart()`, `useAddToCart()`, `useRemoveFromCart()`, `useUpdateCartQuantity()`, `useClearCart()`
8. Página `/app/catalogo/carrinho/page.tsx` implementada exibindo lista de itens do carrinho
9. Cada item exibe: imagem, nome, preço unitário, quantidade (input stepper), subtotal, botão remover
10. Footer fixo do carrinho exibe: total geral, botão "Finalizar Pedido"
11. Input stepper valida quantidade máxima baseada em `stock_quantity` do produto
12. Se quantidade exceder estoque, exibe aviso "Estoque limitado a X unidades"
13. Ao remover item, produto desaparece com animação e total é recalculado
14. Se carrinho vazio, exibe mensagem "Seu carrinho está vazio. Adicione produtos do catálogo!"
15. Ícone de carrinho no header exibe badge com contador de itens
16. Floating Action Button (FAB) no catálogo exibe ícone de carrinho com contador (fixo no canto inferior direito)
17. Swipe gesture para remover item (swipe left no mobile)
18. Teste E2E confirma que carrinho persiste após fechar e reabrir app (sessão mantida)
19. Teste de integração confirma que RLS impede usuário de ver carrinho de outro WhatsApp

---

### Story 3.3: Implementar Finalização de Pedido via WhatsApp

**As a** usuário do catálogo autenticado,
**I want** finalizar pedido gerando mensagem pré-formatada para enviar ao gestor via WhatsApp,
**so that** possa concluir minha compra de forma simples e familiar.

#### Acceptance Criteria

1. Botão "Finalizar Pedido" na página do carrinho chama função `generateWhatsAppMessage()`
2. Função `generateWhatsAppMessage()` cria mensagem formatada contendo: saudação, lista de produtos (nome, quantidade, preço), total, nome e WhatsApp do cliente
3. Exemplo de mensagem: "Olá! Gostaria de finalizar meu pedido:\n\n1. Dior Sauvage 100ml (2x) - R$ 280,00\n2. Chanel N°5 50ml (1x) - R$ 350,00\n\nTotal: R$ 630,00\n\nNome: João Silva\nWhatsApp: +55 11 99999-9999"
4. Função `createOrder()` insere registro em `catalog_orders` com dados do carrinho, status 'sent', timestamp
5. Link WhatsApp gerado: `https://wa.me/{NUMERO_GESTOR}?text={mensagem_encoded}`
6. Número do gestor armazenado em variável de ambiente `NEXT_PUBLIC_WHATSAPP_BUSINESS`
7. Ao clicar em "Finalizar Pedido", abre modal de confirmação com preview da mensagem
8. Modal exibe: "Seu pedido será enviado via WhatsApp. Revise os itens:", lista de produtos, total, botão "Enviar Agora"
9. Ao confirmar, abre WhatsApp em nova aba/app com mensagem pré-formatada
10. Após enviar, carrinho é limpo automaticamente (`clearCart()`)
11. Notificação em tempo real enviada ao gestor (insere em `catalog_orders` que aciona trigger Supabase Realtime)
12. Página de sucesso exibida: "Pedido enviado com sucesso! Aguarde contato do gestor."
13. Teste E2E confirma fluxo completo: adicionar produtos → carrinho → finalizar → mensagem WhatsApp gerada
14. Teste de integração confirma que `catalog_orders` recebe registro após finalização

---

### Story 3.4: Implementar Formulário de Solicitação de Produtos

**As a** usuário do catálogo autenticado,
**I want** solicitar produtos que não estão no catálogo via formulário livre,
**so that** possa pedir itens específicos ao gestor.

#### Acceptance Criteria

1. Página `/app/catalogo/solicitar-produto/page.tsx` criada com formulário de solicitação
2. Formulário contém campos: "Nome do Produto" (input text obrigatório), "Observações" (textarea opcional)
3. Campo "Observações" inclui placeholder: "Ex: Marca, tamanho, fragrância desejada..."
4. Botão "Enviar Solicitação" valida campos e chama Server Action `createProductRequest()`
5. Server Action `createProductRequest(userWhatsapp, productName, observations)` insere registro em `catalog_requests` com status 'pending'
6. Após enviar, exibe toast "Solicitação enviada! O gestor entrará em contato em breve."
7. Usuário é redirecionado para `/catalogo/solicitacoes` (página de histórico de solicitações)
8. Página `/app/catalogo/solicitacoes/page.tsx` criada listando solicitações do usuário ordenadas por data (mais recente primeiro)
9. Cada solicitação exibe: nome do produto, observações, status (badge colorido: Pendente/Em análise/Atendida/Não disponível), data
10. Se nenhuma solicitação, exibe mensagem "Você ainda não fez solicitações. Explore o catálogo!"
11. Notificação em tempo real enviada ao gestor (trigger Supabase Realtime no canal `catalog_requests`)
12. Link "Solicitar Produto" adicionado no footer do catálogo
13. Teste E2E confirma fluxo: preencher formulário → enviar → notificação chega ao gestor
14. Teste de integração confirma que RLS impede usuário de ver solicitações de outro WhatsApp

---

### Story 3.5: Otimizar Performance com Caching e Prefetching

**As a** desenvolvedor,
**I want** implementar estratégias de caching e prefetching no catálogo,
**so that** usuários tenham experiência fluida e rápida mesmo em conexões lentas.

#### Acceptance Criteria

1. React Query configurado globalmente com `staleTime: 60000` (1 minuto) para queries do catálogo
2. Prefetching habilitado para ProductCard usando Intersection Observer (prefetch de detalhes ao entrar na viewport)
3. Next.js Image component configurado para usar WebP e placeholder blur em todas as imagens de produtos
4. Service Worker configurado para cachear imagens de produtos em cache HTTP (offline-first)
5. ISR (Incremental Static Regeneration) configurado na home e páginas de categoria com `revalidate: 60`
6. Edge caching via Vercel CDN configurado para assets estáticos (imagens, CSS, JS)
7. Lazy loading implementado para componentes pesados (modais, formulários) usando `next/dynamic`
8. Debounce de 300ms implementado no input de busca para evitar requests excessivos
9. Optimistic updates implementados em favoritos e carrinho (UI atualiza instantaneamente antes de confirmar no servidor)
10. Skeleton screens exibidos em todos os loading states (produtos, categorias, carrinho, favoritos)
11. Lighthouse score de Performance ≥ 90 em mobile
12. Teste E2E confirma que catálogo carrega em menos de 2 segundos em conexão 3G simulada (Chrome DevTools)

---

## Epic 4: Gestão de Catálogo no App Administrativo

**Epic Goal:** Criar nova seção no app autenticado do Auralux para gestores controlarem o catálogo público: ativar/desativar produtos, adicionar detalhes extras (notas de fragrância, ocasião, intensidade), gerenciar produtos em destaque, e visualizar preview do catálogo.

---

### Story 4.1: Criar Rota de Gestão de Catálogo no App Administrativo

**As a** desenvolvedor,
**I want** criar nova seção no app autenticado para gestão do catálogo,
**so that** gestores possam acessar ferramentas de controle do catálogo público.

#### Acceptance Criteria

1. Diretório `/app/(authenticated)/catalogo-admin` criado dentro da estrutura autenticada
2. Arquivo `/app/(authenticated)/catalogo-admin/page.tsx` criado como página principal de gestão
3. Novo item "Gestão de Catálogo" adicionado ao menu lateral do app autenticado (ícone: 🏷️)
4. Middleware valida que rotas `/catalogo-admin/*` requerem autenticação via Supabase Auth (usuários em `auth.users`)
5. Layout de gestão reutiliza `RootLayout` do app autenticado (header, sidebar, user menu)
6. Página principal (`/catalogo-admin/page.tsx`) exibe dashboard com métricas: Total de produtos no catálogo, Produtos em destaque, Solicitações pendentes, Pedidos recebidos hoje
7. Cards de métricas são clicáveis e navegam para seções específicas
8. Navegação tabs criada: "Produtos", "Solicitações", "Pedidos", "Analytics"
9. Teste de integração confirma que usuário não autenticado é redirecionado ao login ao acessar `/catalogo-admin`

---

### Story 4.2: Implementar Listagem de Produtos com Toggle de Visibilidade

**As a** gestor,
**I want** visualizar todos os produtos do estoque com toggle para ativar/desativar no catálogo público,
**so that** possa controlar quais produtos aparecem para clientes.

#### Acceptance Criteria

1. Página `/app/(authenticated)/catalogo-admin/produtos/page.tsx` criada com tabela de produtos
2. Tabela exibe colunas: Imagem (thumbnail), Nome, Categoria, Preço, Estoque, Visível no Catálogo (toggle), Destaque (toggle), Ações
3. Toggle "Visível no Catálogo" atualiza campo `visible` em `catalog_items` (cria registro se não existir)
4. Toggle "Destaque" atualiza campo `featured` em `catalog_items`
5. Ações incluem botões: "Editar Detalhes" (ícone lápis), "Preview" (ícone olho)
6. Filtro por categoria disponível no topo da tabela
7. Busca por nome de produto implementada (debounce 300ms)
8. Paginação de 50 produtos por página
9. Ao ativar produto pela primeira vez (`visible = true`), cria registro em `catalog_items` automaticamente com valores padrão
10. Feedback visual imediato ao alterar toggle (optimistic update + toast de confirmação)
11. Se erro ao salvar, reverte toggle e exibe toast de erro
12. Coluna "Estoque" exibe badge vermelho se `stock_quantity = 0`
13. Tabela ordenável por: Nome, Preço, Estoque, Data de adição ao catálogo
14. Teste E2E confirma que ativar produto no admin faz ele aparecer no catálogo público
15. Teste E2E confirma que desativar produto no admin faz ele desaparecer do catálogo público

---

### Story 4.3: Implementar Formulário de Detalhes Extras do Produto

**As a** gestor,
**I want** adicionar detalhes extras aos produtos (notas de fragrância, ocasião, intensidade, durabilidade),
**so that** clientes tenham informações completas no catálogo público.

#### Acceptance Criteria

1. Página `/app/(authenticated)/catalogo-admin/produtos/[id]/editar/page.tsx` criada com formulário
2. Formulário carrega dados de `catalog_items` se existir, senão exibe campos vazios
3. Campos do formulário: "Notas de Topo" (textarea), "Notas de Corpo" (textarea), "Notas de Fundo" (textarea), "Ocasião" (multiselect: Dia, Noite, Casual, Formal, Esportivo), "Intensidade" (select: Suave, Moderada, Forte), "Durabilidade" (select: Curta 2-4h, Média 4-6h, Longa 6-8h, Muito Longa 8h+), "Data Prevista de Retorno" (date picker, condicional se estoque = 0)
4. Botão "Salvar Detalhes" valida campos e atualiza `catalog_items` (insere se não existir)
5. Botão "Preview no Catálogo" abre página pública do produto em nova aba
6. Toast de sucesso exibido: "Detalhes salvos com sucesso!"
7. Validações: notas de fragrância máximo 500 caracteres cada, ocasião pelo menos 1 selecionada
8. Se produto não está visível no catálogo, exibe aviso: "⚠️ Este produto não está visível no catálogo. Ative a visibilidade para clientes verem os detalhes."
9. Preview em tempo real dos detalhes abaixo do formulário (como aparecerão no catálogo)
10. Botão "Limpar Detalhes" reseta campos para vazios
11. Teste E2E confirma que salvar detalhes atualiza página pública do produto imediatamente
12. Teste de integração confirma que RLS permite apenas usuários autenticados editarem `catalog_items`

---

### Story 4.4: Implementar Gestão de Produtos em Destaque com Ordenação

**As a** gestor,
**I want** selecionar produtos em destaque e ordenar sua exibição na home do catálogo,
**so that** possa controlar quais produtos recebem maior visibilidade.

#### Acceptance Criteria

1. Página `/app/(authenticated)/catalogo-admin/destaques/page.tsx` criada com listagem de produtos em destaque
2. Listagem exibe produtos onde `catalog_items.featured = true` ordenados por `featured_order`
3. Drag-and-drop implementado para reordenar produtos (biblioteca: `@dnd-kit/core`)
4. Ao reordenar, atualiza `featured_order` automaticamente no banco
5. Botão "Adicionar Produto em Destaque" abre modal com busca de produtos
6. Modal permite buscar produto por nome e selecionar para adicionar aos destaques
7. Ao adicionar, seta `featured = true` e atribui próximo `featured_order` disponível
8. Botão "Remover dos Destaques" (ícone X) remove produto seta `featured = false`
9. Limite máximo de 6 produtos em destaque (validação client-side e server-side)
10. Preview da home do catálogo no lado direito da tela mostrando carrossel de destaques em tempo real
11. Toast de sucesso ao reordenar: "Ordem atualizada!"
12. Teste E2E confirma que reordenar produtos reflete imediatamente no carrossel da home pública
13. Teste E2E confirma que adicionar 7º produto em destaque exibe erro "Limite de 6 produtos atingido"

---

### Story 4.5: Implementar Preview do Catálogo Público

**As a** gestor,
**I want** visualizar preview do catálogo público antes de publicar mudanças,
**so that** possa validar aparência e conteúdo antes de tornar visível aos clientes.

#### Acceptance Criteria

1. Botão "Preview do Catálogo" adicionado no header da seção de gestão (`/catalogo-admin`)
2. Ao clicar, abre catálogo público em nova aba (mesmo domínio, `/catalogo`)
3. Query param `?preview=true` adicionada para modo de preview
4. Em modo preview, gestor autenticado pode ver produtos com `visible = false` (badge "Oculto" exibido)
5. Banner no topo do preview indica: "🔍 Modo Preview - Você está visualizando como gestor"
6. Preview permite navegar entre todas as páginas do catálogo (home, produtos, detalhes)
7. Ações de favoritar/carrinho desabilitadas em modo preview
8. Botão "Sair do Preview" no banner retorna para `/catalogo-admin`
9. Preview funciona em mobile (responsivo)
10. Teste E2E confirma que gestor consegue ver produtos ocultos em modo preview
11. Teste E2E confirma que cliente comum não consegue acessar produtos ocultos mesmo com `?preview=true`

---

## Epic 5: Gestão de Solicitações e Notificações em Tempo Real

**Epic Goal:** Implementar sistema completo de notificações em tempo real usando Supabase Realtime para gestor visualizar e gerenciar solicitações de clientes e pedidos finalizados, com inbox centralizado e ações de resposta.

---

### Story 5.1: Configurar Supabase Realtime para Notificações

**As a** desenvolvedor,
**I want** configurar Supabase Realtime para broadcasts de solicitações e pedidos,
**so that** gestor receba notificações instantâneas quando clientes interagirem com o catálogo.

#### Acceptance Criteria

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

### Story 5.2: Implementar Sistema de Notificações no Header Administrativo

**As a** gestor,
**I want** visualizar notificações em tempo real no header do app administrativo,
**so that** possa ser alertado imediatamente sobre solicitações e pedidos.

#### Acceptance Criteria

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

### Story 5.3: Implementar Inbox de Solicitações de Clientes

**As a** gestor,
**I want** visualizar todas as solicitações de clientes em inbox centralizado,
**so that** possa gerenciar e responder solicitações de forma organizada.

#### Acceptance Criteria

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

### Story 5.4: Implementar Gestão de Pedidos Recebidos

**As a** gestor,
**I want** visualizar pedidos finalizados pelos clientes com detalhes completos,
**so that** possa processar vendas e acompanhar conversões.

#### Acceptance Criteria

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

### Story 5.5: Implementar Página Centralizada de Notificações

**As a** gestor,
**I want** visualizar histórico completo de notificações em página dedicada,
**so that** possa revisar notificações antigas e não perder informações importantes.

#### Acceptance Criteria

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

## Epic 6: Analytics, Otimizações e Lançamento

**Epic Goal:** Implementar dashboard de analytics do catálogo para gestor monitorar performance, otimizar SEO e performance técnica, executar testes E2E completos, e preparar para deploy em produção.

---

### Story 6.1: Implementar Rastreamento de Visualizações de Produtos

**As a** desenvolvedor,
**I want** rastrear visualizações de produtos no catálogo,
**so that** gestor possa analisar quais produtos geram mais interesse.

#### Acceptance Criteria

1. Migração SQL cria tabela `catalog_product_views` com campos: `id`, `product_id` (FK), `user_whatsapp` (nullable), `viewed_at`, `session_id`
2. Função `trackProductView(productId, userWhatsapp?, sessionId)` insere registro em `catalog_product_views`
3. `sessionId` gerado no client-side (UUID v4) e armazenado em `localStorage` para rastrear sessões anônimas
4. Página de detalhes do produto (`/catalogo/produto/[id]`) chama `trackProductView()` no `useEffect` (apenas 1x por sessão por produto)
5. Debounce de 2 segundos implementado para evitar rastreamento em scrolls rápidos
6. View não rastreada se produto é acessado em modo preview pelo gestor
7. Índice criado em `catalog_product_views(product_id, viewed_at)` para queries rápidas
8. RLS configurado: apenas gestores autenticados podem ler `catalog_product_views`
9. Função SQL `get_most_viewed_products(days, limit)` retorna produtos mais visualizados em período com contador
10. Teste unitário confirma que visualização é registrada apenas 1x por sessão
11. Teste de integração confirma que RLS impede acesso de usuários do catálogo a `catalog_product_views`

---

### Story 6.2: Implementar Dashboard de Analytics do Catálogo

**As a** gestor,
**I want** visualizar analytics do catálogo em dashboard dedicado,
**so that** possa tomar decisões data-driven sobre produtos e estratégias de venda.

#### Acceptance Criteria

1. Página `/app/(authenticated)/catalogo-admin/analytics/page.tsx` criada com dashboard
2. Cards de métricas no topo: Total de Visualizações (7d), Produtos Mais Vistos, Taxa de Conversão (pedidos/visualizações), Solicitações Pendentes
3. Gráfico de linha exibindo visualizações por dia (últimos 30 dias)
4. Tabela "Top 10 Produtos Mais Vistos" com colunas: Nome, Visualizações, Favoritos, Pedidos, Taxa de Conversão
5. Tabela "Produtos com Baixa Conversão" (alta visualização, poucos pedidos) para identificar problemas
6. Seção "Categorias Mais Populares" com gráfico de barras horizontais
7. Seção "Solicitações por Produto" listando produtos mais solicitados que não estão no catálogo
8. Filtro de período: Hoje, Última semana, Último mês, Último trimestre
9. Botão "Exportar Dados" gera CSV com dados do período selecionado
10. Gráficos implementados com biblioteca Recharts ou Chart.js
11. Dados carregados via Server Actions para garantir RLS
12. Skeleton screens durante carregamento
13. Dashboard atualiza automaticamente a cada 5 minutos (React Query refetch)
14. Teste E2E confirma que gráficos renderizam corretamente com dados reais

---

### Story 6.3: Implementar SEO e Meta Tags Dinâmicas

**As a** desenvolvedor,
**I want** implementar SEO completo no catálogo com meta tags dinâmicas,
**so that** produtos sejam indexados corretamente por motores de busca e compartilhados em redes sociais.

#### Acceptance Criteria

1. Arquivo `/app/catalogo/produto/[id]/opengraph-image.tsx` criado para gerar Open Graph image dinamicamente
2. Meta tags dinâmicas configuradas em cada página do catálogo (`metadata` export)
3. Página de produto inclui: `title`, `description`, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`), Twitter Cards
4. Structured data (JSON-LD) adicionado em páginas de produto seguindo schema.org/Product: `name`, `image`, `description`, `offers` (price, availability)
5. Sitemap dinâmico gerado em `/app/catalogo/sitemap.xml/route.ts` listando todos os produtos visíveis
6. Robots.txt configurado permitindo indexação de `/catalogo` e bloqueando `/catalogo-admin`
7. Canonical URLs configuradas para evitar conteúdo duplicado
8. Meta tag `viewport` configurada para mobile-first
9. Tags `hreflang` (se multi-idioma futuramente)
10. Meta tags incluem palavras-chave relevantes (perfumes, fragrâncias, marcas)
11. Teste com Google Rich Results confirma que structured data é válido
12. Teste com Facebook Debugger confirma que Open Graph funciona corretamente
13. Lighthouse SEO score ≥ 95

---

### Story 6.4: Otimizar Performance e Core Web Vitals

**As a** desenvolvedor,
**I want** otimizar performance do catálogo para atingir Core Web Vitals excelentes,
**so that** usuários tenham experiência rápida e SEO seja beneficiado.

#### Acceptance Criteria

1. Next.js Image component usado em todas as imagens com `loading="lazy"`, `placeholder="blur"`, formatos WebP
2. Supabase Storage configurado para servir imagens via CDN com transformações on-the-fly (resize, format=webp)
3. Route Handlers configurados com `export const dynamic = 'force-static'` onde aplicável
4. ISR (Incremental Static Regeneration) configurado em home e categorias com `revalidate: 60`
5. Prefetching desabilitado em links que não são críticos (`prefetch={false}`)
6. Bundle size otimizado: tree-shaking, code splitting por rota
7. Componentes pesados lazy-loaded com `next/dynamic` (modais, formulários)
8. Service Worker configurado para cache estratégico (network-first para dados, cache-first para assets)
9. Fonts otimizados com `next/font` (subset Latin, preload)
10. Critical CSS inlined, CSS não-crítico defer
11. Lighthouse Performance score ≥ 90 (mobile) e ≥ 95 (desktop)
12. Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
13. Teste com PageSpeed Insights confirma scores
14. Teste E2E com throttling 3G confirma tempo de carregamento < 3s

---

### Story 6.5: Executar Testes E2E e Preparar para Produção

**As a** desenvolvedor,
**I want** executar suite completa de testes E2E e validar deploy em produção,
**so that** catálogo seja lançado com confiança e sem bugs críticos.

#### Acceptance Criteria

1. Suite de testes E2E criada com Playwright cobrindo jornadas críticas:
   - **Jornada 1:** Acessar catálogo → ver produtos → ver detalhes → adicionar favorito (requer login) → autenticar → favorito salvo
   - **Jornada 2:** Adicionar produtos ao carrinho → atualizar quantidades → finalizar pedido → mensagem WhatsApp gerada
   - **Jornada 3:** Solicitar produto via formulário → gestor recebe notificação em tempo real
   - **Jornada 4 (Admin):** Ativar produto no catálogo → adicionar detalhes extras → produto aparece no catálogo público
   - **Jornada 5 (Admin):** Gerenciar solicitação → alterar status → adicionar observações
2. Testes executam em CI/CD (GitHub Actions) em cada PR
3. Database seed script criado para popular dados de teste (produtos, categorias, usuários)
4. Testes usam banco Supabase local (Docker) para isolamento
5. Variáveis de ambiente validadas em checklist pré-deploy
6. Checklist pré-deploy inclui: RLS policies auditadas, índices de performance criados, migrations executadas, types TypeScript regenerados
7. Deploy staging realizado em branch `staging` para validação final
8. Smoke tests executados em staging: acessar home, login, visualizar produto, adicionar carrinho
9. Deploy produção via Vercel com build bem-sucedido
10. Monitoramento configurado: Vercel Analytics, Sentry para error tracking
11. Documentação atualizada: README com instruções de setup, variáveis de ambiente, comandos de desenvolvimento
12. Changelog atualizado com versão v2.0 (Catálogo Público)
13. Teste E2E confirma que todas as jornadas funcionam em produção
14. Validação manual por stakeholder (seu irmão) confirma aprovação para lançamento

---

## Checklist Results Report

_(Executado antes do handoff para arquiteto)_

### ✅ Completude do PRD

- [x] Todos os requisitos funcionais documentados
- [x] Todos os requisitos não-funcionais documentados
- [x] Epics sequenciados logicamente com dependencies claras
- [x] Stories dentro de epics seguem ordem lógica de implementação
- [x] Acceptance criteria são testáveis e específicos
- [x] UI/UX goals definem visão clara sem entrar em detalhes de implementação
- [x] Technical assumptions fornecem constraints claros para arquiteto

### ✅ Qualidade dos Requirements

- [x] Cada requirement é mensurável e verificável
- [x] Não há conflitos entre requirements
- [x] Requirements cobrem casos de erro e edge cases
- [x] Security considerations endereçados (RLS, autenticação, rate limiting)
- [x] Performance requirements específicos (LCP, FID, CLS, load time)
- [x] Accessibility requirements definidos (WCAG 2.1 AA)

### ✅ Viabilidade Técnica

- [x] Solução reutiliza infraestrutura existente (Supabase, Next.js, Vercel)
- [x] Não requer serviços externos pagos (WhatsApp API grátis via deep links)
- [x] Database schema escalável (índices, RLS, triggers)
- [x] Real-time implementável com Supabase Realtime existente
- [x] Estimativa de esforço: 6 epics, ~30 stories, ~4-6 semanas para 1 dev full-time

### ✅ User Experience

- [x] Jornadas de usuário mapeadas end-to-end
- [x] Autenticação simplificada (WhatsApp only, sem fricção)
- [x] Feedback visual em todas as interações
- [x] Mobile-first com touch gestures
- [x] Conversão via WhatsApp alinhada com comportamento do usuário brasileiro

### ⚠️ Riscos Identificados

1. **Validação de WhatsApp:** Sem verificação via SMS, pode haver cadastros falsos
   - **Mitigação:** Implementar rate limiting + validação manual pelo gestor em primeiros pedidos
2. **Escalabilidade de notificações:** Muitas notificações simultâneas podem sobrecarregar
   - **Mitigação:** Batch notifications, debounce de 5s, limite de 50 notificações não lidas
3. **Performance em catálogo grande:** Listagem pode ficar lenta com 1000+ produtos
   - **Mitigação:** Paginação, virtual scrolling, índices de busca full-text

### 📋 Próximos Passos

1. **Handoff para UX Expert:** Criar wireframes de alta fidelidade para telas do catálogo
2. **Handoff para Arquiteto:** Detalhar arquitetura técnica, database schema final, API contracts
3. **Setup de Projeto:** Criar branches, configurar CI/CD, setup de ambientes (dev, staging, prod)

---

## Next Steps

### UX Expert Prompt

```
Você receberá o PRD "Auralux Catálogo Público" para criar wireframes de alta fidelidade e design system.

Foco principal:
- Catálogo público mobile-first inspirado em marcas de luxo (Sephora, Fragrantica)
- Fluxo de autenticação via WhatsApp (modal simples)
- ProductCard, página de detalhes, carrinho, favoritos
- Gestão de catálogo no app admin (toggle de visibilidade, formulário de detalhes extras)

Deliverables:
1. Wireframes de todas as core screens (Figma)
2. Design system (cores, tipografia, componentes, iconografia)
3. Protótipo interativo para validação de fluxos
4. Guidelines de acessibilidade (WCAG 2.1 AA)

Use o PRD como referência para requirements e visão de UX.
```

### Architect Prompt

```
Você receberá o PRD "Auralux Catálogo Público" para criar arquitetura técnica detalhada.

Foco principal:
- Database schema com novas tabelas (catalog_users, catalog_items, catalog_favorites, catalog_cart, catalog_requests, catalog_orders)
- RLS policies para isolamento de dados
- Sistema de autenticação customizado via WhatsApp (JWT + cookie HTTP-only)
- Supabase Realtime para notificações (triggers + broadcasts)
- Service layer e data contracts
- Performance optimizations (ISR, caching, prefetching)
- SEO implementation (meta tags, structured data, sitemap)

Deliverables:
1. Architecture diagram (C4 Model)
2. Database schema detalhado com migrations SQL
3. API contracts (Server Actions + types)
4. Sequencing diagram para fluxos críticos (autenticação, finalização de pedido, notificações)
5. Technical debt e trade-offs documentation

Use o PRD como referência para requirements e technical assumptions.
```

---

**PRD Versão 1.0 - Concluído em 2025-11-09**

