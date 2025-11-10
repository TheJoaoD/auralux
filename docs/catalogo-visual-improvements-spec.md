# Auralux Catálogo - Especificação de Melhorias Visuais

## Sumário Executivo

Este documento define as melhorias visuais necessárias para alinhar o **Catálogo Público Auralux** com o design system e identidade visual do **App Administrativo Auralux**. Atualmente, o catálogo apresenta inconsistências significativas em:

- ✗ Paleta de cores (usando amber/dourado ao invés do purple/magenta brand)
- ✗ Espaçamento e densidade visual
- ✗ Componentes UI (não reutilizando o design system existente)
- ✗ Tipografia e hierarquia visual
- ✗ Padrões de interação

**Objetivo:** Garantir experiência visual coesa entre o catálogo público e o app administrativo, mantendo a identidade de marca Auralux.

---

## 1. Análise de Inconsistências Identificadas

### 1.1 Paleta de Cores - CRÍTICO ⚠️

**Problema:** O catálogo usa tons **amber/dourado** enquanto o app usa **purple/magenta** da brand Auralux.

| Elemento | Implementação Atual (Catálogo) | Design System Correto (App) |
|----------|--------------------------------|----------------------------|
| Primary Color | `text-amber-600`, `bg-amber-600` | `--primary: oklch(0.55 0.22 320)` (purple) |
| Gradient Logo | `from-primary to-accent` | `bg-gradient-to-r from-primary to-accent` |
| CTA Buttons | `bg-amber-600 hover:bg-amber-700` | `bg-primary hover:bg-primary/90` |
| Links/Hover | `text-amber-600 hover:text-amber-700` | `text-primary hover:text-primary/90` |

**Arquivos Afetados:**
- `/app/catalogo/page.tsx` - Hero CTA button (line 57)
- `/app/catalogo/produto/[id]/page.tsx` - Price color (line 136), category link (line 123)
- `/components/catalog/CatalogHeader.tsx` - Hover states (lines 52, 70, 88)
- `/components/catalog/CatalogFooter.tsx` - Social icons hover (lines 94, 103, 110)

### 1.2 Background Colors - MODERADO

**Problema:** Catálogo usa `bg-[#FAFAF8]` (bege claro) enquanto o app usa `bg-background` (white clean).

| Elemento | Atual | Correto |
|----------|-------|---------|
| Layout background | `bg-[#FAFAF8]` | `bg-background` |
| Cards background | `bg-white` | `bg-card` |
| Footer background | `bg-gray-50` | `bg-muted/30` |

**Arquivos Afetados:**
- `/app/catalogo/layout.tsx` (line 18)
- `/app/catalogo/produto/[id]/page.tsx` (line 89)
- `/components/catalog/CatalogFooter.tsx` (line 11)

### 1.3 Typography & Spacing - MODERADO

**Problema:** Catálogo não usa classes de tipografia do design system.

| Elemento | Atual | Correto |
|----------|-------|---------|
| Heading sizes | Custom `text-3xl`, `text-4xl` | `text-3xl font-bold` (mantém, mas adiciona consistência) |
| Body text | `text-gray-600`, `text-gray-900` | `text-muted-foreground`, `text-foreground` |
| Spacing | Valores arbitrários | Sistema: `gap-4`, `p-6`, etc. |

### 1.4 Component Styling - MODERADO

**Problema:** Componentes do catálogo não seguem variants do design system.

**ProductCard Issues:**
- Border color: `border-gray-200` → deve usar `border-border`
- Hover shadow: Custom `hover:shadow-lg` → deve usar `hover:shadow-md transition-shadow`
- Favorite button: Custom white bg → deve usar `variant="ghost"` do Button component

**CatalogHeader Issues:**
- Search input: Custom classes `bg-gray-50 border-gray-200` → deve usar Input component default
- Badge background: Custom `bg-primary` → correto, mas precisa ajustar primary color primeiro

### 1.5 Hero Banner - MENOR

**Problema:** Hero usa gradiente `from-black/70 via-black/50` que não comunica luxury.

**Sugestão:**
- Usar overlay com `from-primary/20 to-primary/5` + darkening layer
- Adicionar glass morphism effect (`backdrop-blur-sm`)

