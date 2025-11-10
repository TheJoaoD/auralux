# Epic 1: Fundação do Catálogo e Autenticação Simplificada

**Epic Goal:** Estabelecer infraestrutura de banco de dados para o catálogo público, implementar sistema de autenticação customizado via WhatsApp (sem senha), criar estrutura de rotas Next.js, e configurar RLS policies para isolamento de dados.

---

## Story 1.1: Criar Schema de Banco de Dados do Catálogo

**As a** desenvolvedor,
**I want** criar as tabelas necessárias para o catálogo público no Supabase,
**so that** possamos armazenar usuários do catálogo, produtos habilitados, favoritos, carrinhos e solicitações de forma estruturada e segura.

### Acceptance Criteria

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

## Story 1.2: Configurar Row-Level Security (RLS) para Catálogo

**As a** desenvolvedor,
**I want** configurar políticas RLS no Supabase para isolar dados do catálogo,
**so that** usuários do catálogo público não tenham acesso a dados administrativos e vice-versa.

### Acceptance Criteria

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

## Story 1.3: Criar Sistema de Autenticação Customizado via WhatsApp

**As a** desenvolvedor,
**I want** implementar sistema de autenticação customizado que valida WhatsApp sem senha,
**so that** usuários do catálogo possam se autenticar rapidamente usando apenas número de telefone.

### Acceptance Criteria

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

## Story 1.4: Criar Estrutura de Rotas e Layout do Catálogo Público

**As a** desenvolvedor,
**I want** criar estrutura de rotas Next.js para o catálogo público com layout base,
**so that** tenhamos fundação para implementar páginas do catálogo.

### Acceptance Criteria

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

## Story 1.5: Criar Modal de Autenticação (WhatsApp Input)

**As a** usuário do catálogo,
**I want** autenticar-me via modal simples que solicita apenas WhatsApp,
**so that** possa acessar favoritos e carrinho sem fricção de cadastro complexo.

### Acceptance Criteria

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
