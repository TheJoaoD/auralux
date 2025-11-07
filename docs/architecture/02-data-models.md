# Auralux Architecture - Data Models

[← Back to Overview](./00-overview.md) | [← Tech Stack](./01-tech-stack.md) | [Services →](./03-services.md)

---

## User (extends Supabase auth.users)

**Purpose:** Represents store owners/staff who use the system. Extends Supabase's built-in authentication user with store-specific metadata.

**Key Attributes:**
- `id`: UUID (PK, references auth.users.id) - Unique user identifier from Supabase Auth
- `store_name`: TEXT - Name of the retail store (optional, for branding)
- `created_at`: TIMESTAMP - Account creation timestamp
- `updated_at`: TIMESTAMP - Last profile update timestamp

**Relationships:**
- One-to-many with Customers (user owns multiple customers)
- One-to-many with Products (user owns product catalog)
- One-to-many with Sales (user creates multiple sales)
- One-to-many with Categories (user defines product categories)

**Business Rules:**
- User ID comes from Supabase Auth (not manually created)
- All user data isolated via RLS policies
- Soft delete not required (Supabase Auth handles this)

---

## Customer

**Purpose:** Represents retail customers who make purchases. Stores customer contact information and purchase history metrics.

**Key Attributes:**
- `id`: UUID (PK, default gen_random_uuid()) - Unique customer identifier
- `user_id`: UUID (FK to users.id) - Store owner who registered this customer
- `full_name`: TEXT (NOT NULL) - Customer's full name
- `whatsapp`: TEXT (NOT NULL) - WhatsApp phone number (Brazilian format)
- `email`: TEXT (NULLABLE) - Optional email address
- `address`: TEXT (NULLABLE) - Optional physical address
- `purchase_count`: INTEGER (default 0) - Total number of purchases made
- `total_purchases`: DECIMAL(10,2) (default 0.00) - Lifetime purchase amount
- `total_due`: DECIMAL(10,2) (default 0.00) - Amount owed (future installment tracking)
- `created_at`: TIMESTAMP (default now()) - Customer registration date
- `updated_at`: TIMESTAMP (default now()) - Last update timestamp

**Relationships:**
- Many-to-one with User (customer belongs to one store owner)
- One-to-many with Sales (customer can have multiple sales)

**Business Rules:**
- WhatsApp number must be validated (Brazilian format: +55 XX XXXXX-XXXX)
- purchase_count and total_purchases updated automatically on sale completion
- RLS policy ensures user sees only their customers

**Indexes:**
- Index on `user_id` for fast user-specific queries
- Index on `whatsapp` for search functionality
- Unique constraint on (user_id, whatsapp) to prevent duplicate customers per user

---

## Category

**Purpose:** Organizes products into logical groups for inventory management and reporting.

**Key Attributes:**
- `id`: UUID (PK, default gen_random_uuid()) - Unique category identifier
- `user_id`: UUID (FK to users.id) - Store owner who created this category
- `name`: TEXT (NOT NULL) - Category name (e.g., "Electronics", "Clothing")
- `description`: TEXT (NULLABLE) - Optional category description
- `created_at`: TIMESTAMP (default now()) - Creation timestamp
- `updated_at`: TIMESTAMP (default now()) - Last update timestamp

**Relationships:**
- Many-to-one with User (category belongs to one store owner)
- One-to-many with Products (category can contain multiple products)

**Business Rules:**
- Category names must be unique per user
- Deleting a category sets product.category_id to NULL (soft relationship)
- System should prevent deletion if products exist (soft delete instead)

**Indexes:**
- Index on `user_id` for fast user-specific queries
- Unique constraint on (user_id, name) to prevent duplicate category names

---

## Product

**Purpose:** Represents inventory items available for sale. Tracks pricing, stock levels, and profitability metrics.

