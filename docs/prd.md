# Auralux - Mobile Sales & Inventory Management PRD

## Intro Project Analysis and Context

### Analysis Source
- **Type**: Greenfield Project (New Development)
- **Source**: User-provided requirements and specifications
- **Date**: 2025-11-06

### Current Project State
**Auralux** is a new mobile-first PWA (Progressive Web Application) designed for retail store management. The application will serve as a comprehensive sales, customer, and inventory management system optimized for iOS devices.

**Primary Purpose**: Enable store owners to efficiently manage customers, track sales, monitor inventory, and gain business insights through an intuitive mobile interface.

### Available Documentation Analysis

#### Available Documentation
- [ ] Tech Stack Documentation
- [ ] Source Tree/Architecture
- [ ] Coding Standards
- [ ] API Documentation
- [ ] External API Documentation (Supabase)
- [ ] UX/UI Guidelines
- [ ] Technical Debt Documentation

**Status**: This is a greenfield project - all documentation will be created as part of this development effort.

### Enhancement Scope Definition

#### Enhancement Type
- [x] New Feature Addition (Complete Application)
- [ ] Major Feature Modification
- [ ] Integration with New Systems
- [ ] Performance/Scalability Improvements
- [x] UI/UX Overhaul (New Design)
- [ ] Technology Stack Upgrade
- [ ] Bug Fix and Stability Improvements

#### Enhancement Description
Development of a complete mobile-first PWA for retail store management, featuring customer management, sales tracking with multiple payment methods, and intelligent inventory control with real-time metrics and analytics.

#### Impact Assessment
- [x] Major Impact (Full application architecture required)

### Goals and Background Context

#### Goals
- Provide an intuitive mobile-first interface optimized for iOS devices
- Enable quick customer registration and sales transaction processing
- Track inventory with intelligent monitoring and automatic stock updates
- Support multiple payment methods including installment plans (up to 12x)
- Deliver real-time business metrics and analytics dashboards
- Ensure secure authentication and data management via Supabase
- Create an attractive, simple, and efficient user experience

#### Background Context
The store owner needs a modern, mobile-optimized solution to replace manual or inefficient sales and inventory tracking methods. The application must be accessible primarily via iOS devices, with a focus on speed, simplicity, and visual appeal. The system needs to handle customer data, sales transactions with various payment methods (including credit card installments with discount tracking), and maintain accurate inventory levels with profit margin calculations. The solution leverages Supabase for backend services including authentication and PostgreSQL database management.

#### Change Log
| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial Creation | 2025-11-06 | v1.0 | Initial PRD document creation | John (PM Agent) |
| Loading States & Color Palette | 2025-11-07 | v2.0 | Added comprehensive loading states (FR30-FR36, NFR8), defined complete color scheme "Calor e Sofisticação Terrena", detailed UI consistency requirements with Auralux branding | John (PM Agent) |

---

## Requirements

### Functional Requirements

**Customer Management (FR1-FR5)**
- **FR1**: System shall provide a customer registration form capturing full name and WhatsApp number
- **FR2**: System shall display a customer gallery showing customer name and total purchase count
- **FR3**: System shall display total registered customer count metric above the customer gallery
- **FR4**: System shall allow searching and filtering customers in the gallery
- **FR5**: System shall validate WhatsApp number format during registration

**Sales Management (FR6-FR14)**
- **FR6**: System shall open the Sales Dashboard as the default landing screen
- **FR7**: System shall provide a "+ Nova Venda" (New Sale) button prominently above the dashboard
- **FR8**: System shall allow selection of a registered customer for each sale
- **FR9**: System shall allow adding multiple products to a sale transaction
- **FR10**: System shall support three payment methods: PIX, Cash (Dinheiro), and Installments (Parcelado até 12x)
- **FR11**: When "Parcelado" is selected, system shall display a popup to capture the actual amount received after card processing fees
- **FR12**: System shall calculate and track the difference between sale price and actual amount received for installment payments
- **FR13**: System shall display sales metrics in an attractive, objective dashboard format
- **FR14**: System shall automatically update inventory quantities after sale completion

