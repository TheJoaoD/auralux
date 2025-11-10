# Auralux Codebase Architecture & Structure - Comprehensive Exploration

**Generated:** November 9, 2025  
**Project:** Auralux - Luxury Store Management System  
**Status:** Active Development  
**Files Analyzed:** 175 TypeScript/TSX files

---

## 1. PROJECT OVERVIEW

### What is Auralux?
Auralux is a comprehensive **luxury perfume store management system** built with Next.js, featuring:
- Admin dashboard for inventory management
- Sales tracking and analytics
- Customer relationship management (CRM)
- Real-time sales dashboards
- Discount management system
- User management for stores
- **NEW:** Public-facing product catalog (in design phase)

### Tech Stack
- **Framework:** Next.js 16.0.0 (React 19.2.0)
- **Database:** Supabase (PostgreSQL + Real-time)
- **Authentication:** Supabase Auth (admin) + Custom JWT (future catalog)
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** Zustand + React Query
- **Styling:** Tailwind CSS v4
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Charts:** Recharts
- **PWA:** next-pwa

---

## 2. OVERALL PROJECT STRUCTURE

```
/Users/joaod.nascimento/Downloads/code/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes (users management)
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Dashboard page
│   ├── inventory/                # Inventory management pages
│   ├── sales/                    # Sales management pages
│   ├── customers/                # Customer management
│   ├── settings/                 # Settings & configuration
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Home page
│
├── components/                   # React components
│   ├── dashboard/                # Dashboard components
│   ├── products/                 # Product management components
│   ├── sales/                    # Sales wizard & components
│   ├── customers/                # Customer components
│   ├── discounts/                # Discount management components
│   ├── inventory/                # Inventory components
│   ├── categories/               # Category management
│   ├── layout/                   # Layout components
│   ├── ui/                       # Shadcn/ui components
│   ├── reports/                  # Report components
│   └── screens/                  # Screen components
│
├── lib/                          # Utility & business logic
│   ├── services/                 # Service layer (API clients)
│   │   ├── productService.ts
│   │   ├── categoryService.ts
│   │   ├── customerService.ts
│   │   ├── salesService.ts
│   │   ├── discountService.ts
│   │   ├── inventoryService.ts
│   │   └── userService.ts
│   ├── supabase/                 # Supabase client setup
│   ├── contexts/                 # React contexts (Auth, Query)
│   ├── hooks/                    # Custom React hooks
│   ├── stores/                   # Zustand stores
│   ├── validations/              # Zod schemas
│   ├── constants/                # App constants
│   └── utils/                    # Helper utilities
│
├── types/                        # TypeScript type definitions
│   ├── index.ts                  # Main types
│   └── supabase.ts               # Database types (auto-generated)
│
├── docs/                         # Documentation
│   ├── architecture/             # Architecture documentation
│   ├── prd/                      # Product requirements (catalog)
│   ├── catalogo-architecture.md  # Catalog architecture design
│   └── README.md
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── middleware.ts                 # Next.js middleware
```

---

## 3. PAGES & ROUTES ORGANIZATION

### App Router Structure (Next.js 13+ Pages)

#### Admin Routes (Authenticated)
```
/dashboard                 → Dashboard with KPIs, charts, recent sales
/inventory                 → Product inventory management (paginated)
/inventory/history        → Inventory movement history
/sales                     → Sales list with pagination & details
/customers                 → Customer management
/settings                  → Settings hub
/settings/discounts       → Discount management
/settings/users           → User management
```

#### Authentication
```
/login                     → Login page
/auth                      → Auth-related pages
```

#### Public
```
/                          → Home/landing page
```

---

## 4. COMPONENTS ORGANIZATION

### Products Components (`/components/products/`)
- **AddProductModal.tsx** - Form modal for creating new products
- **EditProductModal.tsx** - Form modal for editing products
- **ImageUpload.tsx** - Image upload component with validation
- **InventoryMetrics.tsx** - Display inventory statistics
- **ProductCard.tsx** - Individual product display card
- **ProductGallery.tsx** - Grid/gallery view of products