**Key Attributes:**
- `id`: UUID (PK, default gen_random_uuid()) - Unique product identifier
- `user_id`: UUID (FK to users.id) - Store owner who manages this product
- `category_id`: UUID (FK to categories.id, NULLABLE) - Product category
- `name`: TEXT (NOT NULL) - Product name
- `sku`: TEXT (NULLABLE) - Stock Keeping Unit (optional barcode/code)
- `image_url`: TEXT (NULLABLE) - URL to product image in Supabase Storage
- `sale_price`: DECIMAL(10,2) (NOT NULL) - Price customers pay
- `cost_price`: DECIMAL(10,2) (NOT NULL) - Cost to acquire/produce the product
- `quantity`: INTEGER (NOT NULL, default 0) - Current stock quantity
- `low_stock_threshold`: INTEGER (default 5) - Alert when stock falls below this
- `supplier`: TEXT (NULLABLE) - Optional supplier information
- `created_at`: TIMESTAMP (default now()) - Product creation date
- `updated_at`: TIMESTAMP (default now()) - Last update timestamp

**Computed Fields (via SQL views or functions):**
- `profit_margin`: ((sale_price - cost_price) / sale_price) * 100 - Profit percentage
- `profit_amount`: sale_price - cost_price - Absolute profit per unit
- `is_low_stock`: quantity <= low_stock_threshold - Stock alert flag

**Relationships:**
- Many-to-one with User (product belongs to one store owner)
- Many-to-one with Category (product belongs to one category, optional)
- One-to-many with SaleItems (product can appear in multiple sales)
- One-to-many with InventoryMovements (product has movement history)

**Business Rules:**
- sale_price must be greater than or equal to cost_price (validation)
- quantity cannot be negative (constraint)
- Quantity automatically updated on sale completion
- Image upload limited to 5MB, formats: JPG, PNG, WEBP
- SKU must be unique per user (if provided)

**Indexes:**
- Index on `user_id` for fast user-specific queries
- Index on `category_id` for filtering by category
- Index on `quantity` for low stock queries
- Unique constraint on (user_id, sku) if SKU provided

---

## Sale

**Purpose:** Represents a completed sales transaction. Captures payment details and links customer to purchased products.

**Key Attributes:**
- `id`: UUID (PK, default gen_random_uuid()) - Unique sale identifier
- `user_id`: UUID (FK to users.id) - Store owner who processed the sale
- `customer_id`: UUID (FK to customers.id) - Customer who made the purchase
- `total_amount`: DECIMAL(10,2) (NOT NULL) - Total sale amount before discounts
- `payment_method`: TEXT (NOT NULL) - Payment type: 'pix', 'cash', 'installment'
- `installment_count`: INTEGER (NULLABLE) - Number of installments (1-12) if payment_method='installment'
- `actual_amount_received`: DECIMAL(10,2) (NULLABLE) - Actual amount after card fees (for installments)
- `discount_amount`: DECIMAL(10,2) (COMPUTED: total_amount - actual_amount_received) - Card processing fees
- `status`: TEXT (default 'completed') - Sale status: 'completed', 'pending', 'cancelled'
- `notes`: TEXT (NULLABLE) - Optional sale notes
- `created_at`: TIMESTAMP (default now()) - Sale completion timestamp
- `updated_at`: TIMESTAMP (default now()) - Last update timestamp

**Computed Fields:**
- `discount_percentage`: (discount_amount / total_amount) * 100 - Discount as percentage
- `profit_total`: SUM(sale_items.quantity * (unit_price - unit_cost)) - Total profit for sale

**Relationships:**
- Many-to-one with User (sale belongs to one store owner)
- Many-to-one with Customer (sale belongs to one customer)
- One-to-many with SaleItems (sale contains multiple line items)
- One-to-many with InventoryMovements (sale triggers inventory movements)

**Business Rules:**
- payment_method must be one of: 'pix', 'cash', 'installment'
- If payment_method='installment', installment_count is REQUIRED (1-12)
- If payment_method='installment', actual_amount_received is REQUIRED
- total_amount calculated from SUM(sale_items.subtotal)
- Sale creation triggers:
  - Customer.purchase_count increment
  - Customer.total_purchases increment
  - Product.quantity decrement for each item
  - InventoryMovement records creation

