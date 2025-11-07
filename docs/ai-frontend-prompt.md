# Auralux - AI Frontend Generation Master Prompt

## 🎯 Context and Overview

You are building **Auralux**, a complete mobile-first Progressive Web App (PWA) for retail store management, optimized for iOS devices. This is a greenfield project that will serve as a comprehensive sales, customer, and inventory management system.

---

## 📱 Project Goals

Create an intuitive, mobile-first PWA that enables store owners to:
- Manage customers (registration, tracking purchase history)
- Process sales transactions with multiple payment methods (PIX, Cash, Installments up to 12x)
- Track inventory with intelligent monitoring and automatic stock updates
- View real-time business metrics and analytics dashboards
- Handle installment payments with actual amount received tracking (after card processing fees)
- Calculate and display profit margins automatically
- Work offline with data sync when connection restored

---

## 🛠️ Technology Stack

### Core Technologies
- **React 18+** with **TypeScript** (strict mode)
- **Vite** (build tool and dev server)
- **TailwindCSS** (utility-first CSS framework)
- **React Router** (client-side routing)

### Backend & Database
- **Supabase** (Backend-as-a-Service)
  - PostgreSQL 14+ database
  - Authentication (email/password)
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage (for product images)

### State & Data Management
- **React Query** (@tanstack/react-query) - server state, caching, real-time updates
- **Context API** or **Zustand** - client state management
- **React Hook Form** - form management
- **Zod** - schema validation

### UI & Visualization
- **Recharts** or **Chart.js** - data visualization (sales charts, metrics)
- **Lucide React** or **Heroicons** - consistent icon library
- **Sonner** or **React Hot Toast** - toast notifications

### PWA & Utilities
- **Vite PWA Plugin** - PWA manifest and service worker
- **browser-image-compression** - client-side image compression
- **date-fns** - date formatting and manipulation

---

## 🎨 Design System & Visual Style

### Color Palette
```css
/* Primary Colors */
--primary-blue: #3B82F6;      /* Primary actions, links */
--primary-dark: #2563EB;      /* Hover states */

/* Accent Colors */
--accent-green: #10B981;      /* Success, profit, PIX payments */
--accent-orange: #F59E0B;     /* Warnings, installments */
--accent-red: #EF4444;        /* Errors, low stock alerts */

/* Neutrals */
--gray-50: #F9FAFB;          /* Background */
--gray-100: #F3F4F6;         /* Card backgrounds */
--gray-200: #E5E7EB;         /* Borders */
--gray-500: #6B7280;         /* Secondary text */
--gray-900: #111827;         /* Primary text */
--white: #FFFFFF;            /* Cards, modals */
```

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- **Headings**: Font weight 600-700
  - H1: 2rem (32px)
  - H2: 1.5rem (24px)
  - H3: 1.25rem (20px)
- **Body**: Font weight 400, 1rem (16px)
- **Labels**: Font weight 500, 0.875rem (14px)
- **Small text**: 0.75rem (12px)

### Spacing Scale
Use Tailwind's default spacing: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Component Patterns
- **Cards**: White background, rounded corners (8px), subtle shadow
- **Buttons**:
  - Primary: Blue background, white text, rounded (6px), min-height 44px
  - Secondary: White background, blue border, blue text
  - Danger: Red background, white text
- **Inputs**: Border gray-200, rounded (6px), padding 12px, focus ring blue
- **Modals**: Full-screen on mobile, large centered modal on desktop
- **Bottom Sheets**: Slide up from bottom on mobile

### Touch Optimization
- **Minimum touch target**: 44x44pt (iOS guidelines)
- **Spacing between interactive elements**: Minimum 8px
- **Bottom navigation**: 64px height with safe area insets
- **Form inputs**: Large, easy to tap on mobile

---

## 🗄️ Database Schema (Supabase PostgreSQL)

### Table: `users` (extends auth.users)
```sql
id              uuid PRIMARY KEY REFERENCES auth.users(id)
store_name      text
created_at      timestamp DEFAULT now()
updated_at      timestamp DEFAULT now()
```

### Table: `customers`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES users(id) NOT NULL
full_name       text NOT NULL
whatsapp        text NOT NULL
purchase_count  integer DEFAULT 0
created_at      timestamp DEFAULT now()
updated_at      timestamp DEFAULT now()

INDEX: user_id, created_at DESC
RLS: Users can only see their own customers (user_id = auth.uid())
```

### Table: `categories`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES users(id) NOT NULL
name            text NOT NULL
created_at      timestamp DEFAULT now()
updated_at      timestamp DEFAULT now()

INDEX: user_id
RLS: Users can only see their own categories
```

