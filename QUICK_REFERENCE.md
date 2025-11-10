# Auralux - Quick Reference Guide

## Key Absolute File Paths

### Core Application Files
- `/Users/joaod.nascimento/Downloads/code/app/layout.tsx` - Root layout with providers
- `/Users/joaod.nascimento/Downloads/code/app/dashboard/page.tsx` - Main dashboard
- `/Users/joaod.nascimento/Downloads/code/app/inventory/page.tsx` - Product inventory
- `/Users/joaod.nascimento/Downloads/code/app/sales/page.tsx` - Sales list
- `/Users/joaod.nascimento/Downloads/code/types/index.ts` - Main type definitions

### Service Layer (Business Logic)
- `/Users/joaod.nascimento/Downloads/code/lib/services/productService.ts` - Product CRUD & image handling
- `/Users/joaod.nascimento/Downloads/code/lib/services/categoryService.ts` - Category management
- `/Users/joaod.nascimento/Downloads/code/lib/services/salesService.ts` - Sales & analytics
- `/Users/joaod.nascimento/Downloads/code/lib/services/discountService.ts` - Discount management
- `/Users/joaod.nascimento/Downloads/code/lib/services/customerService.ts` - Customer management
- `/Users/joaod.nascimento/Downloads/code/lib/services/inventoryService.ts` - Inventory tracking
- `/Users/joaod.nascimento/Downloads/code/lib/services/userService.ts` - User management

### Components - Products
- `/Users/joaod.nascimento/Downloads/code/components/products/AddProductModal.tsx`
- `/Users/joaod.nascimento/Downloads/code/components/products/EditProductModal.tsx`
- `/Users/joaod.nascimento/Downloads/code/components/products/ProductGallery.tsx`
- `/Users/joaod.nascimento/Downloads/code/components/products/ProductCard.tsx`
- `/Users/joaod.nascimento/Downloads/code/components/products/ImageUpload.tsx`

### Components - Sales
- `/Users/joaod.nascimento/Downloads/code/components/sales/NewSaleWizard.tsx`
- `/Users/joaod.nascimento/Downloads/code/components/sales/CustomerSelectionStep.tsx`
- `/Users/joaod.nascimento/Downloads/code/components/sales/ProductSelectionStep.tsx`
- `/Users/joaod.nascimento/Downloads/code/components/sales/PaymentMethodStep.tsx`
- `/Users/joaod.nascimento/Downloads/code/components/sales/SaleSummary.tsx`

### Components - Dashboard
- `/Users/joaod.nascimento/Downloads/code/components/dashboard/MetricsCards.tsx`
- `/Users/joaod.nascimento/Downloads/code/components/dashboard/SalesChart.tsx`
- `/Users/joaod.nascimento/Downloads/code/components/dashboard/RecentSalesList.tsx`
- `/Users/joaod.nascimento/Downloads/code/components/dashboard/PaymentBreakdown.tsx`

### Validation & Types
- `/Users/joaod.nascimento/Downloads/code/lib/validations/productSchemas.ts`
- `/Users/joaod.nascimento/Downloads/code/lib/validations/saleSchemas.ts`
- `/Users/joaod.nascimento/Downloads/code/lib/validations/customerSchemas.ts`
- `/Users/joaod.nascimento/Downloads/code/types/supabase.ts` - Auto-generated DB types

### State & Context
- `/Users/joaod.nascimento/Downloads/code/lib/contexts/AuthContext.tsx`
- `/Users/joaod.nascimento/Downloads/code/lib/contexts/QueryProvider.tsx`
- `/Users/joaod.nascimento/Downloads/code/lib/stores/saleWizardStore.ts`

### Documentation
- `/Users/joaod.nascimento/Downloads/code/docs/catalogo-architecture.md` - Catalog design (in progress)
- `/Users/joaod.nascimento/Downloads/code/docs/prd-catalogo.md` - Catalog requirements
- `/Users/joaod.nascimento/Downloads/code/CODEBASE_EXPLORATION.md` - This project's architecture

