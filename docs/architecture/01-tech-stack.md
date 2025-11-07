# Auralux Architecture - Tech Stack

[← Back to Overview](./00-overview.md)

---

## Cloud Infrastructure

- **Provider:** Supabase Cloud (Built on AWS)
- **Key Services:**
  - Managed PostgreSQL 15+
  - Supabase Auth (JWT-based authentication)
  - Supabase Storage (S3-compatible object storage)
  - Supabase Realtime (Change Data Capture via WebSockets)
  - Edge Functions (Deno-based serverless functions)
- **Deployment Regions:** Auto-selected by Supabase (primary: us-east-1)

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Language** | TypeScript | 5.x | Primary development language | Strong typing prevents runtime errors, excellent IDE support, team expertise, required for Next.js |
| **Runtime** | Node.js | 20.x LTS | JavaScript runtime for Next.js | LTS version, stable performance, wide ecosystem, Next.js requirement |
| **Frontend Framework** | Next.js | 16.0.0 | Full-stack React framework | Already configured, App Router for modern patterns, built-in API routes, optimized for PWA |
| **UI Framework** | React | 19.2.0 | UI component library | Latest version with concurrent features, Next.js dependency |
| **UI Components** | shadcn/ui | Latest | Component library | Already configured with 60+ components, accessible, customizable |
| **Styling** | Tailwind CSS | 4.1.9 | Utility-first CSS framework | Already configured, mobile-first, rapid development, small bundle size |
| **Backend-as-a-Service** | Supabase | Latest | Database, Auth, Storage, Realtime | Already configured via MCP, PostgreSQL-based, RLS support, reduces backend complexity |
| **Database** | PostgreSQL | 15+ (Supabase managed) | Primary database | Managed by Supabase, ACID compliance, powerful RLS, JSON support |
| **Authentication** | Supabase Auth | Latest | User authentication | Built-in with Supabase, JWT-based, session management, email/password auth |
| **File Storage** | Supabase Storage | Latest | Product image storage | Integrated with Supabase, S3-compatible, CDN support, automatic image optimization |
| **Realtime** | Supabase Realtime | Latest | Live dashboard updates | Change Data Capture, WebSocket-based, automatic reconnection |
| **State Management** | React Context API + Zustand | 4.x | Client state management | Built-in Context for auth, Zustand for complex state, minimal boilerplate |
| **Server State** | TanStack Query (React Query) | 5.x | Server state caching | Data fetching, caching, synchronization, optimistic updates |
| **Form Management** | React Hook Form | 7.x | Form handling | Already in use, excellent performance, built-in validation |
| **Validation** | Zod | 3.x | Schema validation | Already in use, TypeScript-first, runtime safety |
| **Charts** | Recharts | 2.x | Dashboard visualizations | Already in use, composable, responsive charts |
| **Icons** | Lucide React | Latest | Icon system | Already in use, consistent design, tree-shakeable |
| **Notifications** | Sonner | Latest | Toast notifications | Already in use, beautiful defaults, accessible |
| **Build Tool** | Next.js (Turbopack) | Built-in | Build and bundling | Native Next.js bundler, faster than Webpack |
| **Package Manager** | pnpm | 8.x | Dependency management | Faster than npm, disk efficient, strict by default |
| **Testing (Unit)** | Vitest | 1.x | Unit testing framework | Fast, Vite-compatible, Jest-compatible API |
| **Testing (Component)** | React Testing Library | 14.x | Component testing | User-centric testing, best practices |
| **Testing (E2E)** | Playwright | 1.x | End-to-end testing | Cross-browser, iOS Safari simulation, reliable |
| **Linting** | ESLint | 8.x | Code linting | Next.js config, TypeScript support |
| **Formatting** | Prettier | 3.x | Code formatting | Consistent style, integrates with ESLint |
| **Type Checking** | TypeScript Compiler | 5.x | Static type checking | Strict mode enabled, prevents type errors |
| **Deployment Platform** | Vercel | N/A | Hosting and CI/CD | Native Next.js support, automatic previews, edge network |
| **Environment Management** | dotenv | Built-in | Environment variables | Next.js native support, local and production configs |
| **Monitoring** | Vercel Analytics | N/A | Performance monitoring | Built-in Web Vitals tracking |
| **Error Tracking** | Sentry | 7.x | Error monitoring and tracking | Production error capture, stack traces, user context |

## CRITICAL NOTES

1. **Versions:** All versions are pinned based on current project setup. Update with caution and test thoroughly.

2. **Supabase vs Custom Backend:** Supabase was chosen for MVP speed and managed services. For scale beyond 10,000 concurrent users or complex business logic, evaluate migration to custom backend.

3. **Next.js API Routes vs Supabase Edge Functions:** Currently using Next.js API Routes for business logic. Supabase Edge Functions (Deno) are available but not primary choice to maintain consistency with TypeScript/Node.js ecosystem.

4. **PostgreSQL RLS:** Critical security feature—all database access MUST respect RLS policies. Direct database access without RLS will expose data across users.

---

## Related Documents

- [← Overview](./00-overview.md)
- [Data Models →](./02-data-models.md)
- [Services](./03-services.md)
- [Database Schema](./04-database-schema.md)

---

**Document Version:** v1.1
**Last Updated:** 2025-11-07
**Status:** Complete - Modularized