### Table: `products`
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id             uuid REFERENCES users(id) NOT NULL
category_id         uuid REFERENCES categories(id) ON DELETE SET NULL
name                text NOT NULL
image_url           text
sale_price          decimal(10,2) NOT NULL
cost_price          decimal(10,2) NOT NULL
quantity            integer NOT NULL DEFAULT 0
low_stock_threshold integer DEFAULT 5
created_at          timestamp DEFAULT now()
updated_at          timestamp DEFAULT now()

INDEX: user_id, category_id
RLS: Users can only see their own products
COMPUTED: profit_margin = ((sale_price - cost_price) / sale_price) * 100
```

### Table: `sales`
```sql
id                      uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id                 uuid REFERENCES users(id) NOT NULL
customer_id             uuid REFERENCES customers(id) NOT NULL
total_amount            decimal(10,2) NOT NULL
payment_method          text NOT NULL CHECK (payment_method IN ('pix', 'cash', 'installment'))
installment_count       integer CHECK (installment_count BETWEEN 1 AND 12)
actual_amount_received  decimal(10,2)
created_at              timestamp DEFAULT now()
updated_at              timestamp DEFAULT now()

INDEX: user_id, customer_id, created_at DESC
RLS: Users can only see their own sales
COMPUTED: discount_amount = total_amount - actual_amount_received
```

### Table: `sale_items`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
sale_id     uuid REFERENCES sales(id) ON DELETE CASCADE NOT NULL
product_id  uuid REFERENCES products(id) NOT NULL
quantity    integer NOT NULL
unit_price  decimal(10,2) NOT NULL  -- snapshot at time of sale
unit_cost   decimal(10,2) NOT NULL  -- snapshot at time of sale
created_at  timestamp DEFAULT now()

INDEX: sale_id, product_id
COMPUTED: subtotal = quantity * unit_price
```

### Table: `inventory_movements`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES users(id) NOT NULL
product_id      uuid REFERENCES products(id) NOT NULL
movement_type   text NOT NULL CHECK (movement_type IN ('addition', 'sale', 'adjustment'))
quantity_change integer NOT NULL  -- positive or negative
reference_id    uuid  -- sale_id if movement_type = 'sale'
notes           text
created_at      timestamp DEFAULT now()

INDEX: user_id, product_id, created_at DESC
RLS: Users can only see their own inventory movements
```

---

## 📐 Application Architecture & File Structure

```
auralux/
├── src/
│   ├── components/
│   │   ├── common/              # Reusable UI components
│   │   │   ├── MetricCard.tsx   # Metric display card
│   │   │   ├── Button.tsx       # Button component
│   │   │   ├── Input.tsx        # Input component
│   │   │   ├── Modal.tsx        # Modal/dialog component
│   │   │   └── Loading.tsx      # Loading spinner
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx    # Main layout with nav
│   │   │   ├── TopBar.tsx       # Top bar with logo & settings
│   │   │   └── BottomNav.tsx    # Bottom navigation (3 tabs)
│   │   ├── customers/
│   │   │   ├── CustomerGallery.tsx
│   │   │   ├── CustomerCard.tsx
│   │   │   └── CustomerForm.tsx
│   │   ├── sales/
│   │   │   ├── NewSaleModal.tsx      # Multi-step sale wizard
│   │   │   ├── SelectCustomerStep.tsx
│   │   │   ├── SelectProductsStep.tsx
│   │   │   ├── PaymentMethodStep.tsx
│   │   │   ├── ConfirmSaleStep.tsx
│   │   │   ├── InstallmentAmountModal.tsx
│   │   │   ├── SalesChart.tsx
│   │   │   ├── RecentSalesList.tsx
│   │   │   └── PaymentBreakdown.tsx
│   │   └── inventory/
│   │       ├── ProductGallery.tsx
│   │       ├── ProductCard.tsx
│   │       ├── ProductForm.tsx
│   │       ├── InventoryMetrics.tsx
│   │       └── CategoryFilter.tsx
│   ├── pages/
│   │   ├── Login.tsx            # Authentication page
│   │   ├── Dashboard.tsx        # Sales dashboard (default)
│   │   ├── Customers.tsx        # Customer management
│   │   ├── Inventory.tsx        # Product/inventory management
│   │   └── Settings.tsx         # Settings & categories
│   ├── hooks/
│   │   ├── useAuth.ts           # Authentication hook
│   │   ├── useCustomers.ts      # Customer CRUD operations
│   │   ├── useProducts.ts       # Product CRUD operations
│   │   ├── useSales.ts          # Sales CRUD operations
│   │   ├── useCategories.ts     # Category CRUD operations
│   │   ├── useDashboard.ts      # Dashboard metrics
│   │   └── useSaleForm.ts       # Multi-step sale form state
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client config
│   │   ├── types.ts             # TypeScript interfaces
│   │   └── utils.ts             # Utility functions
│   ├── schemas/
│   │   ├── customerSchema.ts    # Zod validation
│   │   ├── productSchema.ts
│   │   └── saleSchema.ts
│   ├── contexts/
│   │   └── AuthContext.tsx      # Auth state provider
│   ├── styles/
│   │   └── globals.css          # Global styles
│   ├── App.tsx                  # Root component with routing
│   └── main.tsx                 # Entry point
├── public/
│   ├── manifest.json            # PWA manifest
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🧭 Navigation & Screen Structure

