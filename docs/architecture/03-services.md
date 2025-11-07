# Auralux Architecture - Services & Components

[← Back to Overview](./00-overview.md) | [← Data Models](./02-data-models.md) | [Workflows →](./05-workflows.md)

---

## Component Architecture Overview

The Auralux backend follows a **layered serverless architecture** with clear separation of concerns:

```
Presentation Layer (React Components)
    ↓
API Layer (Next.js API Routes)
    ↓
Service Layer (Business Logic)
    ↓
Data Access Layer (Supabase Client + Repository Pattern)
    ↓
Database Layer (PostgreSQL with RLS)
```

---

## 1. Authentication Service

**Responsibility:** Manages user authentication, session management, and authorization using Supabase Auth.

**Key Interfaces:**
- `POST /api/auth/login` - User login with email/password
- `POST /api/auth/logout` - User logout and session cleanup
- `POST /api/auth/signup` - New user registration
- `POST /api/auth/reset-password` - Password reset flow
- `GET /api/auth/session` - Get current user session
- Supabase Auth hooks for client-side auth state

**Dependencies:**
- Supabase Auth SDK (authentication provider)
- Next.js middleware (route protection)
- Database: users table (extended user profile)

**Technology Stack:**
- Supabase Auth (JWT-based authentication)
- Next.js API Routes (custom auth logic)
- React Context API (auth state management)

**Implementation Details:**
- Uses Supabase's built-in email/password authentication
- JWT tokens stored in httpOnly cookies
- Session persistence via Supabase client
- Protected routes enforced via Next.js middleware
- RLS policies automatically enforce user_id context

**Security:**
- JWT tokens with short expiration (1 hour)
- Refresh tokens for session renewal
- httpOnly cookies prevent XSS attacks
- CSRF protection via SameSite cookies

---

## 2. Customer Management Service

**Responsibility:** Handles customer registration, search, and profile management.

**Key Interfaces:**
- `GET /api/customers` - List all customers for authenticated user
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer information
- `DELETE /api/customers/:id` - Soft delete customer
- `GET /api/customers/search?q=` - Search customers by name/WhatsApp

**Dependencies:**
- Database: customers table
- Validation: Zod schemas for customer data
- External: WhatsApp number validation (future integration)

**Technology Stack:**
- Next.js API Routes (orchestration)
- Supabase Client (data access)
- Zod (input validation)
- React Hook Form (form handling)

**Implementation Details:**
- RLS policies ensure user sees only their customers
- WhatsApp number validation (Brazilian format: +55 XX XXXXX-XXXX)
- Duplicate detection via unique constraint (user_id, whatsapp)
- Search uses PostgreSQL ILIKE for fuzzy matching
- Optimistic UI updates for instant feedback

**Business Logic:**
- Validate WhatsApp number format before insertion
- Auto-increment purchase_count on sale completion (via trigger)
- Prevent deletion if customer has sales (referential integrity)

---

## 3. Inventory Management Service

**Responsibility:** Manages product catalog, stock levels, and inventory movements.

**Key Interfaces:**
- `GET /api/products` - List all products with filtering/sorting
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product information
- `DELETE /api/products/:id` - Soft delete product
- `POST /api/products/:id/upload-image` - Upload product image to Supabase Storage
- `GET /api/inventory/movements` - Get inventory movement history
- `POST /api/inventory/adjust` - Manual inventory adjustment

**Dependencies:**
- Database: products, categories, inventory_movements tables
- Supabase Storage (product images)
- Validation: Zod schemas for product data

**Technology Stack:**
- Next.js API Routes (orchestration)
- Supabase Client (data access)
- Supabase Storage (image storage)
- Zod (input validation)

**Implementation Details:**
- RLS policies ensure user sees only their products
- Image upload to Supabase Storage bucket (products/)
- Automatic profit margin calculation: ((sale_price - cost_price) / sale_price) * 100
- Low stock alerts when quantity <= low_stock_threshold
- Inventory movements tracked automatically on stock changes
- Category filtering and product search via PostgreSQL full-text search

**Business Logic:**
- Validate sale_price >= cost_price
- Prevent quantity from going negative
- Create inventory_movement record on manual adjustments
- Trigger inventory updates on sale completion
- Optimize images on upload (resize, compress)

---

## 4. Sales Processing Service

**Responsibility:** Orchestrates sale creation, payment processing, inventory updates, and customer metrics updates.

**Key Interfaces:**
- `GET /api/sales` - List sales with pagination and filters
- `GET /api/sales/:id` - Get sale details with line items
- `POST /api/sales` - Create new sale (complex transaction)
- `PUT /api/sales/:id/cancel` - Cancel sale (reverse inventory)
- `GET /api/sales/metrics` - Dashboard metrics (daily, weekly, monthly)
- `GET /api/sales/recent` - Recent sales list

**Dependencies:**
- Database: sales, sale_items, customers, products, inventory_movements tables
- Customer Management Service (update purchase counts)
- Inventory Management Service (update stock levels)
- Validation: Zod schemas for sale data

**Technology Stack:**
- Next.js API Routes (orchestration)
- Supabase Client with PostgreSQL transactions
- Zod (input validation)

**Implementation Details:**
- **Atomic transactions:** Sale creation uses PostgreSQL transactions to ensure:
  1. Sale record created
  2. Sale items created with price snapshots
  3. Product quantities decremented
  4. Inventory movements recorded
  5. Customer purchase_count and total_purchases incremented
  6. Rollback on any failure

- **Payment method handling:**
  - PIX/Cash: Record total_amount only
  - Installment: Require actual_amount_received, calculate discount_amount

- **Inventory updates:** Trigger-based automatic updates on sale completion

