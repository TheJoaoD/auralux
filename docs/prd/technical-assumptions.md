# Technical Assumptions

## Repository Structure

**Monorepo** - O catálogo público será parte do mesmo repositório Next.js do Auralux, organizado em:
- `/app/catalogo/*` - Rotas públicas do catálogo
- `/app/(authenticated)/catalogo-admin/*` - Gestão do catálogo (autenticado)
- `/lib/services/catalog-*` - Serviços específicos do catálogo
- `/components/catalog/*` - Componentes do catálogo
- `/types/catalog.ts` - Tipos TypeScript do catálogo

## Service Architecture

**Monolito Next.js com separação lógica:**
- **Catálogo Público:** App Routes públicas (`/catalogo`)
- **Gestão:** App Routes autenticadas (middleware protege `/catalogo-admin`)
- **Backend:** Server Actions + Supabase (PostgreSQL + Realtime)
- **Cache:** React Query para dados do catálogo
- **State:** Zustand para carrinho e favoritos

## Testing Requirements

**Estratégia de testes:**
- **Unit tests:** Serviços de catálogo (Vitest)
- **Integration tests:** Fluxos de autenticação e carrinho (Playwright)
- **E2E tests:** Jornada completa usuário (navegação → adicionar carrinho → finalizar)
- **Manual testing:** Validação de notificações em tempo real e mensagens WhatsApp

## Additional Technical Assumptions and Requests

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
