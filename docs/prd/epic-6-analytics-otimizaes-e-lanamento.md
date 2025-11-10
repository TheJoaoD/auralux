# Epic 6: Analytics, Otimizações e Lançamento

**Epic Goal:** Implementar dashboard de analytics do catálogo para gestor monitorar performance, otimizar SEO e performance técnica, executar testes E2E completos, e preparar para deploy em produção.

---

## Story 6.1: Implementar Rastreamento de Visualizações de Produtos

**As a** desenvolvedor,
**I want** rastrear visualizações de produtos no catálogo,
**so that** gestor possa analisar quais produtos geram mais interesse.

### Acceptance Criteria

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

## Story 6.2: Implementar Dashboard de Analytics do Catálogo

**As a** gestor,
**I want** visualizar analytics do catálogo em dashboard dedicado,
**so that** possa tomar decisões data-driven sobre produtos e estratégias de venda.

### Acceptance Criteria

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

## Story 6.3: Implementar SEO e Meta Tags Dinâmicas

**As a** desenvolvedor,
**I want** implementar SEO completo no catálogo com meta tags dinâmicas,
**so that** produtos sejam indexados corretamente por motores de busca e compartilhados em redes sociais.

### Acceptance Criteria

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

## Story 6.4: Otimizar Performance e Core Web Vitals

**As a** desenvolvedor,
**I want** otimizar performance do catálogo para atingir Core Web Vitals excelentes,
**so that** usuários tenham experiência rápida e SEO seja beneficiado.

### Acceptance Criteria

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

## Story 6.5: Executar Testes E2E e Preparar para Produção

**As a** desenvolvedor,
**I want** executar suite completa de testes E2E e validar deploy em produção,
**so that** catálogo seja lançado com confiança e sem bugs críticos.

### Acceptance Criteria

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