### Bottom Navigation (Fixed, Always Visible)
Three tabs with icons and labels:

1. **Left Tab - "Clientes"** (Customers)
   - Icon: Users/People icon (Lucide: Users)
   - Route: `/customers`
   - Active color: Primary blue

2. **Center Tab - "Vendas"** (Sales) ⭐ **DEFAULT**
   - Icon: Chart/Dashboard icon (Lucide: LineChart)
   - Route: `/` (home/dashboard)
   - Active color: Primary blue
   - **This is the default landing screen after login**

3. **Right Tab - "Estoque"** (Inventory)
   - Icon: Box/Package icon (Lucide: Package)
   - Route: `/inventory`
   - Active color: Primary blue

### Top Bar (Fixed, Consistent)
- Left: "Auralux" logo/text
- Right: Settings icon (Lucide: Settings) → navigates to `/settings`

---

## 📱 Detailed Screen Specifications

### 1. Login Screen (`/login`)

**Layout:**
- Center-aligned card on mobile
- Max-width 400px on larger screens
- Auralux logo at top (centered)
- Tagline: "Gestão de vendas simplificada"

**Form Fields:**
- Email input (type: email, autocomplete: email)
- Password input (type: password, autocomplete: current-password)
- "Entrar" button (full width, primary blue)
- Loading state during authentication
- Error message display below form

**Functionality:**
- Use Supabase Auth: `supabase.auth.signInWithPassword({ email, password })`
- On success: redirect to `/` (dashboard)
- On error: display error message
- Session persistence via Supabase

**Validation:**
- Email: required, valid email format
- Password: required, minimum 6 characters

---

### 2. Sales Dashboard (`/`) - Default Landing

**Header Section:**
- Large "+ Nova Venda" button (accent green, full width on mobile, centered)
  - Icon: Plus icon
  - Opens NewSaleModal component

**Metrics Grid (2x2 on mobile, 4 columns on desktop):**
1. **Vendas Hoje** (Daily Sales)
   - Icon: Calendar (Lucide: Calendar)
   - Value: Sum of total_amount WHERE created_at = today
   - Format: R$ 1.234,56

2. **Vendas Semana** (Weekly Sales)
   - Icon: Calendar Range (Lucide: CalendarDays)
   - Value: Sum of total_amount WHERE created_at >= last 7 days
   - Format: R$ 12.345,67

3. **Vendas Mês** (Monthly Sales)
   - Icon: Calendar Month (Lucide: CalendarRange)
   - Value: Sum of total_amount WHERE created_at >= current month
   - Format: R$ 45.678,90

4. **Receita Total** (Total Revenue)
   - Icon: Money (Lucide: DollarSign)
   - Value: Sum of total_amount (all time)
   - Format: R$ 123.456,78

**Sales Chart:**
- Line chart showing daily sales for last 30 days
- X-axis: Dates (formatted: "01 Nov", "02 Nov", etc.)
- Y-axis: Sales amount (currency formatted)
- Tooltip on hover/touch
- Responsive: full width on mobile

**Two-Column Layout (stacked on mobile):**

**Left Column - Recent Sales:**
- Title: "Vendas Recentes"
- List of last 10 sales
- Each item shows:
  - Customer name (bold)
  - Date/time (formatted: "Hoje, 14:30" or "Ontem, 10:15" or "03 Nov, 16:45")
  - Total amount (currency)
  - Payment method badge:
    - PIX: Green badge
    - Dinheiro: Blue badge
    - Parcelado: Orange badge (with installment count: "6x")
- Tap to view details (future: for now, show toast "Em breve")
- Empty state: "Nenhuma venda realizada ainda"

**Right Column - Payment Breakdown:**
- Title: "Formas de Pagamento"
- Pie chart or progress bars showing:
  - PIX: percentage and count
  - Dinheiro: percentage and count
  - Parcelado: percentage and count
- Color-coded (green, blue, orange)

**Real-time Updates:**
- Subscribe to Supabase 'sales' table changes
- When new sale inserted: invalidate queries, show toast "Nova venda registrada!"

---

### 3. Customer Management Screen (`/customers`)

**Header Section:**
- **Metric Card**: Total customers count
  - Icon: Users (Lucide: Users)
  - Large number, label "Total de Clientes"
  - Background: White card with shadow

- **"+ Novo Cliente" Button**
  - Accent green, full width on mobile
  - Opens CustomerForm modal

