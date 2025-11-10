# Epic 2: Visualização Pública do Catálogo e Navegação

**Epic Goal:** Implementar interface pública do catálogo com home (destaques + novidades), grid de produtos com filtros por categoria e busca textual, página de detalhes do produto, e otimizações de performance (lazy loading, caching).

---

## Story 2.1: Criar Serviço de Catálogo (Data Layer)

**As a** desenvolvedor,
**I want** criar serviço TypeScript para buscar produtos do catálogo com cache e otimizações,
**so that** componentes do catálogo possam consumir dados de forma performática e consistente.

### Acceptance Criteria

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

## Story 2.2: Implementar Home do Catálogo com Produtos em Destaque e Novidades

**As a** usuário do catálogo,
**I want** visualizar home com produtos em destaque e novidades,
**so that** possa descobrir produtos relevantes rapidamente ao acessar o catálogo.

### Acceptance Criteria

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

## Story 2.3: Implementar Listagem de Produtos com Filtros e Busca

**As a** usuário do catálogo,
**I want** visualizar lista completa de produtos com filtros por categoria e busca textual,
**so that** possa encontrar produtos específicos facilmente.

### Acceptance Criteria

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

## Story 2.4: Implementar Página de Detalhes do Produto

**As a** usuário do catálogo,
**I want** visualizar detalhes completos de um produto,
**so that** possa conhecer informações detalhadas antes de adicionar ao carrinho ou favoritos.

### Acceptance Criteria

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

## Story 2.5: Implementar Sistema de Categorias e Navegação

**As a** usuário do catálogo,
**I want** navegar facilmente entre categorias de produtos,
**so that** possa explorar o catálogo de forma organizada.

### Acceptance Criteria

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
