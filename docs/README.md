# Auralux - Documentation Index

Welcome to the Auralux project documentation. This index provides quick access to all project documents, organized by category.

---

## 📋 **Core Documents**

### Product Requirements
- **[Main PRD](./prd.md)** - Complete Product Requirements Document (Original)
- **[PRD Core](./epics/00-prd-core.md)** - Requirements, Goals, and Background
- **[UI/UX Guidelines](./epics/01-ui-ux-guidelines.md)** - Design system and color palette
- **[Technical Constraints](./epics/02-tech-constraints.md)** - Tech stack and database schema

### Architecture
- **[Architecture Overview](./architecture/00-overview.md)** - High-level architecture and patterns
- **[Complete Architecture](./architecture.md)** - Full architecture document (Original)

---

## 🏗️ **Architecture Deep Dive**

1. **[Tech Stack](./architecture/01-tech-stack.md)** - Complete technology stack with versions and rationale
2. **[Data Models](./architecture/02-data-models.md)** - 7 database entities with relationships
3. **[Services & Components](./architecture/03-services.md)** - 6 backend services and external APIs
4. **[Database Schema](./architecture/04-database-schema.md)** - PostgreSQL schema, RLS policies, indexes (stub)
5. **[Core Workflows](./architecture/05-workflows.md)** - Workflow diagrams with Mermaid (stub)
6. **[Infrastructure](./architecture/06-infrastructure.md)** - Deployment, environments, rollback (stub)
7. **[Error Handling](./architecture/07-error-handling.md)** - Logging and error strategies (stub)
8. **[Source Tree](./architecture/08-source-tree.md)** - Project file structure (stub)
9. **[Coding Standards](./architecture/09-coding-standards.md)** - Code quality and testing (stub)
10. **[Security](./architecture/10-security.md)** - Security policies and practices (stub)

> **Note:** Stub files contain summaries and line references to the complete architecture.md document.

---

## 📖 **Epics & Stories**

### Epic 1: MVP Development
- **[Epic 1: Auralux MVP](./epics/epic-01-mvp.md)** - Complete epic with 15 user stories
  - Story 1.1: Project Setup and Infrastructure
  - Story 1.2: Database Schema and Supabase Configuration
  - Story 1.3: Authentication System with Supabase
  - Story 1.4: Bottom Navigation and Layout Structure
  - Story 1.5: Customer Management - Registration and Gallery
  - Story 1.6: Product/Inventory Management - Registration and Gallery
  - Story 1.7: Category Management in Settings
  - Story 1.8: Sales Dashboard with Metrics
  - Story 1.9: New Sale Flow - Customer and Product Selection
  - Story 1.10: Payment Method Selection and Installment Handling
  - Story 1.11: Inventory Update on Sale and Movement Tracking
  - Story 1.12: PWA Configuration and Offline Capability
  - Story 1.13: Responsive Design and Mobile Optimization
  - Story 1.14: Testing and Quality Assurance
  - Story 1.15: Deployment and Production Launch

---

## 🎯 **Quick Navigation by Role**

### For Product Owners (PO)
Start here to create stories:
1. [PRD Core](./epics/00-prd-core.md) - Understand requirements
2. [Epic 1 MVP](./epics/epic-01-mvp.md) - Review all 15 stories
3. [UI/UX Guidelines](./epics/01-ui-ux-guidelines.md) - Design specifications

### For Developers (Dev)
Start here for implementation:
1. [Architecture Overview](./architecture/00-overview.md) - System design
2. [Tech Stack](./architecture/01-tech-stack.md) - Technologies and versions
3. [Data Models](./architecture/02-data-models.md) - Database entities
4. [Services](./architecture/03-services.md) - Backend services
5. [Source Tree](./architecture/08-source-tree.md) - File structure

### For Architects (Winston)
Start here for system design:
1. [Architecture Overview](./architecture/00-overview.md) - Architectural patterns
2. [Data Models](./architecture/02-data-models.md) - Entity relationships
3. [Infrastructure](./architecture/06-infrastructure.md) - Deployment strategy
4. [Complete Architecture](./architecture.md) - Full technical specification

### For QA/Testers
Start here for testing:
1. [Story 1.14: Testing](./epics/epic-01-mvp.md#story-114-testing-and-quality-assurance) - Test requirements
2. [Coding Standards](./architecture/09-coding-standards.md) - Test strategy
3. [Epic 1 Stories](./epics/epic-01-mvp.md) - Integration verification criteria

---

## 📊 **Project Statistics**

- **Total Documents:** 15 modular files
- **Original Documents:** 2 (prd.md, architecture.md)
- **User Stories:** 15 (Epic 1)
- **Database Tables:** 7
- **Backend Services:** 6
- **Functional Requirements:** 36 (FR1-FR36)
- **Non-Functional Requirements:** 16 (NFR1-NFR16)

---

## 🔄 **Document Versions**

- **PRD:** v2.1 (Modularized 2025-11-07)
- **Architecture:** v1.1 (Modularized 2025-11-07)
- **Epic 1:** v2.1 (Created 2025-11-07)

---

## 📝 **How to Use This Documentation**

### For AI Agents (Sarah, Winston, Dev)

1. **Context Loading:**
   - Load only relevant documents for your task
   - Example: Sarah creating Story 1.2 → Load `epics/epic-01-mvp.md` + `architecture/02-data-models.md`

2. **Cross-Referencing:**
   - Each document has navigation links to related docs
   - Follow links at top/bottom of each file

3. **Token Efficiency:**
   - Modular documents reduce context consumption
   - Load overview first, then drill down to specific areas

### For Developers

1. **Getting Started:**
   - Read [Architecture Overview](./architecture/00-overview.md)
   - Review [Epic 1 Stories](./epics/epic-01-mvp.md) for implementation plan
   - Check [Tech Stack](./architecture/01-tech-stack.md) for dependencies

2. **Implementation:**
   - Follow story order (1.1 → 1.15)
   - Reference [Data Models](./architecture/02-data-models.md) for database design
   - Use [Services](./architecture/03-services.md) for API structure

3. **Testing:**
   - Implement acceptance criteria from each story
   - Follow integration verification steps
   - Review [Story 1.14](./epics/epic-01-mvp.md#story-114-testing-and-quality-assurance)

---

## 🚀 **Next Steps**

1. **Product Owner:** Use Sarah (PO agent) to convert Epic 1 stories to YAML format
2. **Architect:** Review modular architecture docs for completeness
3. **Developer:** Start with Story 1.1 (Project Setup)
4. **QA:** Prepare test environment based on Story 1.14

---

## 📧 **Change Log**

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2025-11-07 | v1.0 | Initial modular documentation structure | System |
| 2025-11-07 | v1.1 | Added navigation index and cross-references | System |

---

**Documentation Status:** ✅ Complete - Ready for AI Agent Workflows

**Maintained by:** BMAD Framework + Claude Code

**Last Updated:** 2025-11-07