- **Real-time updates:** Dashboard subscribes to sales table changes

**Business Logic:**
- Validate product availability (quantity >= requested amount)
- Snapshot product prices at time of sale (historical accuracy)
- Calculate total_amount from SUM(sale_items.subtotal)
- For installments, validate actual_amount_received <= total_amount
- Create inventory_movement records for audit trail
- Update customer metrics atomically

---

## 5. Dashboard & Analytics Service

**Responsibility:** Aggregates business metrics and provides real-time dashboard data.

**Key Interfaces:**
- `GET /api/dashboard/metrics` - Overall KPIs (sales, revenue, customers, inventory)
- `GET /api/dashboard/sales-chart` - Sales data for chart visualization (daily/weekly/monthly)
- `GET /api/dashboard/payment-breakdown` - Payment method distribution
- `GET /api/dashboard/top-products` - Best-selling products
- `GET /api/dashboard/low-stock-alerts` - Products below threshold
- `GET /api/dashboard/revenue-analysis` - Revenue vs actual received (installment impact)
- Supabase Realtime subscriptions for live updates

**Dependencies:**
- Database: sales, products, customers, sale_items tables
- Sales Processing Service (data source)
- Inventory Management Service (low stock alerts)

**Technology Stack:**
- Next.js API Routes (data aggregation)
- Supabase Client with SQL views/functions
- Supabase Realtime (live updates)
- Recharts (frontend visualization)

**Implementation Details:**
- **Metrics calculated via PostgreSQL views:**
  - `v_daily_sales_metrics`: Daily sales count and revenue
  - `v_payment_method_breakdown`: Payment type distribution
  - `v_low_stock_products`: Products below threshold
  - `v_top_selling_products`: Products by sales volume

- **Real-time subscriptions:**
  - Sales table: Update revenue metrics on new sale
  - Products table: Update inventory alerts on quantity change

- **Caching:** TanStack Query caches dashboard data client-side (5-minute TTL)

**Business Logic:**
- Calculate actual vs expected revenue (installment discount impact)
- Aggregate sales by date range (day, week, month, year)
- Identify best-selling products by revenue and quantity
- Flag low-stock products for reorder alerts

---

## 6. Category Management Service

**Responsibility:** Manages product categories for organization and reporting.

**Key Interfaces:**
- `GET /api/categories` - List all categories for user
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category (soft delete if products exist)

**Dependencies:**
- Database: categories table
- Inventory Management Service (check product associations)

**Technology Stack:**
- Next.js API Routes (orchestration)
- Supabase Client (data access)
- Zod (input validation)

**Implementation Details:**
- RLS policies ensure user sees only their categories
- Unique constraint on (user_id, name) prevents duplicates
- Soft delete if products exist (set products.category_id to NULL)
- Hard delete if no products associated

---

## External APIs

### Supabase API

- **Purpose:** Primary backend-as-a-service for database, authentication, storage, and real-time features
- **Documentation:** https://supabase.com/docs
- **Base URL(s):**
  - Project URL: https://[project-id].supabase.co
  - API URL: https://[project-id].supabase.co/rest/v1
  - Auth URL: https://[project-id].supabase.co/auth/v1
  - Storage URL: https://[project-id].supabase.co/storage/v1
- **Authentication:** API Key (anon/service role) + JWT tokens
- **Rate Limits:** Depends on plan (Free: 500 requests/minute, Pro: 1000 requests/minute)

**Key Endpoints Used:**

Database (REST API):
- `GET /rest/v1/customers` - Query customers table
- `POST /rest/v1/customers` - Insert customer
- `PATCH /rest/v1/customers?id=eq.{id}` - Update customer
- `DELETE /rest/v1/customers?id=eq.{id}` - Delete customer
- Similar patterns for products, sales, categories, etc.

Authentication:
- `POST /auth/v1/signup` - User registration
- `POST /auth/v1/token?grant_type=password` - User login
- `POST /auth/v1/logout` - User logout
- `GET /auth/v1/user` - Get current user

Storage:
- `POST /storage/v1/object/products/{filename}` - Upload product image
- `GET /storage/v1/object/public/products/{filename}` - Get product image URL
- `DELETE /storage/v1/object/products/{filename}` - Delete product image

Realtime (WebSocket):
- `wss://[project-id].supabase.co/realtime/v1/websocket` - Real-time subscriptions

**Integration Notes:**
- Use Supabase JavaScript Client SDK (not direct REST calls)
- RLS policies enforced automatically on all database operations
- JWT tokens included automatically in SDK requests
- Realtime subscriptions require authenticated connection
- Storage bucket policies control image access (public read, authenticated write)

---

### WhatsApp Business API (Future Integration)

- **Purpose:** Validate WhatsApp numbers and send notifications (planned for post-MVP)
- **Documentation:** https://developers.facebook.com/docs/whatsapp
- **Base URL(s):** https://graph.facebook.com/v18.0
- **Authentication:** Bearer token (Facebook Business Manager)
- **Rate Limits:** Varies by tier (1000 messages/day free tier)

**Key Endpoints Used:**
- `POST /v18.0/{phone-number-id}/messages` - Send WhatsApp message
- `GET /v18.0/{phone-number-id}` - Verify phone number

**Integration Notes:**
- Not implemented in MVP
- Future use case: Send sale receipts to customers
- Requires Facebook Business Manager account and verification
- Consider alternative: Twilio WhatsApp API for simpler integration

---

## Related Documents

- [← Data Models](./02-data-models.md)
- [Database Schema](./04-database-schema.md)
- [Workflows →](./05-workflows.md)
- [Overview](./00-overview.md)

---

**Document Version:** v1.1
**Last Updated:** 2025-11-07
**Status:** Complete - Modularized