### Sales Components (`/components/sales/`)
- **NewSaleWizard.tsx** - Multi-step sales creation flow
- **CustomerSelectionStep.tsx** - Customer selection in wizard
- **ProductSelectionStep.tsx** - Product selection in wizard
- **PaymentMethodStep.tsx** - Payment method selection (PIX, cash, installment)
- **QuantitySelector.tsx** - Product quantity selection
- **ShoppingCart.tsx** - Cart display during sales
- **SaleSummary.tsx** - Summary before finalizing sale
- **InstallmentSelector.tsx** - Installment configuration
- **ActualAmountModal.tsx** - Modal for actual payment amount

### Dashboard Components (`/components/dashboard/`)
- **MetricsCards.tsx** - KPI cards (total sales, revenue, etc.)
- **SalesChart.tsx** - Recharts visualization of sales trends
- **RecentSalesList.tsx** - Recent transactions list
- **PaymentBreakdown.tsx** - Payment method breakdown (PIX, cash, installment)
- **DateRangeFilter.tsx** - Date filter for reports
- **MetricCard.tsx** - Individual metric display

### Layout Components (`/components/layout/`)
- **MainLayout.tsx** - Main application layout wrapper
- Navigation, sidebar, and structural components

### UI Components (`/components/ui/`)
- Shadcn/ui components: Dialog, Card, Button, Badge, Form, etc.
- **SimplePagination.tsx** - Custom pagination component

---

## 5. SERVICES & API LAYER (`/lib/services/`)

All services use **Supabase client** and handle **authentication checks**, **error handling**, and **pagination**.

### ProductService.ts
**Purpose:** Product CRUD operations and inventory management

**Key Functions:**
- `createProduct(input)` - Create product with image upload
- `getProducts(params)` - Get paginated products
- `getAllProducts()` - Get all products (for selectors)
- `getProductById(id)` - Get single product
- `updateProduct(id, input)` - Update product details
- `deleteProduct(id)` - Delete product and its image
- `uploadProductImage(file, productId)` - Upload to Supabase Storage
- `deleteProductImage(imageUrl)` - Delete image from storage
- `calculateProfitMargin(salePrice, costPrice)` - Margin calculation

**Pagination:**
```typescript
interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
```

### CategoryService.ts
**Purpose:** Category management and product counting

**Key Functions:**
- `getCategories()` - All categories
- `getCategoryById(id)` - Single category
- `createCategory(name, color, description)` - Create category
- `updateCategory(id, ...)` - Update category
- `deleteCategory(id)` - Delete category
- `getCategoryProductCount(categoryId)` - Count products
- `getCategoriesWithCount(params)` - Paginated categories with product counts

### SalesService.ts
**Purpose:** Sales transactions, analytics, and reporting

**Key Functions:**
- `createSale(input)` - Create new sale with items
- `getSales(filters?)` - Get sales with optional filters
- `getPaginatedSales(params)` - Paginated sales list
- `getSaleById(id)` - Single sale details
- `deleteSale(id)` - Delete sale and restore inventory
- `getSalesMetrics(dateRange)` - KPI metrics
- `getRecentSales(limit)` - Recent sales
- `getPaymentMethodBreakdown(dateRange)` - Payment method stats
- `getSalesChartData(dateRange)` - Chart data for trends

**Metrics Returned:**
```typescript
interface SalesMetrics {
  totalSales: number
  totalRevenue: number
  actualRevenue: number
  totalDiscount: number
  avgSaleValue: number
  dailySales: number
  weeklySales: number
  monthlySales: number
}
```

### CustomerService.ts
**Purpose:** Customer management and lookup

**Key Functions:**
- `createCustomer(input)` - Create customer
- `getCustomers(params)` - Paginated customers
- `getCustomerById(id)` - Single customer
- `updateCustomer(id, input)` - Update customer
- `deleteCustomer(id)` - Delete customer

### DiscountService.ts
**Purpose:** Discount management

**Key Functions:**
- `getDiscounts()` - All discounts
- `getActiveDiscounts()` - Active only
- `getDiscountsWithPagination(params)` - Paginated
- `createDiscount(input)` - Create discount
- `updateDiscount(id, input)` - Update discount
- `deleteDiscount(id)` - Delete discount
- `calculateDiscountAmount(type, value, amount)` - Calculate discount

**Discount Types:**
- `percentage` - Percentage-based discount
- `fixed` - Fixed amount discount