---

## 2. Design System de Referência (App Auralux)

### 2.1 Paleta de Cores Oficial

```css
/* globals.css - lines 7-41 */
:root {
  --primary: oklch(0.55 0.22 320);        /* Purple/Magenta */
  --primary-foreground: oklch(0.98 0 0);  /* White */
  --accent: oklch(0.6 0.24 310);          /* Lighter purple */
  --accent-foreground: oklch(0.98 0 0);   /* White */
  --background: oklch(0.98 0 0);          /* Clean white */
  --foreground: oklch(0.12 0 0);          /* Near black */
  --muted: oklch(0.88 0 0);               /* Light gray */
  --muted-foreground: oklch(0.45 0 0);    /* Medium gray */
  --border: oklch(0.92 0 0);              /* Subtle border */
}
```

**Uso correto:**
- Primary actions: `bg-primary text-primary-foreground`
- Secondary actions: `bg-secondary text-secondary-foreground`
- Borders: `border-border`
- Text hierarchy: `text-foreground` (titles), `text-muted-foreground` (descriptions)

### 2.2 Component Patterns de Referência

**Button Variants:**
```tsx
// Correto - usando design system
<Button variant="default">         // bg-primary
<Button variant="outline">         // border + hover:bg-accent
<Button variant="ghost">           // transparent + hover:bg-accent
<Button variant="secondary">       // bg-secondary
```