**Search Bar:**
- Sticky below metrics
- Placeholder: "Buscar cliente..."
- Icon: Search (Lucide: Search)
- Filters customer gallery by name or WhatsApp (client-side)

**Customer Gallery:**
- Responsive grid: 1 column on mobile, 2+ on larger screens
- Gap: 16px

**Customer Card:**
- White background, rounded corners, shadow
- Layout:
  - Top: Circle avatar with initial letter of name (colored background)
  - Name (bold, truncated if too long)
  - WhatsApp icon + number (formatted: +55 11 98888-8888)
  - Purchase count badge (bottom right): "X compras"
- Tap to edit (future: for now, no action)

**Empty State:**
- Icon: Users
- Message: "Nenhum cliente cadastrado ainda"
- "Adicione seu primeiro cliente" button

**CustomerForm Modal (Bottom Sheet on mobile):**
- Title: "Novo Cliente"
- Fields:
  1. **Nome Completo**
     - Type: text
     - Placeholder: "Ex: João Silva"
     - Validation: required, min 3 characters

  2. **WhatsApp**
     - Type: tel
     - Placeholder: "11988888888" or "+55 11 98888-8888"
     - Mask: Brazilian phone format
     - Validation: required, Brazilian WhatsApp format (regex: `^(\+?55)?(\d{2})?\s?9?\d{4}-?\d{4}$`)

- Buttons:
  - "Salvar" (primary blue, full width)
  - "Cancelar" (text button, gray)

- On submit:
  - Insert into `customers` table with `user_id = auth.uid()`
  - Initialize `purchase_count = 0`
  - Close modal
  - Show toast: "Cliente cadastrado com sucesso!"
  - Refresh customer list

---

### 4. Inventory Management Screen (`/inventory`)

**Header Section:**
- **Two Metric Cards (side by side):**

  1. **Total de Itens** (Total Inventory Quantity)
     - Icon: Package (Lucide: Package)
     - Value: Sum of all product quantities
     - Large number display

  2. **Valor Total** (Total Potential Value)
     - Icon: DollarSign (Lucide: DollarSign)
     - Value: Sum of (sale_price × quantity) for all products
     - Currency format: R$ 12.345,67

- **"+ Novo Produto" Button**
  - Accent green, full width on mobile

**Category Filter (optional, if categories exist):**
- Horizontal scrollable chips
- "Todos" chip (default, shows all products)
- One chip per category
- Active chip highlighted (blue background)
- Filters product gallery by selected category

**Product Gallery:**
- Responsive grid: 2 columns on mobile, 3-4 on larger screens
- Gap: 16px

**Product Card:**
- White background, rounded corners, shadow
- Layout:
  - **Top: Product Image** (aspect ratio 1:1, object-fit: cover)
    - If no image: placeholder icon (Package)
  - **Product Name** (bold, truncated)
  - **Category Badge** (if assigned, small chip with category name)
  - **Sale Price** (large, bold, green): R$ 99,90
  - **Cost Price** (smaller, gray): Custo: R$ 50,00
  - **Current Quantity** with icon: "10 unidades"
  - **Profit Margin Badge** (colored based on percentage):
    - Green if >30%: "Margem: 50%"
    - Yellow if 10-30%: "Margem: 20%"
    - Red if <10%: "Margem: 5%"
  - **Low Stock Indicator** (if quantity <= low_stock_threshold):
    - Red badge: "Estoque baixo"
- Tap to edit product (opens ProductForm in edit mode)

**Empty State:**
- Icon: Package
- Message: "Nenhum produto cadastrado ainda"
- "Adicione seu primeiro produto" button

**ProductForm Modal (Bottom Sheet on mobile):**
- Title: "Novo Produto" or "Editar Produto"

- Fields:
  1. **Imagem do Produto**
     - Image upload component
     - Click/tap to select image from camera/gallery
     - Show preview after selection
     - Max size: 5MB
     - Accept: image/jpeg, image/png, image/webp
     - On submit: compress image client-side, upload to Supabase Storage bucket `product-images`
     - Store returned URL in `image_url` field

  2. **Nome do Produto**
     - Type: text
     - Placeholder: "Ex: Camiseta Azul"
     - Validation: required, min 2 characters

  3. **Categoria** (optional)
     - Type: select/dropdown
     - Options: categories from database
     - Placeholder: "Selecione uma categoria"
     - Allow null (no category)

  4. **Preço de Venda**
     - Type: currency input (show R$ prefix)
     - Placeholder: "0,00"
     - Validation: required, number > 0
     - Format: Brazilian currency (comma for decimal)

  5. **Preço de Custo**
     - Type: currency input
     - Placeholder: "0,00"
     - Validation: required, number >= 0, must be <= sale_price
     - Format: Brazilian currency

  6. **Quantidade**
     - Type: number input
     - Placeholder: "0"
     - Validation: required, integer >= 0
     - Stepper buttons (+/-)

