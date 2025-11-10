# Epic 3: Favoritos, Carrinho e Solicitação de Produtos

**Epic Goal:** Permitir que usuários autenticados salvem produtos favoritos, montem carrinhos de compras, finalizem pedidos via WhatsApp, e solicitem produtos específicos através de formulário livre.

---

## Story 3.1: Implementar Sistema de Favoritos

**As a** usuário do catálogo autenticado,
**I want** salvar produtos como favoritos e visualizá-los em página dedicada,
**so that** possa acessar rapidamente produtos que me interessam.

### Acceptance Criteria

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

## Story 3.2: Implementar Sistema de Carrinho

**As a** usuário do catálogo autenticado,
**I want** adicionar produtos ao carrinho e gerenciar quantidades,
**so that** possa preparar meu pedido antes de enviar ao gestor.

### Acceptance Criteria

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

## Story 3.3: Implementar Finalização de Pedido via WhatsApp

**As a** usuário do catálogo autenticado,
**I want** finalizar pedido gerando mensagem pré-formatada para enviar ao gestor via WhatsApp,
**so that** possa concluir minha compra de forma simples e familiar.

### Acceptance Criteria

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

## Story 3.4: Implementar Formulário de Solicitação de Produtos

**As a** usuário do catálogo autenticado,
**I want** solicitar produtos que não estão no catálogo via formulário livre,
**so that** possa pedir itens específicos ao gestor.

### Acceptance Criteria

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

## Story 3.5: Otimizar Performance com Caching e Prefetching

**As a** desenvolvedor,
**I want** implementar estratégias de caching e prefetching no catálogo,
**so that** usuários tenham experiência fluida e rápida mesmo em conexões lentas.

### Acceptance Criteria

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
