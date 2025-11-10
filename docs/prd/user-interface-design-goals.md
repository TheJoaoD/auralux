# User Interface Design Goals

## Overall UX Vision

O catálogo público deve proporcionar uma experiência de **descoberta aspiracional** inspirada em marcas de luxo como Sephora, Fragrantica e The Perfume Shop. A interface deve comunicar sofisticação, simplicidade e confiança, utilizando espaçamento generoso, tipografia elegante e fotografia de produto em alta qualidade.

A jornada do usuário deve ser **sem fricção**: navegar livremente, autenticar-se apenas quando necessário (favoritos/carrinho), e converter via WhatsApp de forma natural. Cada tela deve ter um objetivo claro e guiar o usuário suavemente para a próxima ação.

O gestor, por sua vez, deve ter uma experiência de **controle total** dentro do app administrativo: gerenciar catálogo, enriquecer produtos com detalhes, monitorar solicitações e conversões em tempo real.

## Key Interaction Paradigms

- **Scroll infinito com lazy loading** para listagem de produtos
- **Cards de produto** com imagem grande, nome, preço e ícones de ação rápida (favorito/carrinho)
- **Bottom sheet modal** para detalhes de produto (slide up)
- **Floating Action Button (FAB)** para carrinho fixo no canto inferior direito
- **Swipe gestures** para remover itens do carrinho/favoritos
- **Pull-to-refresh** para atualizar catálogo
- **Skeleton screens** durante carregamentos
- **Toast notifications** para feedback de ações
- **Sticky header** com busca e filtros no catálogo

## Core Screens and Views

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

## Accessibility

**WCAG 2.1 AA** - Contraste de cores, navegação por teclado, labels ARIA, textos alternativos em imagens

## Branding

Manter identidade visual do Auralux atual (paleta de cores, tipografia, logo). O catálogo deve ser uma extensão natural da marca, com ajustes para comunicar luxo e aspiração:
- **Paleta:** Tons neutros (branco, cinza claro) com acentos dourados ou pretos para CTAs
- **Tipografia:** Fontes serifadas para títulos (elegância), sans-serif para corpo (legibilidade)
- **Imagens:** Alta resolução, fundo clean, iluminação profissional
- **Iconografia:** Minimalista e moderna (Lucide Icons ou similar)

## Target Device and Platforms

**Mobile-first responsive web** (PWA instalável)
- Otimizado para iOS Safari e Android Chrome
- Breakpoints: 320px (mobile), 768px (tablet), 1024px+ (desktop)
- Touch targets mínimo 44x44px
- Suporte a gestos nativos (swipe, pinch-to-zoom em imagens)

---