- **Real-time Profit Margin Display:**
  - Calculate: ((sale_price - cost_price) / sale_price) × 100
  - Display: "Margem de Lucro: 50%" (colored based on percentage)
  - Update as user types prices

- Buttons:
  - "Salvar" (primary blue, full width)
  - "Cancelar" (text button, gray)

- On submit:
  - If image selected: upload to Supabase Storage
  - Insert/update in `products` table
  - Close modal
  - Show toast: "Produto salvo com sucesso!"
  - Refresh product list

---

### 5. Settings Screen (`/settings`)

**Section: Categorias**
- Title: "Categorias de Produtos"
- List of existing categories:
  - Each item shows category name
  - Edit icon (tap to edit name)
  - Delete icon (tap to delete, with confirmation)
- "+ Nova Categoria" button
- Add/Edit Category Form:
  - Input: Category name
  - Validation: required, min 2 characters
  - On save: insert/update in `categories` table

**Section: Configurações** (Future)
- Low stock threshold (number input)
- Display preferences
- Notification settings
- Account settings

---

### 6. New Sale Flow (Multi-Step Modal)

Triggered by "+ Nova Venda" button on dashboard.

**Modal Presentation:**
- Full-screen on mobile
- Large centered modal on desktop (max-width 800px)
- Progress indicator at top: "Passo 1 de 4", "Passo 2 de 4", etc.

---

#### **Step 1: Select Customer**

**Header:** "Selecionar Cliente"

**Search Bar:**
- Placeholder: "Buscar cliente..."
- Filters customer list by name or WhatsApp

**Customer List:**
- Display all customers (same data as customer gallery)
- Each item shows:
  - Avatar with initial
  - Name
  - WhatsApp
  - Purchase count
- Selected customer highlighted with checkmark
- Single selection

**Quick Add Customer:**
- Link/button: "+ Adicionar Novo Cliente"
- Opens CustomerForm inline or as nested modal
- After save, auto-select new customer and return to step

**Navigation:**
- "Próximo" button (disabled until customer selected)
- Enabled state: primary blue, full width

---

#### **Step 2: Select Products**

**Header:** "Adicionar Produtos"

**Search/Filter Bar:**
- Placeholder: "Buscar produto..."
- Optional: category filter chips

**Product List:**
- Each product shows:
  - Image thumbnail
  - Name
  - Category (if assigned)
  - Sale price (large, bold)
  - Current stock quantity: "10 em estoque"
  - "+" button to add to cart

**Cart Summary (Sticky Bottom Section):**
- Title: "Produtos Selecionados"
- List of selected products:
  - Name
  - Quantity controls: [-] [5] [+]
  - Subtotal: R$ 249,50
  - "Remover" button (trash icon)
- **Running Total** (large, bold): Total: R$ 499,00
- Validation: prevent adding products with quantity > available stock

**Navigation:**
- "Voltar" button (secondary, left)
- "Próximo" button (primary, right, disabled until at least one product selected)

---

#### **Step 3: Select Payment Method**

**Header:** "Forma de Pagamento"

**Display Sale Total:**
- Large display at top: "Total: R$ 499,00"

**Payment Method Cards (3 large option cards):**

1. **PIX**
   - Icon: Green PIX icon/logo
   - Label: "PIX"
   - Description: "Pagamento instantâneo"
   - Radio button or highlighted border when selected

2. **Dinheiro** (Cash)
   - Icon: Blue money/cash icon
   - Label: "Dinheiro"
   - Description: "Pagamento em espécie"
   - Radio button or highlighted border when selected

3. **Parcelado** (Installment)
   - Icon: Orange credit card icon
   - Label: "Parcelado"
   - Description: "Cartão de crédito"
   - Radio button or highlighted border when selected
   - **When selected, immediately show installment selector below:**
     - Dropdown or segmented control: 1x, 2x, 3x, ..., 12x
     - Update total display to show installment amount: "12x de R$ 41,58"

**Navigation:**
- "Voltar" button (secondary, left)
- "Próximo" button (primary, right, disabled until payment method selected)

**Special Flow for Installment:**
- When "Próximo" is clicked AND payment_method = 'installment':
  - Open InstallmentAmountModal BEFORE proceeding to Step 4

---

#### **Installment Amount Modal (Nested Modal/Dialog)**

Triggered automatically after clicking "Próximo" in Step 3 if payment method is installment.

**Header:** "Valor Recebido Após Taxas"

**Content:**
- Display original total (read-only, large):
  - "Valor Total da Venda: R$ 499,00"
  - "Parcelamento: 6x de R$ 83,17"

- **Input: Valor Recebido** (currency input)
  - Label: "Quanto você recebeu após as taxas?"
  - Placeholder: "R$ 0,00"
  - Validation: required, must be > 0 and <= total_amount
  - Focus this input on modal open

