# Epic 1: Fundação do Catálogo e Autenticação Simplificada ✅

## 📋 Resumo Executivo

Este diretório contém **TODAS as 5 stories** necessárias para implementar o **Epic 1: Fundação do Catálogo** - Infraestrutura base do catálogo público com database, segurança, autenticação e layout.

### ✅ Stories Criadas (5 de 5) 🎉

| # | Story | Prioridade | Estimativa | Arquivo |
|---|-------|------------|------------|---------|
| **1.1** | Criar Schema de Banco de Dados do Catálogo | 🔴 CRÍTICA | 2-3 dias | [1.1.catalog-database-schema.md](./1.1.catalog-database-schema.md) |
| **1.2** | Configurar Row-Level Security (RLS) | 🔴 CRÍTICA | 1-2 dias | [1.2.catalog-rls-policies.md](./1.2.catalog-rls-policies.md) |
| **1.3** | Sistema de Autenticação WhatsApp | 🔴 CRÍTICA | 2-3 dias | [1.3.catalog-whatsapp-auth.md](./1.3.catalog-whatsapp-auth.md) |
| **1.4** | Estrutura de Rotas e Layout | 🟡 ALTA | 2-3 dias | [1.4.catalog-routes-layout.md](./1.4.catalog-routes-layout.md) |
| **1.5** | Modal de Autenticação WhatsApp | 🟡 ALTA | 1-2 dias | [1.5.catalog-auth-modal.md](./1.5.catalog-auth-modal.md) |

**Total Estimado:** 8-13 dias de desenvolvimento (aproximadamente 1.5-2.5 semanas com 1 desenvolvedor)

---

## 🎯 Visão Geral das Entregas

### 🔴 Story 1.1: Database Schema
**Entregas:**
- ✅ 7 tabelas catalog_*: users, items, favorites, cart, requests, orders, product_views
- ✅ ENUMs: catalog_request_status, catalog_order_status
- ✅ Índices de performance em todos os campos críticos
- ✅ Triggers de updated_at
- ✅ Constraints: UNIQUE, CHECK, FK com CASCADE

### 🔴 Story 1.2: RLS Policies
**Entregas:**
- ✅ RLS habilitado em todas as tabelas
- ✅ Isolamento: usuários catálogo NÃO acessam tabelas admin
- ✅ Admin full access ao catálogo
- ✅ Privacidade: favoritos/carrinho apenas do próprio usuário
- ✅ Testes de isolamento

### 🔴 Story 1.3: Autenticação WhatsApp
**Entregas:**
- ✅ Serviço catalog-auth.ts com JWT customizado
- ✅ Server Action authenticateWithWhatsApp()
- ✅ Cookie HTTP-only com token
- ✅ Middleware de proteção de rotas
- ✅ TTL 30 dias

### 🟡 Story 1.4: Rotas e Layout
**Entregas:**
- ✅ Estrutura /app/catalogo/* completa
- ✅ Layout base com Header + Footer
- ✅ Paleta de cores catálogo (neutros + dourado)
- ✅ Rotas protegidas: favoritos, carrinho
- ✅ TypeScript types completos

### 🟡 Story 1.5: Modal de Auth
**Entregas:**
- ✅ AuthModal bottom sheet mobile
- ✅ Input WhatsApp com máscara
- ✅ Validação em tempo real
- ✅ CatalogAuthProvider + useCatalogAuth()
- ✅ Fluxo: WhatsApp → Nome (se novo) → Auth

---

## 🚀 Ordem de Execução

```
┌─────────────────────────────────────────┐
│ FASE 1: INFRAESTRUTURA (Semana 1)      │
├─────────────────────────────────────────┤
│ 1.1 → Database Schema (2-3 dias)       │
│ 1.2 → RLS Policies (1-2 dias)          │
│ 1.3 → Auth WhatsApp (2-3 dias)         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ FASE 2: UI FOUNDATION (Semana 2)       │
├─────────────────────────────────────────┤
│ 1.4 → Layout e Rotas (2-3 dias)        │
│ 1.5 → Modal de Auth (1-2 dias)         │
└─────────────────────────────────────────┘
```

### Dependências:
- 1.2 depende de 1.1 (tabelas devem existir)
- 1.3 depende de 1.1 e 1.2 (auth precisa de DB + RLS)
- 1.4 depende de 1.3 (layout usa auth)
- 1.5 depende de 1.3 e 1.4 (modal usa auth service + layout)

---

## ⚠️ ATENÇÕES CRÍTICAS

### 1. **DATABASE COMPARTILHADO**
- ⚠️ Tabelas `products` e `categories` já existem no sistema admin
- ⚠️ **NÃO** modificar essas tabelas
- ✅ `catalog_items` estende `products` via FK

### 2. **ISOLAMENTO RLS**
- ⚠️ Usuários catálogo NÃO podem acessar: users, sales, customers (admin)
- ✅ Story 1.2 testa isolamento

### 3. **JWT CUSTOMIZADO**
- ⚠️ NÃO usar Supabase Auth (é para admin)
- ✅ JWT customizado com claims: {whatsapp, name}
- ✅ TTL: 30 dias

### 4. **EPIC 2 DEPENDE DESTE EPIC**
- ⚠️ Epic 2 (Visualização Pública) só funciona se Epic 1 estiver completo
- ✅ Verificar todas as stories 1.1-1.5 estão "Done" antes de iniciar Epic 2

---

## 📂 Estrutura de Arquivos

```
supabase/
  migrations/
    YYYYMMDD_create_catalog_schema.sql       # 1.1
    YYYYMMDD_catalog_rls_policies.sql        # 1.2

app/
  catalogo/
    layout.tsx                               # 1.4
    page.tsx                                 # 1.4 (placeholder)
    produto/[id]/page.tsx                    # 1.4 (placeholder)
    favoritos/page.tsx                       # 1.4
    carrinho/page.tsx                        # 1.4
    actions/
      auth.ts                                # 1.3

components/
  catalog/
    CatalogHeader.tsx                        # 1.4
    CatalogFooter.tsx                        # 1.4
    AuthModal.tsx                            # 1.5

lib/
  services/
    catalog-auth.ts                          # 1.3
  providers/
    catalog-auth-provider.tsx                # 1.5

types/
  catalog.ts                                 # 1.4

middleware.ts                                # 1.3, 1.4 (extended)
```

---

## 🎯 Próximos Passos

Após completar Epic 1:
1. **Epic 2**: Visualização Pública (Home, Listagem, Detalhes, Filtros)
2. **Epic 3**: Favoritos e Carrinho (funcionalidades)
3. **Epic 4**: Gestão Admin do Catálogo
4. **Epic 5**: Notificações Real-time
5. **Epic 6**: Analytics e Launch

---

## 📊 Estatísticas

- **Stories**: 5
- **Prioridade CRÍTICA**: 3 (1.1, 1.2, 1.3)
- **Prioridade ALTA**: 2 (1.4, 1.5)
- **Estimativa**: 8-13 dias (1.5-2.5 semanas)

---

**Criado por:** Bob 🏃 (Scrum Master Agent)
**Projeto:** Auralux - Catálogo Público de Perfumes de Luxo
**Epic:** 1 - Fundação do Catálogo e Autenticação Simplificada
**Framework:** BMad™ Core
**Data:** 2025-11-09
**Versão:** 1.0

---

## 🔄 Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-09 | v1.0 | Created README with all 5 stories of Epic 1 | Bob (Scrum Master) |
