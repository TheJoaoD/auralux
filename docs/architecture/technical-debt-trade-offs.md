# Technical Debt & Trade-offs

## Accepted Trade-offs

| Decision | Trade-off | Mitigation Plan |
|----------|-----------|-----------------|
| **Shared Database** | Potential performance impact on admin queries | Monitor slow queries, add indexes, consider read replica at 10k+ users |
| **Custom Auth** | No built-in password reset, 2FA | Document manual recovery process, add 2FA in v2 if needed |
| **WhatsApp Deep Links** | No delivery confirmation | Track `catalog_orders` status manually, add webhook integration later |
| **No SMS Verification** | Potential fake signups | Rate limiting + manual admin review for first orders |
| **Monolith Architecture** | Harder to scale independently | Monitor traffic, plan microservice extraction if catalog grows 10x |
| **ISR 60s revalidation** | Stale data for up to 1 minute | Acceptable for product catalog, use on-demand revalidation for critical updates |

## Future Optimization Opportunities

1. **Edge Caching for Static Assets** (Vercel Edge Network)
2. **Database Read Replicas** (if catalog traffic >> admin traffic)
3. **WhatsApp Business API Integration** (for order confirmations)
4. **Full-text Search with PostgreSQL pg_trgm** (better than ILIKE)
5. **Image CDN with automatic transformations** (Cloudinary/ImageKit)
6. **Service Worker for offline catalog browsing**
7. **A/B testing framework for conversion optimization**

---