- **Calculated Display (real-time):**
  - Discount Amount: R$ 499,00 - [actualReceived] = R$ 50,00
  - Discount Percentage: ([discount] / [total]) × 100 = 10,0%
  - Color: red if discount > 0

**Buttons:**
- "Confirmar" (primary blue, disabled if actualReceived invalid)
- "Cancelar" (go back to Step 3)

**On Confirm:**
- Store actualReceived and discount in sale form state
- Close this modal
- Proceed to Step 4

---

#### **Step 4: Confirm Sale**

**Header:** "Confirmar Venda"

**Sale Summary Display:**

1. **Customer Section:**
   - Icon: User
   - Customer name (bold)
   - WhatsApp number

2. **Products Section:**
   - List of all selected products:
     - Product name
     - Quantity × Unit price
     - Subtotal
   - **Total Amount** (large, bold): R$ 499,00

3. **Payment Section:**
   - Payment method badge (colored)
   - If PIX or Cash: just display method
   - If Installment:
     - Display: "Parcelado em 6x"
     - Original total: R$ 499,00
     - Actual received: R$ 449,00 (green if > 0, else same as total)
     - Discount: R$ 50,00 (10,0%) (red if > 0)

**Navigation:**
- "Voltar" button (secondary, left, allows editing)
- **"Confirmar Venda" button** (large, accent green, full width)
  - Loading state during submission

**On Confirm (Sale Submission):**

This is a **critical atomic transaction**. All steps must succeed or rollback:

1. **Insert Sale:**
   ```ts
   const { data: sale } = await supabase
     .from('sales')
     .insert({
       user_id: userId,
       customer_id: selectedCustomer.id,
       total_amount: total,
       payment_method: paymentMethod, // 'pix', 'cash', or 'installment'
       installment_count: installmentCount, // only if installment
       actual_amount_received: actualAmountReceived, // only if installment
     })
     .select()
     .single();
   ```

2. **Insert Sale Items (batch):**
   ```ts
   const saleItems = selectedProducts.map(({ product, quantity }) => ({
     sale_id: sale.id,
     product_id: product.id,
     quantity,
     unit_price: product.sale_price, // snapshot
     unit_cost: product.cost_price, // snapshot
   }));

   await supabase.from('sale_items').insert(saleItems);
   ```

3. **Update Product Quantities (decrement):**
   ```ts
   for (const { product, quantity } of selectedProducts) {
     await supabase
       .from('products')
       .update({ quantity: product.quantity - quantity })
       .eq('id', product.id);
   }
   ```

4. **Insert Inventory Movements:**
   ```ts
   const movements = selectedProducts.map(({ product, quantity }) => ({
     user_id: userId,
     product_id: product.id,
     movement_type: 'sale',
     quantity_change: -quantity, // negative for sale
     reference_id: sale.id,
   }));

   await supabase.from('inventory_movements').insert(movements);
   ```

5. **Increment Customer Purchase Count:**
   ```ts
   await supabase
     .from('customers')
     .update({ purchase_count: selectedCustomer.purchase_count + 1 })
     .eq('id', selectedCustomer.id);
   ```

**On Success:**
- Close NewSaleModal
- Show success toast with celebration: "🎉 Venda registrada com sucesso!"
- Invalidate React Query caches:
  - Dashboard metrics
  - Recent sales
  - Product list (for updated quantities)
  - Customer list (for updated purchase count)
- Reset sale form state
- Stay on dashboard (already there)

**On Error:**
- Show error toast: "Erro ao registrar venda. Tente novamente."
- Keep modal open
- Allow retry

---

## 🔐 Authentication & Security

### Supabase Auth Setup

**Environment Variables (.env):**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Supabase Client (`src/lib/supabase.ts`):**
```ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

**Auth Context (`src/contexts/AuthContext.tsx`):**
```tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Protected Routes (`src/App.tsx`):**
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import Inventory from '@/pages/Inventory';
import Settings from '@/pages/Settings';
import AppLayout from '@/components/layout/AppLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### Row Level Security (RLS) Policies

**CRITICAL:** All tables MUST have RLS enabled and policies defined. Users can ONLY access their own data.

**Example RLS Policy for `customers` table:**
```sql
-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own customers
CREATE POLICY "Users can view own customers"
  ON customers
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own customers
CREATE POLICY "Users can insert own customers"
  ON customers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own customers
CREATE POLICY "Users can update own customers"
  ON customers
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own customers
CREATE POLICY "Users can delete own customers"
  ON customers
  FOR DELETE
  USING (auth.uid() = user_id);
```

**Repeat similar policies for all tables:** `categories`, `products`, `sales`, `inventory_movements`.

---

## 📊 Data Fetching with React Query