**Inventory Management (FR15-FR23)**
- **FR15**: System shall provide a product registration form with fields: image upload, sale price, cost price, and quantity
- **FR16**: System shall display total inventory quantity metric
- **FR17**: System shall display total potential inventory value metric (sum of sale prices × quantities)
- **FR18**: System shall display product gallery showing image, sale price, cost price, quantity, and profit margin
- **FR19**: System shall calculate and display profit margin percentage for each product ((sale price - cost price) / sale price × 100)
- **FR20**: System shall provide intelligent inventory tracking with automatic quantity updates on sales
- **FR21**: System shall allow product categorization via categories created in settings
- **FR22**: System shall alert when product stock reaches low levels (configurable threshold)
- **FR23**: System shall track inventory movement history (additions, sales, adjustments)

**Settings & Configuration (FR24-FR26)**
- **FR24**: System shall provide a settings/configuration section accessible from the top of all screens
- **FR25**: System shall allow creation and management of product categories
- **FR26**: System shall provide application configuration options (low stock thresholds, display preferences, etc.)

**Authentication (FR27-FR29)**
- **FR27**: System shall provide an attractive login screen
- **FR28**: System shall integrate with Supabase Authentication for user login/logout
- **FR29**: System shall maintain user session securely and provide session management

**Loading States & User Feedback (FR30-FR36)**
- **FR30**: System shall display a branded splash screen with Auralux logo during initial app load
- **FR31**: System shall show skeleton screens with loading placeholders while fetching data for galleries (customers, products, sales)
- **FR32**: System shall display inline loading indicators for form submissions and data mutations
- **FR33**: System shall show a centered loading spinner with Auralux logo for full-page operations
- **FR34**: System shall provide optimistic UI updates for instant feedback on user actions
- **FR35**: System shall display progress indicators for multi-step processes (e.g., image upload)
- **FR36**: System shall show error states with retry options when operations fail

### Non-Functional Requirements

**Performance (NFR1-NFR3)**
- **NFR1**: Application shall load initial screen within 2 seconds on standard mobile connections
- **NFR2**: Form submissions shall provide feedback within 1 second
- **NFR3**: Dashboard metrics shall refresh in real-time without requiring page reload

**Usability (NFR4-NFR8)**
- **NFR4**: Application shall be optimized for iOS mobile devices (responsive design)
- **NFR5**: Interface shall be intuitive requiring minimal training for basic operations
- **NFR6**: All interactive elements shall have touch-optimized sizing (minimum 44x44pt)
- **NFR7**: Application shall provide visual feedback for all user interactions
- **NFR8**: All loading states shall complete perceived load within 3 seconds or show progress indication

**Security (NFR9-NFR11)**
- **NFR9**: All authentication shall be handled securely through Supabase Auth
- **NFR10**: Database access shall be restricted through Row Level Security (RLS) policies
- **NFR11**: Sensitive financial data shall be encrypted in transit and at rest

**Reliability (NFR12-NFR13)**
- **NFR12**: Application shall work offline with local caching and sync when connection restored
- **NFR13**: System shall maintain data integrity during concurrent multi-user access

**Scalability (NFR14)**
- **NFR14**: Database schema shall support growth to 10,000+ customers, 100,000+ sales, and 1,000+ products

**Maintainability (NFR15-NFR16)**
- **NFR15**: Codebase shall follow consistent naming conventions and structure
- **NFR16**: All database schema changes shall be managed through Supabase migrations

### Compatibility Requirements

- **CR1 - Browser Compatibility**: Application must function on Safari iOS (latest 2 versions) and Chrome iOS
- **CR2 - Database Compatibility**: All database operations must be compatible with PostgreSQL 14+ (Supabase default)
- **CR3 - PWA Standards**: Application must meet PWA standards for installability and offline functionality
- **CR4 - Supabase Integration**: All authentication and database operations must utilize Supabase SDK and APIs

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