### InventoryService.ts
**Purpose:** Inventory tracking and history

**Key Functions:**
- `getInventoryHistory(productId)` - Movement history
- `getLowStockItems()` - Low stock alerts

### UserService.ts
**Purpose:** User management for store administrators

**Key Functions:**
- User CRUD operations
- Role management

---

## 6. DATA MODELS & TYPES (`/types/`)

### From `types/index.ts`:

```typescript
// Customer
export type Customer = Database['public']['Tables']['customers']['Row']
export interface CustomerInput {
  full_name: string
  whatsapp: string
  email?: string
  address?: string
}

// Product
export type Product = Database['public']['Tables']['products']['Row'] & {
  category?: Category | null
  profit_margin?: number        // Computed
  profit_amount?: number        // Computed
  is_low_stock?: boolean        // Computed
}
export interface ProductInput {
  name: string
  category_id?: string
  sku?: string
  image?: File
  sale_price: number
  cost_price: number
  quantity: number
  low_stock_threshold?: number
  supplier?: string
}

// Sale
export type Sale = Database['public']['Tables']['sales']['Row']
export type SaleItem = Database['public']['Tables']['sale_items']['Row']

// Category
export type Category = Database['public']['Tables']['categories']['Row']

// Discount
export type Discount = Database['public']['Tables']['discounts']['Row']
export interface DiscountInput {
  name: string
  description?: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  minimum_purchase?: number
  is_active?: boolean
}

// User
export type User = Database['public']['Tables']['users']['Row']
```

---

## 7. VALIDATION SCHEMAS (Zod)

### ProductSchemas (`/lib/validations/productSchemas.ts`)
```typescript
export const productSchema = z.object({
  name: z.string().min(3).max(100),
  category_id: z.string().uuid(),
  sku: z.string().max(50).optional(),
  sale_price: z.number().positive(),
  cost_price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative(),
  low_stock_threshold: z.number().int().positive().default(5),
  supplier: z.string().max(100).optional(),
  image: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024)
    .refine(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    .optional(),
})
  .refine(data => data.sale_price >= data.cost_price, {
    message: 'Preço de venda deve ser maior ou igual ao preço de custo',
    path: ['sale_price'],
  })
```

**Other Schema Files:**
- `authSchemas.ts` - Login/auth validation
- `categorySchemas.ts` - Category validation
- `customerSchemas.ts` - Customer validation
- `saleSchemas.ts` - Sale transaction validation

---

## 8. STATE MANAGEMENT

### React Query (Server State)
- **Query Keys:** `['products']`, `['categories']`, `['sales-metrics']`, etc.
- **Stale Time:** 30-60 seconds
- **Refetch Interval:** 60 seconds (for real-time dashboards)
- **Used in:** Dashboard, inventory, sales pages

### Zustand (Client State)
**File:** `/lib/stores/saleWizardStore.ts`
- Stores sales wizard state during multi-step form
- Persists cart items and customer selection

### React Context
**AuthContext** (`/lib/contexts/AuthContext.tsx`)
- Provides user and session to entire app
- Handles sign-out

**QueryProvider** (`/lib/contexts/QueryProvider.tsx`)
- Wraps React Query client provider

---

## 9. CURRENT CATALOG/PRODUCT FEATURES

### Inventory Management Page (`/app/inventory/page.tsx`)
**Features:**
- Paginated product list (5 items per page)
- Product gallery with cards
- Add product modal
- Edit product modal
- Inventory metrics (low stock count, total items, etc.)
- Product search/filtering
- Image upload with validation

**Computed Fields on Products:**
- `profit_margin` - (sale_price - cost_price) / sale_price * 100
- `profit_amount` - sale_price - cost_price
- `is_low_stock` - quantity <= low_stock_threshold

### Product Components
1. **ProductCard** - Shows product image, name, prices, quantity
2. **ProductGallery** - Grid layout with multiple cards
3. **ImageUpload** - Drag-drop or click-to-upload images
4. **AddProductModal** - Form for new products with:
   - Name, SKU, category selection
   - Cost and sale prices
   - Initial quantity
   - Low stock threshold
   - Supplier info
   - Image upload
   - Profit margin visualization

