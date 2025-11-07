# Auralux - PRD Core

[← Back to Main PRD](../prd.md) | [UI/UX Guidelines →](./01-ui-ux-guidelines.md)

---

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
| Document Fragmentation | 2025-11-07 | v2.1 | Fragmented PRD into modular documents for efficient AI agent workflows | System |

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

## Related Documents

- [UI/UX Guidelines →](./01-ui-ux-guidelines.md)
- [Tech Constraints](./02-tech-constraints.md)
- [Epic 1: MVP](./epic-01-mvp.md)
- [Main PRD](../prd.md)
- [Architecture Overview](../architecture/00-overview.md)

---

**Document Version:** v2.1
**Last Updated:** 2025-11-07
**Status:** Complete - Modularized