## Technical Constraints and Integration Requirements

### Existing Technology Stack

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

### Database Schema Design

**Tables to be created via Supabase MCP:**

#### 1. users (extends Supabase auth.users)
```sql
- id: uuid (PK, references auth.users)
- store_name: text
- created_at: timestamp
- updated_at: timestamp
```

#### 2. customers
```sql
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (FK to users, owner reference)
- full_name: text (not null)
- whatsapp: text (not null)
- purchase_count: integer (default 0)
- created_at: timestamp (default now())
- updated_at: timestamp (default now())
```

#### 3. categories
```sql
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (FK to users)
- name: text (not null)
- created_at: timestamp (default now())
- updated_at: timestamp (default now())
```

#### 4. products
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

#### 5. sales
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

#### 6. sale_items
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

#### 7. inventory_movements
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

### Integration Approach

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

### Code Organization and Standards

**File Structure Approach**:
```
auralux/
├── src/
│   ├── components/
│   │   ├── common/         # Reusable UI components
│   │   ├── customers/      # Customer-specific components
│   │   ├── sales/          # Sales-specific components
│   │   ├── inventory/      # Inventory-specific components
│   │   └── layout/         # Layout components (Navigation, Header)
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx   # Sales dashboard
│   │   ├── Customers.tsx
│   │   ├── Inventory.tsx
│   │   └── Settings.tsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client configuration
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── utils.ts        # Utility functions
│   ├── schemas/            # Zod validation schemas
│   ├── styles/             # Global styles and Tailwind config
│   └── main.tsx            # Application entry point
├── public/
│   ├── manifest.json       # PWA manifest
│   └── service-worker.js   # Service worker for offline
├── supabase/
│   └── migrations/         # Database migration files
└── docs/                   # Project documentation
```

**Naming Conventions**:
- Components: PascalCase (e.g., `CustomerCard.tsx`)
- Files/folders: kebab-case or camelCase
- Database tables: snake_case (PostgreSQL convention)
- TypeScript types/interfaces: PascalCase with descriptive names
- Functions: camelCase, descriptive verb-noun pattern
- Constants: UPPER_SNAKE_CASE

**Coding Standards**:
- ESLint + Prettier for code formatting
- Strict TypeScript configuration (no implicit any)
- Functional components with hooks (no class components)
- Consistent error handling patterns
- Comprehensive JSDoc comments for complex functions
- Atomic commits with descriptive messages

**Documentation Standards**:
- README with setup instructions
- Component documentation with prop types
- API integration documentation
- Database schema documentation
- Deployment guide

### Deployment and Operations

**Build Process Integration**:
- Vite build optimization for production
- Code splitting for optimal bundle size
- Asset optimization (image compression, lazy loading)
- Environment variable management (.env files)
- TypeScript compilation with strict checks

**Deployment Strategy**:
- Continuous deployment via Git integration (Vercel/Netlify)
- Separate environments: development, staging, production
- Automated builds on main branch commits
- Preview deployments for pull requests
- PWA service worker updates

**Monitoring and Logging**:
- Error tracking (Sentry or similar)
- Performance monitoring (Web Vitals)
- User analytics (privacy-focused)
- Supabase dashboard for database monitoring
- Console logging with levels (dev only)

**Configuration Management**:
- Environment-specific .env files
- Supabase project configuration
- Feature flags for gradual rollouts
- User settings stored in database

### Risk Assessment and Mitigation

**Technical Risks**:
- **Risk**: iOS Safari PWA limitations (e.g., storage limits, notification restrictions)
  - **Mitigation**: Thoroughly test PWA features on iOS Safari; implement graceful degradation; consider hybrid app wrapper if needed

- **Risk**: Offline data sync conflicts
  - **Mitigation**: Implement conflict resolution strategy; use optimistic UI updates; leverage Supabase real-time for immediate sync