### Setup (`src/main.tsx`)

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
```

### Example Hook: `useCustomers`

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Customer } from '@/lib/types';

export function useCustomers() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch customers
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Customer[];
    },
    enabled: !!user,
  });

  // Add customer mutation
  const addCustomer = useMutation({
    mutationFn: async (newCustomer: Omit<Customer, 'id' | 'user_id' | 'purchase_count' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert({ ...newCustomer, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', user?.id] });
    },
  });

  return {
    customers: customers ?? [],
    isLoading,
    error,
    addCustomer: addCustomer.mutate,
    isAdding: addCustomer.isPending,
  };
}
```

### Real-time Subscriptions Example

```tsx
useEffect(() => {
  if (!user) return;

  const channel = supabase
    .channel('sales-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'sales',
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        // Invalidate dashboard queries
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
        toast.success('Nova venda registrada!');
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user, queryClient]);
```

---

## 🎨 Component Examples

### MetricCard Component

```tsx
interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export function MetricCard({ label, value, icon, color = 'blue' }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}
```

### Currency Formatting Utility

```tsx
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
```

### Profit Margin Calculation

```tsx
export function calculateProfitMargin(salePrice: number, costPrice: number): number {
  if (salePrice === 0) return 0;
  return ((salePrice - costPrice) / salePrice) * 100;
}

export function getProfitMarginColor(margin: number): string {
  if (margin > 30) return 'text-green-600 bg-green-50';
  if (margin >= 10) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
}
```

---

## 📱 PWA Configuration

### Vite PWA Plugin (`vite.config.ts`)

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Auralux - Gestão de Vendas',
        short_name: 'Auralux',
        description: 'Sistema de gestão de vendas e estoque para lojas',
        theme_color: '#3B82F6',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
        ],
      },
    }),
  ],
});
```

### iOS Safari Meta Tags (`index.html`)

```html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#3B82F6" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="Auralux" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</head>
```

---

## ✅ Critical Implementation Checklist

### Phase 1: Foundation
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install and configure TailwindCSS
- [ ] Set up Supabase client and environment variables
- [ ] Create folder structure as specified
- [ ] Configure ESLint and Prettier
- [ ] Create AuthContext and useAuth hook
- [ ] Implement protected routes
- [ ] Create Login page with Supabase Auth integration

### Phase 2: Layout & Navigation
- [ ] Create AppLayout component
- [ ] Implement TopBar with logo and settings icon
- [ ] Implement BottomNav with 3 tabs (Customers, Sales, Inventory)
- [ ] Configure React Router with all routes
- [ ] Ensure Sales (Dashboard) is default route
- [ ] Test navigation on iOS Safari (touch targets, safe areas)

### Phase 3: Customer Management
- [ ] Create Customer types and Zod schema
- [ ] Implement useCustomers hook with React Query
- [ ] Create CustomerGallery and CustomerCard components
- [ ] Create CustomerForm modal with WhatsApp validation
- [ ] Implement search/filter functionality
- [ ] Test RLS policies for customers table

### Phase 4: Inventory Management
- [ ] Create Product and Category types and schemas
- [ ] Implement useProducts and useCategories hooks
- [ ] Set up Supabase Storage bucket for product images
- [ ] Create ProductForm with image upload and compression
- [ ] Implement profit margin calculation (real-time)
- [ ] Create ProductGallery and ProductCard components
- [ ] Implement category filter
- [ ] Test image upload and RLS policies

### Phase 5: Sales Dashboard
- [ ] Create dashboard metrics hooks (daily, weekly, monthly, total)
- [ ] Implement MetricCard component with metric grid
- [ ] Create SalesChart component with Recharts
- [ ] Implement RecentSalesList component
- [ ] Create PaymentBreakdown component
- [ ] Set up Supabase real-time subscriptions for sales
- [ ] Test dashboard performance with large datasets

### Phase 6: New Sale Flow
- [ ] Create useSaleForm hook for multi-step state
- [ ] Implement NewSaleModal with progress indicator
- [ ] Create Step 1: SelectCustomerStep
- [ ] Create Step 2: SelectProductsStep with cart
- [ ] Create Step 3: PaymentMethodStep with installment selector
- [ ] Create InstallmentAmountModal (nested)
- [ ] Create Step 4: ConfirmSaleStep with summary
- [ ] Implement atomic sale transaction (all 5 database operations)
- [ ] Add error handling and retry logic
- [ ] Test complete sale flow end-to-end

### Phase 7: Settings & Categories
- [ ] Create Settings page
- [ ] Implement category CRUD operations
- [ ] Add category management UI
- [ ] Test category assignment in product form

### Phase 8: PWA & Mobile Optimization
- [ ] Configure Vite PWA plugin
- [ ] Create PWA manifest with icons
- [ ] Test PWA installation on iOS Safari
- [ ] Implement offline caching strategy
- [ ] Add online/offline status indicator
- [ ] Test all touch interactions (44x44pt targets)
- [ ] Verify safe area insets on iOS

### Phase 9: Testing & Quality
- [ ] Write unit tests for utility functions
- [ ] Write component tests for key UI components
- [ ] Write E2E tests for critical flows
- [ ] Test RLS policies thoroughly
- [ ] Performance testing (bundle size, load time)
- [ ] Accessibility audit (contrast, keyboard navigation)
- [ ] Cross-browser testing (Safari iOS, Chrome iOS)

### Phase 10: Deployment
- [ ] Set up production Supabase project
- [ ] Configure environment variables for production
- [ ] Deploy to Vercel/Netlify
- [ ] Set up custom domain and SSL
- [ ] Configure error monitoring (Sentry)
- [ ] Set up analytics (privacy-focused)
- [ ] Create user documentation

---

## ⚠️ Critical Constraints & Requirements

### MUST DO:
1. **Mobile-First Design**: Design and test on mobile (iPhone) FIRST, then adapt for larger screens
2. **Touch Optimization**: ALL interactive elements MUST be minimum 44x44pt
3. **RLS Policies**: EVERY table MUST have RLS enabled with proper user_id filtering
4. **Atomic Transactions**: Sale creation MUST be atomic (all steps succeed or rollback)
5. **Real-time Updates**: Dashboard metrics MUST update in real-time via Supabase subscriptions
6. **Image Compression**: Product images MUST be compressed client-side before upload
7. **Currency Formatting**: ALL currency values MUST use Brazilian Real (BRL) format
8. **WhatsApp Validation**: MUST validate Brazilian WhatsApp format
9. **Profit Margin**: MUST calculate and display profit margin for all products
10. **Installment Handling**: MUST capture actual amount received for installment sales
11. **PWA Standards**: MUST be installable on iOS and meet PWA criteria
12. **TypeScript Strict Mode**: NO implicit any, all types must be defined

### MUST NOT DO:
1. **DO NOT** use class components (only functional components with hooks)
2. **DO NOT** skip RLS policies (security critical)
3. **DO NOT** allow sale completion if product stock is insufficient
4. **DO NOT** use unvalidated user input in database queries
5. **DO NOT** store sensitive data in localStorage (use Supabase session)
6. **DO NOT** create non-atomic transactions for sales
7. **DO NOT** forget to handle loading and error states
8. **DO NOT** ignore iOS safe area insets
9. **DO NOT** use hover states for mobile (use touch/focus)
10. **DO NOT** exceed 2-second initial load time (performance budget)

---

## 🚀 Getting Started Instructions

### Step 1: Initialize Project
```bash
npm create vite@latest auralux -- --template react-ts
cd auralux
npm install
```

### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js
npm install @tanstack/react-query
npm install react-router-dom
npm install react-hook-form @hookform/resolvers zod
npm install recharts
npm install lucide-react
npm install sonner
npm install tailwindcss postcss autoprefixer
npm install -D @types/node
npm install vite-plugin-pwa -D
npm install browser-image-compression
npm install date-fns
```

