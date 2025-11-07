# Epic 1: Auralux MVP - Mobile Sales & Inventory Management System

[← Tech Constraints](./02-tech-constraints.md) | [Main PRD](../prd.md)

---

## Epic Overview

**Epic Goal**: Deliver a fully functional mobile-first PWA that enables store owners to manage customers, process sales with multiple payment methods, and track inventory with intelligent monitoring and real-time analytics.

**Integration Requirements**:
- Supabase authentication fully integrated
- PostgreSQL database with all tables and RLS policies
- Real-time data synchronization across all modules
- PWA capabilities for offline access and mobile installation
- Responsive design optimized for iOS devices

---

## Stories (15 Total)

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

## Related Documents

- [PRD Core](./00-prd-core.md)
- [UI/UX Guidelines](./01-ui-ux-guidelines.md)
- [Tech Constraints](./02-tech-constraints.md)
- [Architecture Overview](../architecture/00-overview.md)
- [Main PRD](../prd.md)

---

**Epic Status:** Ready for Story Creation  
**Total Stories:** 15  
**Document Version:** v2.1  
**Last Updated:** 2025-11-07