- **Risk**: Image upload performance and storage
  - **Mitigation**: Use Supabase Storage with image optimization; implement client-side compression; lazy loading for gallery views

**Integration Risks**:
- **Risk**: Supabase service availability and rate limits
  - **Mitigation**: Implement retry logic; cache frequently accessed data; monitor usage against quotas

- **Risk**: Real-time subscription scalability
  - **Mitigation**: Use selective subscriptions; implement pagination; optimize query performance

**Deployment Risks**:
- **Risk**: Database migration failures
  - **Mitigation**: Test migrations in staging; implement rollback procedures; use Supabase migration versioning

- **Risk**: PWA update propagation delays
  - **Mitigation**: Implement service worker update notifications; test update scenarios; provide manual refresh option

**Mitigation Strategies**:
1. **Comprehensive Testing**: E2E tests covering critical user flows (sales, inventory updates)
2. **Incremental Development**: MVP with core features first, then iterate
3. **User Feedback Loop**: Early beta testing with store owner
4. **Performance Budgets**: Set and monitor bundle size and load time targets
5. **Security Audits**: Regular RLS policy reviews and security testing

---

## Epic and Story Structure

### Epic Approach

**Epic Structure Decision**: Single comprehensive epic for initial MVP development.

**Rationale**: Since this is a greenfield project with tightly integrated features (sales affecting inventory, customer data used in sales, etc.), a single epic approach ensures:
- Cohesive development of interconnected features
- Consistent data model implementation
- Unified authentication and security setup
- Streamlined testing of complete workflows
- Clear MVP delivery milestone

The epic will be broken into logical story sequences that build upon each other, with each story delivering incremental value while maintaining system integrity.

---

## Epic 1: Auralux MVP - Mobile Sales & Inventory Management System

**Epic Goal**: Deliver a fully functional mobile-first PWA that enables store owners to manage customers, process sales with multiple payment methods, and track inventory with intelligent monitoring and real-time analytics.

**Integration Requirements**:
- Supabase authentication fully integrated
- PostgreSQL database with all tables and RLS policies
- Real-time data synchronization across all modules
- PWA capabilities for offline access and mobile installation
- Responsive design optimized for iOS devices

---

### Story 1.1: Project Setup and Infrastructure

**As a** developer,
**I want** to set up the project infrastructure with Vite, React, TypeScript, and Supabase,
**so that** I have a solid foundation for building the application with best practices and tooling.

#### Acceptance Criteria
1. Vite project initialized with React and TypeScript template
2. TailwindCSS configured and working
3. Supabase project created with environment variables configured
4. Project folder structure created following defined architecture
5. ESLint and Prettier configured
6. Git repository initialized with .gitignore
7. README with setup instructions created

#### Integration Verification
- **IV1**: Verify Vite dev server runs successfully on `localhost`
- **IV2**: Confirm Supabase client connection established
- **IV3**: Validate TypeScript compilation without errors

---

### Story 1.2: Database Schema and Supabase Configuration

**As a** developer,
**I want** to create the complete database schema in Supabase with proper RLS policies,
**so that** the application has a secure and well-structured data foundation.

#### Acceptance Criteria
1. All 7 database tables created via Supabase MCP (users, customers, categories, products, sales, sale_items, inventory_movements)
2. Primary keys, foreign keys, and constraints properly defined
3. Row Level Security (RLS) policies implemented for all tables
4. Database indexes created for performance optimization
5. Computed columns and triggers implemented (e.g., profit margin, inventory updates)
6. Migration files generated and documented

#### Integration Verification
- **IV1**: Verify all tables created successfully in Supabase dashboard
- **IV2**: Test RLS policies with different user contexts
- **IV3**: Confirm foreign key relationships and cascading deletes work correctly

---

### Story 1.3: Authentication System with Supabase

**As a** store owner,
**I want** to securely log in to the application using Supabase authentication,
**so that** my business data is protected and accessible only to me.