**Indexes:**
- Index on `user_id` for fast user-specific queries
- Index on `customer_id` for customer purchase history
- Index on `created_at` for date-range queries (dashboard metrics)
- Index on `payment_method` for payment breakdown reports

---

## SaleItem

**Purpose:** Represents individual line items within a sale. Captures product snapshots at time of sale for historical accuracy.

**Key Attributes:**
- `id`: UUID (PK, default gen_random_uuid()) - Unique line item identifier
- `sale_id`: UUID (FK to sales.id, ON DELETE CASCADE) - Parent sale
- `product_id`: UUID (FK to products.id) - Product sold (current reference)
- `product_name`: TEXT (NOT NULL) - Snapshot of product name at time of sale
- `quantity`: INTEGER (NOT NULL) - Quantity sold
- `unit_price`: DECIMAL(10,2) (NOT NULL) - Snapshot of sale_price at time of sale
- `unit_cost`: DECIMAL(10,2) (NOT NULL) - Snapshot of cost_price at time of sale
- `subtotal`: DECIMAL(10,2) (COMPUTED: quantity * unit_price) - Line item total
- `created_at`: TIMESTAMP (default now()) - Line item creation timestamp

**Computed Fields:**
- `line_profit`: quantity * (unit_price - unit_cost) - Profit for this line item
- `line_margin`: ((unit_price - unit_cost) / unit_price) * 100 - Profit margin percentage

**Relationships:**
- Many-to-one with Sale (line item belongs to one sale)
- Many-to-one with Product (line item references one product)

**Business Rules:**
- Snapshot product details (name, unit_price, unit_cost) at time of sale
- Prevents historical data corruption if product prices change later
- quantity must be positive (validation)
- Cascading delete: if sale deleted, all line items deleted

**Indexes:**
- Index on `sale_id` for fast sale detail queries
- Index on `product_id` for product sales history

---

## InventoryMovement

**Purpose:** Audit trail for all inventory changes. Tracks additions, sales, and manual adjustments for accountability and reporting.

**Key Attributes:**
- `id`: UUID (PK, default gen_random_uuid()) - Unique movement identifier
- `user_id`: UUID (FK to users.id) - Store owner who performed the movement
- `product_id`: UUID (FK to products.id) - Product affected by movement
- `movement_type`: TEXT (NOT NULL) - Type: 'addition', 'sale', 'adjustment'
- `quantity_change`: INTEGER (NOT NULL) - Quantity change (positive or negative)
- `quantity_before`: INTEGER (NOT NULL) - Product quantity before movement
- `quantity_after`: INTEGER (NOT NULL) - Product quantity after movement
- `reference_id`: UUID (NULLABLE) - Reference to related entity (sale_id if movement_type='sale')
- `notes`: TEXT (NULLABLE) - Optional movement notes (reason for adjustment)
- `created_at`: TIMESTAMP (default now()) - Movement timestamp

**Relationships:**
- Many-to-one with User (movement belongs to one store owner)
- Many-to-one with Product (movement affects one product)
- Many-to-one with Sale (optional, if movement_type='sale')

**Business Rules:**
- movement_type must be one of: 'addition', 'sale', 'adjustment'
- If movement_type='sale', reference_id MUST point to sale.id
- Immutable after creation (no updates/deletes allowed)
- Created automatically on sale completion
- Manual movements created via inventory adjustment UI

**Indexes:**
- Index on `user_id` for user-specific movement history
- Index on `product_id` for product movement history
- Index on `created_at` for date-range queries
- Index on `reference_id` for linking to sales

---

## Related Documents

- [← Tech Stack](./01-tech-stack.md)
- [Services →](./03-services.md)
- [Database Schema](./04-database-schema.md)
- [Overview](./00-overview.md)

---

**Document Version:** v1.1
**Last Updated:** 2025-11-07
**Status:** Complete - Modularized
