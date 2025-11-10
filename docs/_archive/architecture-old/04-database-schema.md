# Auralux Architecture - Database Schema

[← Back to Overview](./00-overview.md) | [← Services](./03-services.md)

---

**NOTE:** Este documento contém o schema SQL completo do PostgreSQL com todas as tabelas, RLS policies, indexes, triggers, e views.

Para o schema completo, consulte as linhas 1019-1404 do arquivo `docs/architecture.md` original.

## Quick Reference

**Tables:**
1. users
2. customers
3. categories
4. products
5. sales
6. sale_items
7. inventory_movements

**Views:**
- v_daily_sales_metrics
- v_payment_method_breakdown
- v_low_stock_products
- v_top_selling_products

**Storage Buckets:**
- products (images)

---

[← Services](./03-services.md) | [Workflows →](./05-workflows.md)
