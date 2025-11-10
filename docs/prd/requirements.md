# Requirements

## Functional Requirements

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

## Non-Functional Requirements

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