### Step 3: Configure Tailwind
```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        accent: '#10B981',
      },
    },
  },
  plugins: [],
};
```

### Step 4: Set Up Supabase
1. Create Supabase project at https://supabase.com
2. Create `.env` file in project root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
3. Create database tables via Supabase SQL Editor
4. Enable RLS on all tables
5. Create RLS policies

### Step 5: Create File Structure
Follow the folder structure defined earlier in this document.

### Step 6: Start Development
```bash
npm run dev
```

---

## 📖 Final Notes

**This is a comprehensive prompt designed to generate a complete, production-ready PWA.** However, remember:

✅ **All AI-generated code requires:**
- Careful human review
- Testing on real iOS devices
- Security audit (especially RLS policies)
- Performance optimization
- Accessibility improvements
- Error handling refinement

✅ **Iterative Approach:**
- Build and test one feature at a time
- Start with authentication and layout
- Then add customer management
- Then inventory management
- Then dashboard
- Finally, the sale flow
- Test thoroughly at each step

✅ **User Experience:**
- Test on REAL iOS devices, not just simulators
- Get feedback from actual store owners
- Iterate based on real-world usage
- Monitor performance metrics

✅ **Security:**
- Audit RLS policies thoroughly
- Test with multiple user accounts
- Ensure data isolation between users
- Never trust client-side validation alone

---

**Document Version**: v1.0
**Created**: 2025-11-06
**Author**: Sally (UX Expert Agent)
**Status**: Ready for AI Frontend Generation

---

## 🎯 Quick Start for AI Tools

### For v0.dev:
Copy sections as needed, starting with "Project Setup & Core Layout" then iterating through each screen.

### For Lovable.ai:
Paste this entire prompt or specific sections based on the feature you're building.

### For Bolt.new:
Use section-by-section approach, starting with foundation, then adding features incrementally.

**Good luck building Auralux! 🚀**