#### Acceptance Criteria
1. Attractive login screen UI implemented
2. Supabase Auth integration with email/password authentication
3. Protected route implementation (redirect to login if not authenticated)
4. Session management and persistence
5. Logout functionality
6. Auth context/hook for accessing user state throughout app
7. Error handling for failed login attempts

#### Integration Verification
- **IV1**: Verify successful login redirects to Sales Dashboard
- **IV2**: Confirm unauthenticated users cannot access protected routes
- **IV3**: Test session persistence across page refreshes

---

### Story 1.4: Bottom Navigation and Layout Structure

**As a** user,
**I want** to navigate between Customers, Sales, and Inventory sections using a fixed bottom navigation bar,
**so that** I can easily access different parts of the application.

#### Acceptance Criteria
1. Fixed bottom navigation bar implemented with 3 tabs
2. Navigation icons and labels for Customers, Sales (default), and Inventory
3. Active tab highlighting
4. Top bar with app logo and settings icon implemented
5. React Router routes configured for all main sections
6. Mobile-optimized touch targets (minimum 44x44pt)
7. Smooth transitions between sections

#### Integration Verification
- **IV1**: Verify navigation works on iOS Safari
- **IV2**: Confirm Sales tab is active by default on app load
- **IV3**: Test touch interactions on various iOS screen sizes

---

### Story 1.5: Customer Management - Registration and Gallery

**As a** store owner,
**I want** to register customers with their name and WhatsApp number and view them in a gallery,
**so that** I can track my customer base and select customers for sales.

#### Acceptance Criteria
1. Customer registration form with full name and WhatsApp fields
2. WhatsApp number validation (Brazilian format)
3. Customer gallery displaying all customers with name and purchase count
4. Total customer count metric displayed prominently
5. "+ Novo Cliente" button
6. Search/filter functionality in customer gallery
7. Form validation and error messages
8. Success feedback on customer creation
9. Automatic database insertion using Supabase

#### Integration Verification
- **IV1**: Verify customer data persists correctly in Supabase database
- **IV2**: Confirm purchase count initializes to 0 for new customers
- **IV3**: Test RLS policies ensure user sees only their customers

---

### Story 1.6: Product/Inventory Management - Registration and Gallery

**As a** store owner,
**I want** to register products with images, prices, and quantities, and view them in an attractive gallery,
**so that** I can manage my inventory and track profit margins.

#### Acceptance Criteria
1. Product registration form with all required fields (image, name, category, sale price, cost price, quantity)
2. Image upload to Supabase Storage with preview
3. Automatic profit margin calculation and display
4. Product gallery with card-based layout showing all product details
5. Total inventory quantity metric displayed
6. Total potential value metric displayed (sum of sale_price × quantity)
7. "+ Novo Produto" button
8. Category selection (dropdown from configured categories)
9. Edit product functionality
10. Form validation for prices and quantities

#### Integration Verification
- **IV1**: Verify product data and images persist correctly in Supabase
- **IV2**: Confirm profit margin calculation is accurate ((sale_price - cost_price) / sale_price × 100)
- **IV3**: Test inventory metrics update in real-time when products added/edited

---

### Story 1.7: Category Management in Settings

**As a** store owner,
**I want** to create and manage product categories in the settings,
**so that** I can organize my inventory effectively.

#### Acceptance Criteria
1. Settings screen accessible from top bar icon
2. Categories section in settings
3. List of existing categories displayed
4. Add new category functionality
5. Edit/Delete category functionality
6. Category assignments reflected in product form dropdown
7. Validation to prevent empty category names

#### Integration Verification
- **IV1**: Verify categories persist in database and sync across app
- **IV2**: Confirm deleting a category updates related products (set category_id to null)
- **IV3**: Test category dropdown updates immediately after category creation

---

### Story 1.8: Sales Dashboard with Metrics

