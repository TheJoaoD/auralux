# Auralux - UI/UX Guidelines

[← PRD Core](./00-prd-core.md) | [Tech Constraints →](./02-tech-constraints.md)

---

## User Interface Enhancement Goals

### Integration with Existing UI
Since this is a greenfield project, we will establish the design system from scratch with the following principles:
- **Mobile-first approach**: All designs optimized for iOS devices first
- **Bottom navigation pattern**: Fixed horizontal navigation bar with 3 primary tabs
- **Attractive minimalist aesthetic**: Clean, modern design with emphasis on data visualization
- **Consistent component library**: Reusable components across all screens
- **Touch-optimized interactions**: All elements designed for thumb-friendly access

### Screen Structure and Navigation

#### Bottom Navigation Bar (Fixed)
1. **Left Tab - Customers (Clientes)**
   - Icon: User/People icon
   - Default view: Customer gallery

2. **Center Tab - Sales (Vendas)** ⭐ DEFAULT
   - Icon: Chart/Dashboard icon
   - Default view: Sales dashboard
   - Primary action: "+ Nova Venda" button

3. **Right Tab - Inventory (Estoque)**
   - Icon: Box/Package icon
   - Default view: Product gallery with metrics

#### Top Bar (Consistent across all screens)
- App logo/name (Auralux)
- Settings/Configuration icon (gear icon)

### Modified/New Screens and Views

#### 1. Authentication Screen
- **Login Screen**
  - Attractive branded header with Auralux logo
  - Supabase authentication form
  - Clean, modern design with focus on ease of access

#### 2. Sales Dashboard (Default Landing)
- **Header Section**
  - "+ Nova Venda" button (prominent, primary action)
  - Key metrics cards (daily sales, weekly sales, monthly sales)

- **Dashboard Content**
  - Sales chart/graph (attractive visualization)
  - Recent sales list
  - Payment method breakdown
  - Revenue vs. actual received (considering installment discounts)

- **New Sale Modal/Screen**
  - Step 1: Customer selection (searchable dropdown)
  - Step 2: Product selection (multiple, with quantity)
  - Step 3: Payment method selection
    - PIX
    - Dinheiro (Cash)
    - Parcelado (Installments - 1x to 12x)
  - Step 4: If "Parcelado" selected → Popup for actual amount received
  - Step 5: Confirmation and sale completion

#### 3. Customer Management Screen
- **Header Section**
  - Total customers metric card
  - "+ Novo Cliente" button

- **Customer Gallery**
  - Card-based layout
  - Each card shows: Customer name, WhatsApp, purchase count
  - Search/filter functionality

- **New Customer Form**
  - Full name (text input)
  - WhatsApp number (phone input with validation)
  - Save/Cancel actions

#### 4. Inventory Management Screen
- **Header Section**
  - Total inventory quantity metric
  - Total potential value metric
  - "+ Novo Produto" button

- **Product Gallery**
  - Card-based grid layout
  - Each card shows:
    - Product image
    - Product name
    - Sale price
    - Cost price
    - Current quantity
    - Profit margin (calculated and highlighted)
    - Category badge

- **New/Edit Product Form**
  - Image upload (with preview)
  - Product name
  - Category selection (from configured categories)
  - Sale price (currency input)
  - Cost price (currency input)
  - Quantity (numeric input)
  - Auto-calculated profit margin display

#### 5. Settings/Configuration Screen
- **Categories Management**
  - List of categories
  - Add/Edit/Delete category

- **Application Settings**
  - Low stock threshold configuration
  - Display preferences
  - Notification settings
  - Account settings

### UI Consistency Requirements

#### Color Scheme - Calor e Sofisticação Terrena
**Sensação:** Aconchegante, humano, natural, chique - ideal para marca de cosméticos e perfumes.

| Cor | Hex Code | Uso na Aplicação | Classe Tailwind |
|-----|----------|------------------|-----------------|
| **Carvão** | `#202020` | Fundo principal da aplicação | `bg-[#202020]` |
| **Taupe/Greige** | `#A1887F` | Cards, banners e elementos de fundo secundários | `bg-[#A1887F]` |
| **Rosa Queimado** | `#C49A9A` | **Cor de Acento:** Botões CTA, tags, highlights | `bg-[#C49A9A]` |
| **Areia** | `#E0DCD1` | Textos sobre fundos escuros (mais suave que branco) | `text-[#E0DCD1]` |
| **Off-White** | `#F7F5F2` | Fundo alternativo para seções mais leves | `bg-[#F7F5F2]` |
| **Prata (Logo)** | `#BDBDBD` | Elementos de luxo, ícones especiais | `text-[#BDBDBD]` |

**Hierarquia de Cores:**
- **Primary (CTA)**: Rosa Queimado (#C49A9A) - Botões de ação principal
- **Background Dark**: Carvão (#202020) - Fundo principal
- **Background Light**: Off-White (#F7F5F2) - Modais e seções claras
- **Surface**: Taupe/Greige (#A1887F) - Cards e elevações
- **Text Primary**: Areia (#E0DCD1) - Texto principal
- **Text Secondary**: Taupe/Greige (#A1887F) - Textos secundários
- **Accent**: Prata (#BDBDBD) - Elementos premium e logo

#### Typography
- **Font Family**:
  - Headings: Inter ou Montserrat (modern sans-serif)
  - Body: Inter (legibilidade mobile)
- **Font Sizes**:
  - h1: 2rem (32px)
  - h2: 1.5rem (24px)
  - h3: 1.25rem (20px)
  - body: 1rem (16px)
  - small: 0.875rem (14px)
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

#### Spacing
- Use escala consistente: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Tailwind spacing: space-1, space-2, space-3, space-4, space-6, space-8, space-12, space-16

#### Component Patterns
- **Buttons**: Rounded corners (8px), shadow on hover, Rosa Queimado para primary
- **Cards**: Rounded (12px), subtle shadow, Taupe/Greige background
- **Forms**: Rounded inputs (8px), Areia labels, Rosa Queimado focus ring
- **Modals**: Off-White background, centered, smooth transitions

#### Icons
- Library: Lucide React ou Heroicons
- Cor padrão: Areia (#E0DCD1)
- Acento: Rosa Queimado (#C49A9A) quando ativo

#### Loading States & Feedback Patterns
- **Splash Screen**: Logo Auralux prateado centralizado em fundo Carvão (#202020) com animação suave
- **Skeleton Screens**: Placeholders em Taupe/Greige (#A1887F) com shimmer effect sutil
- **Loading Spinners**: Logo Auralux animado (rotação suave) em Rosa Queimado (#C49A9A)
- **Success Messages**: Ícone de check em Rosa Queimado com fundo Off-White
- **Error Messages**: Ícone de alerta em tom avermelhado (#C76A6A) com fundo Carvão
- **Progress Indicators**: Barra em Rosa Queimado sobre fundo Taupe/Greige
- **Optimistic UI**: Fade in suave para novos itens, bounce leve em adições

#### Data Visualization
- **Chart Colors**: Gradientes de Rosa Queimado e Taupe/Greige
- **Metric Cards**: Fundo Taupe/Greige, números em Areia, ícones em Rosa Queimado
- **Consistent chart library**: Recharts com tema customizado Auralux

---

## Related Documents

- [← PRD Core](./00-prd-core.md)
- [Tech Constraints →](./02-tech-constraints.md)
- [Epic 1: MVP](./epic-01-mvp.md)
- [Main PRD](../prd.md)

---

**Document Version:** v2.1
**Last Updated:** 2025-11-07
**Status:** Complete - Modularized
