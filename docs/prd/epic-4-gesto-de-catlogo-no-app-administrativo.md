# Epic 4: Gestão de Catálogo no App Administrativo

**Epic Goal:** Criar nova seção no app autenticado do Auralux para gestores controlarem o catálogo público: ativar/desativar produtos, adicionar detalhes extras (notas de fragrância, ocasião, intensidade), gerenciar produtos em destaque, e visualizar preview do catálogo.

---

## Story 4.1: Criar Rota de Gestão de Catálogo no App Administrativo

**As a** desenvolvedor,
**I want** criar nova seção no app autenticado para gestão do catálogo,
**so that** gestores possam acessar ferramentas de controle do catálogo público.

### Acceptance Criteria

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

## Story 4.2: Implementar Listagem de Produtos com Toggle de Visibilidade

**As a** gestor,
**I want** visualizar todos os produtos do estoque com toggle para ativar/desativar no catálogo público,
**so that** possa controlar quais produtos aparecem para clientes.

### Acceptance Criteria

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

## Story 4.3: Implementar Formulário de Detalhes Extras do Produto

**As a** gestor,
**I want** adicionar detalhes extras aos produtos (notas de fragrância, ocasião, intensidade, durabilidade),
**so that** clientes tenham informações completas no catálogo público.

### Acceptance Criteria

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

## Story 4.4: Implementar Gestão de Produtos em Destaque com Ordenação

**As a** gestor,
**I want** selecionar produtos em destaque e ordenar sua exibição na home do catálogo,
**so that** possa controlar quais produtos recebem maior visibilidade.

### Acceptance Criteria

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

## Story 4.5: Implementar Preview do Catálogo Público

**As a** gestor,
**I want** visualizar preview do catálogo público antes de publicar mudanças,
**so that** possa validar aparência e conteúdo antes de tornar visível aos clientes.

### Acceptance Criteria

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