**As a** store owner,
**I want** to view a sales dashboard with attractive metrics and visualizations,
**so that** I can monitor my business performance at a glance.

#### Acceptance Criteria
1. Sales Dashboard as default landing screen after login
2. Key metrics cards: daily sales, weekly sales, monthly sales, total revenue
3. Sales chart/graph visualization (e.g., sales over time)
4. Recent sales list with customer name, date, and amount
5. Payment method breakdown (PIX, Cash, Installment percentages)
6. Revenue vs. actual received metric (accounting for installment discounts)
7. Real-time updates using Supabase subscriptions
8. "+ Nova Venda" button prominently displayed
9. Attractive, mobile-optimized design

#### Integration Verification
- **IV1**: Verify dashboard queries Supabase correctly and displays accurate data
- **IV2**: Confirm real-time subscription updates metrics when new sale added
- **IV3**: Test performance with large datasets (100+ sales)

---

### Story 1.9: New Sale Flow - Customer and Product Selection

**As a** store owner,
**I want** to create a new sale by selecting a customer and adding products,
**so that** I can process sales transactions efficiently.

#### Acceptance Criteria
1. "+ Nova Venda" button opens new sale modal/screen
2. Step 1: Customer selection with searchable dropdown
3. Step 2: Product selection with ability to add multiple products
4. Quantity selector for each product
5. Running total calculation displayed
6. Product search/filter functionality
7. Visual feedback for selected items
8. Form validation (customer required, at least one product)
9. "Next" button to proceed to payment method selection

#### Integration Verification
- **IV1**: Verify customer list loads from database correctly
- **IV2**: Confirm product list shows current inventory and prices
- **IV3**: Test total calculation updates correctly as products added/removed

---

### Story 1.10: Payment Method Selection and Installment Handling

**As a** store owner,
**I want** to select a payment method for each sale and capture actual received amount for installments,
**so that** I can accurately track revenue and card processing fees.

#### Acceptance Criteria
1. Step 3: Payment method selection (PIX, Dinheiro, Parcelado)
2. If "Parcelado" selected, display installment count selector (1x-12x)
3. If "Parcelado" selected, show popup to enter actual amount received after card fees
4. Automatic discount calculation (total - actual received)
5. Sale summary display before confirmation
6. "Confirmar Venda" button to complete transaction
7. Success feedback on sale completion
8. Return to dashboard after successful sale

#### Integration Verification
- **IV1**: Verify sale data with payment method persists correctly in database
- **IV2**: Confirm installment sales record actual_amount_received and calculate discount
- **IV3**: Test that only installment sales require actual amount popup

---

### Story 1.11: Inventory Update on Sale and Movement Tracking

**As a** system,
**I want** to automatically update product quantities when sales are completed and track all inventory movements,
**so that** inventory levels are always accurate and auditable.

#### Acceptance Criteria
1. Product quantities automatically decreased when sale completed
2. Sale items recorded in sale_items table with price snapshots
3. Inventory movements recorded in inventory_movements table
4. Movement type set to 'sale' with reference to sale_id
5. Customer purchase_count incremented on each sale
6. Low stock alerts triggered when quantity falls below threshold
7. Transaction integrity (rollback if any step fails)
8. Real-time inventory metrics update after sale

#### Integration Verification
- **IV1**: Verify product quantity decreases correctly in database after sale
- **IV2**: Confirm inventory_movements table tracks all changes accurately
- **IV3**: Test customer purchase_count increments correctly
- **IV4**: Ensure sale completion is atomic (all or nothing transaction)

---

### Story 1.12: PWA Configuration and Offline Capability

**As a** user,
**I want** the application to work as a PWA with offline capability,
**so that** I can install it on my iOS device and use it even with poor connectivity.

#### Acceptance Criteria
1. PWA manifest.json created with app metadata and icons
2. Service worker implemented for offline caching
3. App installable on iOS Safari
4. Offline fallback for cached data
5. Sync queue for operations performed offline
6. Online/offline status indicator
7. App icons in multiple sizes for iOS
8. Splash screen configuration