---

## Quick Commands for Exploration

### Find All Services
```bash
ls /Users/joaod.nascimento/Downloads/code/lib/services/
```

### Find All Components
```bash
find /Users/joaod.nascimento/Downloads/code/components -type f -name "*.tsx"
```

### Find Type Definitions
```bash
find /Users/joaod.nascimento/Downloads/code/types -type f -name "*.ts"
```

### List All Pages
```bash
find /Users/joaod.nascimento/Downloads/code/app -type f -name "page.tsx"
```

---

## Architecture at a Glance

### Data Flow
```
UI Components 
  ↓ (React Hook Form + Zod)
Validation & State (React Query + Zustand)
  ↓
Service Layer (/lib/services/)
  ↓ (Supabase Client)
Supabase Database (PostgreSQL)
  ↓ (Storage for images)
Supabase Storage (products bucket)
```

### Component Hierarchy
```
RootLayout (AuthProvider, QueryProvider)
  ├── MainLayout (Navigation, Sidebar)
  │   ├── Dashboard
  │   ├── Inventory (Products Page)
  │   ├── Sales
  │   ├── Customers
  │   └── Settings
  └── Auth Pages (Login, etc.)
```

### Database Relationships
```
users (admin users)
  ├── products (user_id FK)
  │   ├── categories (category_id FK)
  │   └── sale_items (product_id FK)
  ├── customers (user_id FK)
  │   └── sales (customer_id FK)
  ├── sales (user_id FK)
  │   └── sale_items (sale_id FK)
  └── discounts (user_id FK)
```

---

## Key Technical Patterns

### Product Management Pattern
1. User clicks "Novo Produto" button
2. AddProductModal opens with form
3. Form validates with productSchema (Zod)
4. onSubmit calls createProduct() service
5. Image is uploaded to Supabase Storage
6. Product record saved to database
7. React Query invalidates ['products'] cache
8. UI updates with new product

### Sales Wizard Pattern
1. User opens NewSaleWizard
2. Multi-step form with context/store state
3. Each step validates before proceeding
4. Final step creates sale + sale_items records
5. Inventory quantities decremented
6. Dashboard real-time subscription triggers update
7. Toast notification confirms success

### Dashboard Real-time Pattern
1. Page loads with React Query fetches
2. Supabase Realtime subscription created
3. Listen to 'postgres_changes' on sales table
4. Any insert/update/delete triggers callback
5. React Query cache invalidated
6. Component re-renders with fresh data

---

## Most Important Files to Know

1. **productService.ts** - All product operations
2. **salesService.ts** - All sales & analytics
3. **types/index.ts** - Data models for entire app
4. **app/layout.tsx** - Root setup with auth/query providers
5. **components/sales/NewSaleWizard.tsx** - Complex multi-step form
6. **app/dashboard/page.tsx** - Real-time dashboard with subscriptions

---

## Development Workflow

### To Add a New Feature
1. Define types in `/types/index.ts`
2. Create validation schema in `/lib/validations/`
3. Implement service in `/lib/services/`
4. Create component(s) in `/components/`
5. Create/update page in `/app/`
6. Test with React Query devtools

### To Modify a Service
1. Find service file in `/lib/services/`
2. Update function signature if needed
3. Update error handling
4. Check all places calling this service
5. Update React Query keys if query structure changed
6. Test in affected components

### To Add a Page
1. Create directory in `/app/`
2. Add `page.tsx` file
3. Import MainLayout wrapper
4. Use services and components
5. Add navigation link in layout

---

## Current Status Summary

**Completed:**
- Product CRUD, Category management, Inventory tracking
- Sales wizard with multi-step form
- Real-time dashboard with analytics
- Discount system
- Customer management
- User authentication (admin)
- Payment method tracking
- Sales charts and reporting

**In Development:**
- Public catalog feature (design phase)
- WhatsApp authentication
- Catalog-specific UI components
- Product requests and favorites system

---

**For detailed architecture, see: CODEBASE_EXPLORATION.md**