5. **EditProductModal** - Similar to add but for updates

### Storage
- **Images:** Supabase Storage bucket `products`
- **Organization:** `user_id/product_id_timestamp.ext`
- **Max Size:** 5MB
- **Formats:** JPG, PNG, WEBP
- **Public URLs:** Cached for 3600 seconds

---

## 10. SALES FEATURES & WORKFLOW

### Sales Wizard (`/components/sales/NewSaleWizard.tsx`)
**Multi-Step Flow:**

1. **Customer Selection** - Existing customer or create new
2. **Product Selection** - Select products from inventory
3. **Quantity Selection** - Set quantity for each product
4. **Shopping Cart** - Review items before checkout
5. **Discount Application** - Apply discount codes
6. **Payment Method Selection** - PIX, Cash, or Installment
7. **Sale Summary** - Final review and confirmation

**Features:**
- Real-time inventory validation
- Automatic cart subtotals
- Discount calculation (percentage or fixed)
- Payment method breakdown
- Installment configuration
- Sale confirmation and receipt

### Sales Management (`/app/sales/page.tsx`)
- Paginated sales list (6 per page)
- Sale details modal with:
  - Customer info
  - Item list with prices
  - Total amount and discounts
  - Payment method
  - Date/time
- Delete sale (with inventory restoration)
- Payment method display (PIX, Dinheiro, Parcelado)

### Dashboard (`/app/dashboard/page.tsx`)
**Real-time Features:**
- WebSocket subscription to sales table changes
- Automatic invalidation of React Query caches
- Real-time metric updates

**Displayed Metrics:**
- Total sales count
- Total revenue and actual revenue (after discounts)
- Average sale value
- Daily, weekly, monthly totals
- Payment method breakdown (PIX %, cash %, installment %)

**Charts:**
- Sales trend over time (Recharts)
- Revenue trend
- Interactive date range filter

---

## 11. DISCOUNT MANAGEMENT

### Features
- Create percentage or fixed amount discounts
- Set minimum purchase requirements
- Activate/deactivate discounts
- View all discounts with pagination
- Edit discount details
- Delete discounts