#### Integration Verification
- **IV1**: Verify app can be installed to iOS home screen
- **IV2**: Confirm app loads and displays cached data when offline
- **IV3**: Test queued operations sync when connection restored

---

### Story 1.13: Responsive Design and Mobile Optimization

**As a** user,
**I want** the application to be fully responsive and optimized for mobile devices,
**so that** I have an excellent experience on my iOS device.

#### Acceptance Criteria
1. All screens responsive across iOS device sizes (iPhone SE to iPhone Pro Max)
2. Touch-optimized elements (minimum 44x44pt)
3. Mobile-friendly form inputs (appropriate keyboards)
4. Optimized images and lazy loading
5. Smooth animations and transitions
6. No horizontal scrolling
7. Proper viewport meta tags
8. Accessible contrast ratios and font sizes

#### Integration Verification
- **IV1**: Test on various iOS simulators and real devices
- **IV2**: Verify all interactive elements are touch-friendly
- **IV3**: Confirm performance is smooth (60fps animations)

---

### Story 1.14: Testing and Quality Assurance

**As a** development team,
**I want** comprehensive tests covering critical user flows,
**so that** the application is reliable and bug-free for production use.

#### Acceptance Criteria
1. Unit tests for utility functions and calculations (profit margin, totals)
2. Component tests for key UI components
3. E2E tests for critical flows (login, create sale, add product, register customer)
4. Database query tests with mock data
5. RLS policy tests for security verification
6. Performance tests for dashboard metrics queries
7. Cross-browser testing (Safari iOS, Chrome iOS)
8. Test coverage minimum 70% for critical paths

#### Integration Verification
- **IV1**: All tests pass in CI/CD pipeline
- **IV2**: E2E tests successfully simulate complete user journeys on iOS
- **IV3**: RLS policies verified to prevent unauthorized data access

---

### Story 1.15: Deployment and Production Launch

**As a** product owner,
**I want** the application deployed to production with monitoring and documentation,
**so that** the store can start using it immediately.

#### Acceptance Criteria
1. Production Supabase project configured
2. Application deployed to hosting platform (Vercel/Netlify)
3. Environment variables configured for production
4. Custom domain configured (if applicable)
5. SSL/HTTPS enabled
6. Error monitoring configured (Sentry or similar)
7. Analytics configured (privacy-focused)
8. User documentation/guide created
9. Deployment documentation updated
10. Performance monitoring dashboard set up

#### Integration Verification
- **IV1**: Verify production deployment is accessible and functional
- **IV2**: Confirm production database connection works correctly
- **IV3**: Test complete user flow in production environment
- **IV4**: Verify error monitoring captures and reports issues

---

## Appendix

### Technology Stack Summary
- **Frontend**: React 18+, TypeScript, TailwindCSS, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **State Management**: React Query, Context API/Zustand
- **Forms**: React Hook Form, Zod
- **Charts**: Recharts or Chart.js
- **Testing**: Vitest, React Testing Library, Playwright
- **Deployment**: Vercel or Netlify
- **Monitoring**: Sentry, Web Vitals

### Key Metrics to Track
- Total Customers
- Total Sales (by day, week, month)
- Total Revenue (gross and actual received)
- Average Sale Value
- Total Inventory Value
- Total Inventory Quantity
- Products Below Low Stock Threshold
- Payment Method Distribution
- Average Installment Discount Percentage

### Future Enhancements (Post-MVP)
- Customer purchase history view
- Product sales analytics (best sellers)
- Expense tracking
- Profit/loss reports
- Barcode scanning for products
- Receipt generation and printing
- Multi-user support with roles
- Data export (CSV, PDF reports)
- Email/SMS notifications for low stock
- Customer loyalty program

---

**Document Version**: v2.0
**Last Updated**: 2025-11-07
**Author**: John (PM Agent)
**Status**: Ready for Development
