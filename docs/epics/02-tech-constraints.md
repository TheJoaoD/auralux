# Auralux - Technical Constraints

[← UI/UX Guidelines](./01-ui-ux-guidelines.md) | [Epic 1 →](./epic-01-mvp.md)

---

## Existing Technology Stack

**Languages**:
- TypeScript (Primary language for type safety)
- HTML5, CSS3

**Frameworks**:
- React 18+ (UI framework)
- Vite (Build tool and dev server)
- React Router (Client-side routing)
- TailwindCSS (Utility-first CSS framework)

**Database**:
- PostgreSQL 14+ (via Supabase)
- Supabase Client SDK

**Infrastructure**:
- Supabase (Backend-as-a-Service)
  - Authentication
  - PostgreSQL Database
  - Row Level Security
  - Real-time subscriptions
- PWA deployment (Vercel, Netlify, or similar)

**External Dependencies**:
- Supabase JS Client
- React Hook Form (Form management)
- Recharts or Chart.js (Data visualization)
- React Query (Data fetching and caching)
- Zod (Schema validation)

## Database Schema Design

**Tables to be created via Supabase MCP:**

### 1. users (extends Supabase auth.users)
```sql
- id: uuid (PK, references auth.users)
- store_name: text
- created_at: timestamp
- updated_at: timestamp
```

### 2. customers
```sql
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (FK to users, owner reference)
- full_name: text (not null)
- whatsapp: text (not null)
- purchase_count: integer (default 0)
- created_at: timestamp (default now())
- updated_at: timestamp (default now())
```

### 3. categories
```sql
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (FK to users)
- name: text (not null)
- created_at: timestamp (default now())
- updated_at: timestamp (default now())
```

### 4. products
```sql
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (FK to users)
- category_id: uuid (FK to categories, nullable)
- name: text (not null)
- image_url: text (nullable)
- sale_price: decimal(10,2) (not null)
- cost_price: decimal(10,2) (not null)
- quantity: integer (not null, default 0)
- low_stock_threshold: integer (default 5)
- created_at: timestamp (default now())
- updated_at: timestamp (default now())
```

### 5. sales
```sql
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (FK to users)
- customer_id: uuid (FK to customers)
- total_amount: decimal(10,2) (not null)
- payment_method: text (not null) -- 'pix', 'cash', 'installment'
- installment_count: integer (nullable) -- 1-12 if installment
- actual_amount_received: decimal(10,2) (nullable) -- for installments
- discount_amount: decimal(10,2) (computed: total_amount - actual_amount_received)
- created_at: timestamp (default now())
- updated_at: timestamp (default now())
```

### 6. sale_items
```sql
- id: uuid (PK, default gen_random_uuid())
- sale_id: uuid (FK to sales, on delete cascade)
- product_id: uuid (FK to products)
- quantity: integer (not null)
- unit_price: decimal(10,2) (not null, snapshot of sale price at time of sale)
- unit_cost: decimal(10,2) (not null, snapshot of cost price at time of sale)
- subtotal: decimal(10,2) (computed: quantity * unit_price)
- created_at: timestamp (default now())
```

### 7. inventory_movements
```sql
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (FK to users)
- product_id: uuid (FK to products)
- movement_type: text (not null) -- 'addition', 'sale', 'adjustment'
- quantity_change: integer (not null) -- positive or negative
- reference_id: uuid (nullable) -- sale_id if movement_type = 'sale'
- notes: text (nullable)
- created_at: timestamp (default now())
```

## Integration Approach

**Database Integration Strategy**:
- Utilize Supabase PostgreSQL with Row Level Security (RLS) policies
- All database operations through Supabase JS Client
- Real-time subscriptions for live dashboard updates
- Database tables created via Supabase MCP tools
- Migrations managed through Supabase migration system

**API Integration Strategy**:
- RESTful API pattern via Supabase auto-generated APIs
- Real-time WebSocket connections for dashboard metrics
- GraphQL consideration for complex queries (optional)
- Type-safe API calls using TypeScript and Zod validation

**Frontend Integration Strategy**:
- React with TypeScript for type safety
- React Query for server state management and caching
- Context API or Zustand for client state management
- TailwindCSS for responsive, mobile-first styling
- PWA manifest and service worker for offline capability

**Testing Integration Strategy**:
- Vitest for unit testing
- React Testing Library for component testing
- Playwright for E2E testing (iOS Safari simulation)
- Supabase local development for testing database operations

---

## Related Documents

- [← UI/UX Guidelines](./01-ui-ux-guidelines.md)
- [Epic 1: MVP →](./epic-01-mvp.md)
- [PRD Core](./00-prd-core.md)
- [Architecture - Data Models](../architecture/02-data-models.md)
- [Architecture - Database Schema](../architecture/04-database-schema.md)

---

**Document Version:** v2.1
**Last Updated:** 2025-11-07
**Status:** Complete - Modularized