### Database Fields
```sql
discounts (
  id UUID PRIMARY KEY,
  name VARCHAR,
  description TEXT,
  discount_type ENUM('percentage', 'fixed'),
  discount_value NUMERIC,
  minimum_purchase NUMERIC,
  is_active BOOLEAN,
  user_id UUID FK,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

## 12. AUTHENTICATION & SECURITY

### Admin Authentication
- **Method:** Supabase Auth (Email + Password)
- **Session:** JWT in memory + refresh tokens
- **Context:** AuthProvider wraps app

### Future Catalog Authentication
- **Method:** Custom JWT + WhatsApp
- **Storage:** HTTP-only cookies
- **Duration:** 30-day sessions
- **RLS Policy:** Catalog users cannot access admin data

### Current RLS (Row Level Security)
- Tables filtered by `user_id`
- All queries enforce user isolation
- No cross-user data leakage

---

## 13. UPCOMING CATALOG FEATURE (In Design Phase)

**Reference Document:** `docs/catalogo-architecture.md`

### Public Catalog Plans
- **Route:** `/catalogo/*` (parallel to admin)
- **Auth:** WhatsApp-based (no passwords)
- **Features:**
  - Browse products by category
  - Favorites (Zustand)
  - Shopping cart
  - Product requests (new orders from public)
  - Order tracking
  - Real-time notifications via WhatsApp

### Database Tables (Planned)
- `catalog_users` - Public catalog users
- `catalog_cart` - Shopping carts
- `catalog_favorites` - User favorites
- `catalog_orders` - Public orders
- `catalog_requests` - Product requests
- Shared: `products`, `categories` (with RLS)

---

## 14. KEY UTILITIES & HELPERS

### Formatters (`/lib/utils/formatters.ts`)
- `formatCurrency()` - Format numbers as currency
- `getDateRange()` - Calculate date ranges (today, week, 30 days, month)

### Supabase Setup
- **Client:** `createClient()` - Browser client for client components
- **Server:** `createServerClient()` - Server-side operations
- **Middleware:** Auth state management between requests

### Hooks (`/lib/hooks/`)
- `useAuth()` - Access auth context

---

## 15. STYLING & THEMING

### Tailwind CSS v4
- **Color Scheme:** Luxury theme (dusty rose, cream, dark)
  - Primary: `#C49A9A` (dusty rose)
  - Background: `#202020` (dark)
  - Accent: `#E0DCD1` (cream)

### Dark Mode
- Default dark theme
- next-themes integration

### Responsive Design
- Mobile-first approach
- Flex layouts for adaptability
- Touch-friendly button sizes (min-h-[44px])

---

## 16. FOLDER STRUCTURE SUMMARY

### Key Directories by Responsibility

**Features/Domains:**
- `/app/inventory/` → Product management
- `/app/sales/` → Sales transactions
- `/app/dashboard/` → Analytics & overview
- `/app/customers/` → Customer CRM
- `/app/settings/` → Configuration

**Business Logic:**
- `/lib/services/` → Data access & API layer
- `/lib/validations/` → Data validation schemas
- `/lib/stores/` → State management

**Presentation:**
- `/components/` → UI components by feature
- `/components/ui/` → Reusable UI atoms

**Infrastructure:**
- `/lib/supabase/` → Database client setup
- `/lib/contexts/` → React contexts
- `/types/` → TypeScript definitions

---

## 17. CURRENT IMPLEMENTATION CHECKLIST

### Completed Features
- ✅ Product CRUD (Create, Read, Update, Delete)
- ✅ Category management
- ✅ Inventory tracking with pagination
- ✅ Product images with Supabase Storage
- ✅ Sales creation with multi-step wizard
- ✅ Sales list and details
- ✅ Customer management
- ✅ Discount system (percentage and fixed)
- ✅ Dashboard with real-time metrics
- ✅ Sales charts and analytics
- ✅ Payment method tracking
- ✅ User management for store staff
- ✅ Authentication (admin)
- ✅ Real-time updates via Supabase Realtime

### In Progress / Design Phase
- 🔄 Public catalog feature (WhatsApp auth)
- 🔄 Catalog UI components
- 🔄 Product requests system
- 🔄 Favorites system

---

## 18. NOTABLE PATTERNS & PRACTICES

### Error Handling
- Try-catch blocks in services
- User-friendly error messages (Portuguese)
- Toast notifications for feedback
- Specific Supabase error code handling

### Data Fetching
- React Query for caching and synchronization
- Service layer abstracts Supabase calls
- Pagination standardized across services
- Stale-time and refetch intervals optimized

### Component Patterns
- Controlled forms with React Hook Form
- Modal dialogs for CRUD operations
- Gallery/card layouts for collections
- Pagination for large datasets

### State Isolation
- Admin and future catalog users completely isolated
- RLS prevents accidental data leakage
- Zustand for transient client state
- React Query for server state

---

## 19. FILE STATISTICS

- **Total TypeScript/TSX Files:** 175
- **API Routes:** 3 (users management)
- **Page Routes:** 8 (dashboard, inventory, sales, etc.)
- **Component Files:** ~60
- **Service Files:** 7
- **Validation Schemas:** 5
- **Type Definition Files:** 2

---

## 20. DEPLOYMENT & INFRASTRUCTURE

### Supabase
- PostgreSQL database
- Row Level Security (RLS) for multi-tenancy
- Realtime WebSocket subscriptions
- Storage for product images
- Auth for admin users

### Next.js Deployment
- Vercel Analytics enabled
- PWA manifest configured
- Image optimization with Sharp
- Environment variables for Supabase URLs/keys

### Environment
- `.env.local` contains:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 21. RECOMMENDATIONS FOR FUTURE DEVELOPMENT

1. **Catalog Implementation**
   - Use architecture in `catalogo-architecture.md`
   - Implement WhatsApp authentication
   - Create catalog-specific service layer
   - Add favorites and cart stores

2. **Performance Optimization**
   - ISR for product pages
   - Image optimization for catalog
   - Aggressive caching strategies
   - Reduce query payload sizes

3. **Testing**
   - Unit tests for services
   - Integration tests for workflows
   - E2E tests for critical flows

4. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - User analytics

5. **Documentation**
   - API endpoint documentation
   - Component storybook
   - Database schema documentation

---

**End of Codebase Exploration Report**
