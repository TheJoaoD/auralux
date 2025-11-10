# Next Steps

## UX Expert Prompt

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

## Architect Prompt

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