**Card Pattern:**
```tsx
// Correto - usando design system
<Card className="p-6">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Badge Pattern:**
```tsx
// Correto - usando design system
<Badge variant="default">          // Primary color
<Badge variant="secondary">        // Warning/Coming soon
<Badge variant="destructive">      // Error/Unavailable
<Badge variant="outline">          // Neutral
```

### 2.3 Navigation Patterns de Referência

**Bottom Navigation (App Administrativo):**
```tsx
// components/layout/BottomNav.tsx - lines 34-36
<nav className="fixed bottom-0 left-0 right-0 z-50
     bg-[#A1887F] border-t border-[#E0DCD1]/20">
```

**Observação:** O BottomNav usa paleta de cores diferente (`bg-[#A1887F]` - brown/taupe). Isso sugere que **pode haver dois temas**:
1. **Tema Administrativo:** Purple/magenta primary
2. **Tema BottomNav:** Brown/taupe (possivelmente tema "terra/luxo")

**Recomendação para Catálogo:** Seguir o tema **purple/magenta** do design system principal, NÃO o brown do BottomNav (que é específico para navegação mobile do admin).

---

## 3. Plano de Correção Detalhado

### 3.1 Global Theme Alignment

**Prioridade:** CRÍTICA 🔴

**Arquivos:**
- `/app/catalogo/layout.tsx`
- Todos os componentes em `/components/catalog/*`

**Ações:**

1. **Substituir background color:**
   ```tsx
   // ANTES
   <div className="min-h-screen bg-[#FAFAF8] flex flex-col">

   // DEPOIS
   <div className="min-h-screen bg-background flex flex-col">
   ```

2. **Remover todas as referências a `amber-*`:**
   - Find & Replace: `text-amber-600` → `text-primary`
   - Find & Replace: `text-amber-700` → `text-primary/90`
   - Find & Replace: `bg-amber-600` → `bg-primary`
   - Find & Replace: `bg-amber-700` → `bg-primary/90`
   - Find & Replace: `hover:text-amber-700` → `hover:text-primary/90`

3. **Atualizar gray colors para design system:**
   - `text-gray-600` → `text-muted-foreground`
   - `text-gray-900` → `text-foreground`
   - `bg-gray-50` → `bg-muted/30`
   - `bg-gray-100` → `bg-muted/50`
   - `border-gray-200` → `border-border`

---

### 3.2 CatalogHeader Component

**Prioridade:** ALTA 🟠

**Arquivo:** `/components/catalog/CatalogHeader.tsx`

**Mudanças Específicas:**

```tsx
// ANTES (lines 23-24)
<header className="sticky top-0 z-50 w-full border-b
        bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">

// DEPOIS
<header className="sticky top-0 z-50 w-full border-b border-border
        bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
```

```tsx
// ANTES (lines 28-31) - Logo
<span className="text-2xl font-bold bg-gradient-to-r
      from-primary to-accent bg-clip-text text-transparent">
  Auralux
</span>

// DEPOIS - MANTER (já correto, usa primary/accent)
```

```tsx
// ANTES (lines 38-42) - Search input
<Input
  type="search"
  placeholder="Buscar perfumes..."
  className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-primary"
/>

// DEPOIS
<Input
  type="search"
  placeholder="Buscar perfumes..."
  className="pl-10 focus-visible:ring-primary"
  // Remove custom bg/border - deixa Input usar defaults do design system
/>
```

```tsx
// ANTES (lines 49-52) - Buttons hover
<Button
  variant="ghost"
  size="icon"
  className="hidden md:inline-flex relative text-gray-600 hover:text-primary"
>

// DEPOIS
<Button
  variant="ghost"
  size="icon"
  className="hidden md:inline-flex relative text-muted-foreground hover:text-primary"
>
```

---

### 3.3 ProductCard Component

**Prioridade:** ALTA 🟠

**Arquivo:** `/components/catalog/ProductCard.tsx`

**Mudanças Específicas:**

```tsx
// ANTES (line 56)
<div className="relative rounded-lg border border-gray-200 bg-white
     overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">

// DEPOIS
<div className="relative rounded-lg border border-border bg-card
     overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
```

```tsx
// ANTES (lines 58-59) - Image container
<div className="relative aspect-square overflow-hidden bg-gray-100">

// DEPOIS
<div className="relative aspect-square overflow-hidden bg-muted/30">
```

```tsx
// ANTES (lines 94-96) - Product name
<h3 className="font-medium text-gray-900 line-clamp-2 min-h-[3rem]">
  {product.name}
</h3>

// DEPOIS
<h3 className="font-medium text-foreground line-clamp-2 min-h-[3rem]">
  {product.name}
</h3>
```

```tsx
// ANTES (line 100) - Category
<p className="text-xs text-gray-500">{product.category.name}</p>

// DEPOIS
<p className="text-xs text-muted-foreground">{product.category.name}</p>
```

---

### 3.4 Catalog Home Page (Hero + Sections)

**Prioridade:** ALTA 🟠

**Arquivo:** `/app/catalogo/page.tsx`

**Hero Banner Gradient:**

```tsx
// ANTES (line 42)
<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

// DEPOIS - Overlay mais sofisticado com brand colors
<div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-black/60 to-black/40" />
```

**Hero CTA Button:**

```tsx
// ANTES (lines 54-62)
<Button
  asChild
  size="lg"
  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
>
  <Link href="/catalogo/produtos">
    Explorar Catálogo
    <ArrowRight className="ml-2 h-5 w-5" />
  </Link>
</Button>

// DEPOIS
<Button
  asChild
  size="lg"
  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
>
  <Link href="/catalogo/produtos">
    Explorar Catálogo
    <ArrowRight className="ml-2 h-5 w-5" />
  </Link>
</Button>
```

---

### 3.5 Product Details Page

**Prioridade:** ALTA 🟠

**Arquivo:** `/app/catalogo/produto/[id]/page.tsx`

**Page Background:**

```tsx
// ANTES (line 89)
<div className="min-h-screen bg-gray-50">

// DEPOIS
<div className="min-h-screen bg-background">
```

**Category Link:**

```tsx
// ANTES (lines 121-126)
<Link
  href={`/catalogo/produtos?categoria=${product.category.id}`}
  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
>
  {product.category.name}
</Link>

// DEPOIS
<Link
  href={`/catalogo/produtos?categoria=${product.category.id}`}
  className="text-sm text-primary hover:text-primary/90 font-medium"
>
  {product.category.name}
</Link>
```

**Price Display:**

```tsx
// ANTES (line 136)
<p className="text-3xl font-bold text-amber-600">
  {formatPrice(product.sale_price)}
</p>

// DEPOIS
<p className="text-3xl font-bold text-primary">
  {formatPrice(product.sale_price)}
</p>
```

**Image Container:**

```tsx
// ANTES (line 106)
<div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm">

// DEPOIS
<div className="relative aspect-square bg-card rounded-lg overflow-hidden shadow-sm border border-border">
```

---

### 3.6 CartClient Component

**Prioridade:** MODERADA 🟡

**Arquivo:** `/components/catalog/CartClient.tsx`

**Empty State:**

```tsx
// ANTES (lines 134-135)
<ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
<h2 className="text-2xl font-semibold text-gray-900 mb-2">

// DEPOIS
<ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
<h2 className="text-2xl font-semibold text-foreground mb-2">
```

```tsx
// ANTES (line 138)
<p className="text-gray-600 mb-6">

// DEPOIS
<p className="text-muted-foreground mb-6">
```

**Card Styling:**

```tsx
// ANTES (line 159)
<Card key={item.product_id} className="p-4">

// DEPOIS - MANTER (Card component já usa design system)
```

**Price in Summary:**

```tsx
// ANTES (line 299)
<span className="text-primary">R$ {total.toFixed(2)}</span>

// DEPOIS - MANTER (já correto)
```

---

### 3.7 CatalogFooter Component

**Prioridade:** MODERADA 🟡

**Arquivo:** `/components/catalog/CatalogFooter.tsx`

**Footer Background:**

```tsx
// ANTES (line 11)
<footer className="border-t bg-gray-50">

// DEPOIS
<footer className="border-t border-border bg-muted/30">
```

**Text Colors:**

```tsx
// ANTES (lines 19-20)
<p className="text-sm text-gray-600">
  Perfumes de luxo com qualidade e elegância para cada ocasião.
</p>

// DEPOIS
<p className="text-sm text-muted-foreground">
  Perfumes de luxo com qualidade e elegância para cada ocasião.
</p>
```

**Link Hover States:**

```tsx
// ANTES (line 31)
className="text-gray-600 hover:text-primary transition-colors"

// DEPOIS
className="text-muted-foreground hover:text-primary transition-colors"
```

**Social Icons:**

```tsx
// ANTES (lines 92-95)
className="flex h-10 w-10 items-center justify-center rounded-full
          bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"

// DEPOIS - MANTER (já correto)
```

---

### 3.8 FilterBar Component

**Prioridade:** MODERADA 🟡

**Arquivo:** `/components/catalog/FilterBar.tsx`

**Sticky Bar Background:**

```tsx
// ANTES (line 79)
<div className="sticky top-0 z-10 bg-white border-b shadow-sm py-4">

// DEPOIS
<div className="sticky top-0 z-10 bg-background/95 backdrop-blur
     border-b border-border shadow-sm py-4">
```

**Search Icon:**

```tsx
// ANTES (line 83)
<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

// DEPOIS
<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
```

---

### 3.9 Additional Components (Quick Wins)

**FeaturedProductsSection, NewProductsSection, CategoriesSection:**
- Verificar se `bg-gray-50` ou `bg-white` → trocar por `bg-background`
- Titles usando `text-gray-900` → `text-foreground`
- Descriptions usando `text-gray-600` → `text-muted-foreground`

**ProductActions, FragranceDetails, RelatedProducts:**
- Manter uso de `bg-card`, `border-border` (se já estiverem corretos)
- Verificar hover states de buttons

---

## 4. Componentes que NÃO Precisam de Mudança

✅ **ProductCardSkeleton** - Usa `bg-gray-200` para efeito de loading (ok)
✅ **CategoryCard** - Precisa revisão visual, mas aguardar feedback
✅ **RequestProductForm** - Input components já usam design system
✅ **CategoryNav** - Sticky navigation, verificar apenas colors

---

## 5. Checklist de Implementação

### Fase 1: Color Replacement (Critical)

- [ ] **Global Find & Replace:**
  - [ ] `text-amber-600` → `text-primary`
  - [ ] `text-amber-700` → `text-primary/90`
  - [ ] `bg-amber-600` → `bg-primary`
  - [ ] `bg-amber-700` → `bg-primary/90`
  - [ ] `text-gray-600` → `text-muted-foreground` (exceto loading states)
  - [ ] `text-gray-900` → `text-foreground`
  - [ ] `bg-gray-50` → `bg-muted/30` (exceto skeletons)
  - [ ] `border-gray-200` → `border-border`

- [ ] **Layout Background:**
  - [ ] `/app/catalogo/layout.tsx` - line 18
  - [ ] `/app/catalogo/page.tsx` - verificar sections
  - [ ] `/app/catalogo/produto/[id]/page.tsx` - line 89

- [ ] **Component Backgrounds:**
  - [ ] ProductCard - card bg, image bg
  - [ ] CatalogFooter - footer bg
  - [ ] FilterBar - sticky bar bg

### Fase 2: Hero & Primary CTAs (High Impact)

- [ ] `/app/catalogo/page.tsx`:
  - [ ] Hero gradient overlay (line 42)
  - [ ] CTA button (lines 54-62)

- [ ] `/app/catalogo/produto/[id]/page.tsx`:
  - [ ] Category link (lines 121-126)
  - [ ] Price display (line 136)

### Fase 3: Headers & Navigation (High Visibility)

- [ ] `/components/catalog/CatalogHeader.tsx`:
  - [ ] Header background & border (line 23)
  - [ ] Search input (lines 38-42)
  - [ ] Button hover states (lines 49-88)

- [ ] `/components/catalog/CatalogFooter.tsx`:
  - [ ] Footer background (line 11)
  - [ ] Text colors (lines 19-20, etc.)
  - [ ] Link hover states

### Fase 4: Cards & Content (Medium Priority)

- [ ] `/components/catalog/ProductCard.tsx`:
  - [ ] Card border & background (line 56)
  - [ ] Image container bg (line 58)
  - [ ] Text colors (lines 94, 100, 104)

- [ ] `/components/catalog/CartClient.tsx`:
  - [ ] Empty state colors (lines 134-138)
  - [ ] Card text colors

### Fase 5: Final Touches (Low Priority)

- [ ] FilterBar component colors
- [ ] Section components (FeaturedProducts, NewProducts, Categories)
- [ ] Supporting components (FragranceDetails, RelatedProducts)

### Fase 6: Testing & Validation

- [ ] **Visual QA:**
  - [ ] Homepage - Hero, Featured, Novidades
  - [ ] Product listing - Grid, filters
  - [ ] Product details - All sections
  - [ ] Cart - Empty & filled states
  - [ ] Favorites - Empty & filled states
  - [ ] Footer - Links, social icons

- [ ] **Consistency Check:**
  - [ ] Nenhuma referência a `amber-*` restante
  - [ ] Nenhuma referência a `gray-*` (exceto skeletons)
  - [ ] Todas as cores usando CSS variables do design system

- [ ] **Responsive Test:**
  - [ ] Mobile (320px - 768px)
  - [ ] Tablet (768px - 1024px)
  - [ ] Desktop (1024px+)

- [ ] **Accessibility:**
  - [ ] Contraste de cores mantido (WCAG AA)
  - [ ] Focus states visíveis
  - [ ] Touch targets adequados (44x44px min)

---

## 6. Notas Técnicas para o Dev

### 6.1 CSS Variables de Referência

Sempre use as CSS variables definidas em `globals.css` ao invés de cores hardcoded:

```tsx
// ❌ EVITAR
className="bg-purple-500 text-white"

// ✅ PREFERIR
className="bg-primary text-primary-foreground"
```

### 6.2 Semantic Colors

```tsx
// Backgrounds
bg-background      // Page/layout background
bg-card            // Card backgrounds
bg-muted           // Subtle/disabled backgrounds

// Text
text-foreground           // Primary text
text-muted-foreground     // Secondary text
text-primary              // Brand color text

// Borders
border-border             // Standard borders

// States
bg-destructive            // Error/danger
bg-secondary              // Neutral actions
```

### 6.3 Component Consistency

Sempre que possível, use os componentes do `@/components/ui/*`:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
```

Evite criar estilos customizados quando o design system já oferece.

### 6.4 Hover & Focus States

Padrão de hover para elementos interativos:

```tsx
// Links
"text-muted-foreground hover:text-primary transition-colors"

// Buttons (ghost)
"hover:bg-accent hover:text-accent-foreground"

// Cards
"hover:shadow-md hover:border-primary/50 transition-all"
```

### 6.5 Dark Mode Consideration

O design system já tem suporte a dark mode definido em `globals.css` (lines 43-76).

**IMPORTANTE:** Ao usar CSS variables (`bg-background`, `text-foreground`), o dark mode funcionará automaticamente. NÃO adicionar classes específicas de dark mode (`dark:bg-gray-900`) - deixar o sistema cuidar disso.

---

## 7. Expected Before/After

### Homepage Hero
**Before:**
- Background overlay: Black gradient
- CTA button: `bg-amber-600`
- Overall feel: Generic e-commerce

**After:**
- Background overlay: Purple/black gradient with brand touch
- CTA button: `bg-primary` (purple)
- Overall feel: Luxury brand Auralux

### Product Card
**Before:**
- Border: `border-gray-200`
- Price: `text-amber-600`
- Category: `text-gray-500`

**After:**
- Border: `border-border` (subtle, consistent)
- Price: `text-primary` (purple)
- Category: `text-muted-foreground` (semantic)

### Header
**Before:**
- Search input: `bg-gray-50 border-gray-200`
- Icons hover: `text-gray-600 hover:text-primary`

**After:**
- Search input: Default Input styling (cleaner)
- Icons hover: `text-muted-foreground hover:text-primary` (semantic)

---

## 8. Validation Criteria

### Visual Consistency
- ✅ Catálogo usa mesma paleta purple/magenta do app admin
- ✅ Nenhum uso de `amber-*` colors
- ✅ Backgrounds usando `bg-background`, `bg-card`, `bg-muted`
- ✅ Text usando `text-foreground`, `text-muted-foreground`

### Component Alignment
- ✅ Buttons seguem variants do design system
- ✅ Cards seguem padrão Card component
- ✅ Badges seguem variants (default, secondary, destructive)
- ✅ Inputs usam Input component sem customizações desnecessárias

### Brand Identity
- ✅ Logo gradient mantido (`from-primary to-accent`)
- ✅ Primary actions em purple (`bg-primary`)
- ✅ Hover states consistentes
- ✅ Spacing consistente com app admin

### User Experience
- ✅ Contraste adequado (WCAG AA mínimo)
- ✅ Focus states visíveis
- ✅ Hover states responsivos
- ✅ Touch targets adequados (mobile)

---

## 9. Próximos Passos Recomendados

1. **Implementar Fase 1 (Color Replacement)** - 1-2h
   - Find & Replace global de colors
   - Testar visual básico

2. **Implementar Fase 2 (Hero & CTAs)** - 1h
   - Hero banner gradient
   - Primary CTA buttons

3. **Implementar Fase 3 (Headers)** - 1h
   - CatalogHeader
   - CatalogFooter

4. **Implementar Fase 4 (Cards)** - 1-2h
   - ProductCard
   - CartClient

5. **Implementar Fase 5 (Supporting)** - 1h
   - FilterBar
   - Section components

6. **Fase 6 (Testing)** - 1h
   - Visual QA
   - Responsive test
   - Accessibility check

**Total Estimado:** 6-8 horas de dev

---

## 10. Design System Evolution Notes

### Observações sobre BottomNav
O `BottomNav` do app admin usa `bg-[#A1887F]` (brown/taupe), que é DIFERENTE do primary purple.

**Possíveis razões:**
1. BottomNav é específico para navegação mobile e quer se destacar
2. Pode ser tema "terra/luxo" para segmento de produtos
3. Pode ser legacy que precisa ser alinhado também

**Recomendação para Catálogo:**
- **NÃO** seguir o brown do BottomNav
- Seguir o **purple/magenta** do design system principal
- Manter consistência com o resto do app (Dashboard, Cards, Buttons)

Se houver dúvidas, validar com o time se BottomNav deve manter brown ou se deve migrar para purple também.

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2025-11-09 | v1.0 | Especificação inicial de melhorias visuais do catálogo | Sally (UX Expert) |

---

**Documento criado por Sally 🎨 | UX Expert Auralux**