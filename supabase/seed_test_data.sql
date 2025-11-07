-- ============================================
-- SEED DATA FOR AURALUX (Development/Testing)
-- ============================================
-- Run this after creating a user in Supabase Auth
-- Replace 'YOUR_USER_ID_HERE' with actual auth.users.id

-- Get the first user (or use specific UUID if known)
DO $$
DECLARE
  v_user_id uuid;
  v_category_id uuid;
  v_customer1_id uuid;
  v_customer2_id uuid;
  v_customer3_id uuid;
  v_product1_id uuid;
  v_product2_id uuid;
  v_product3_id uuid;
  v_sale_id uuid;
BEGIN
  -- Get first user from auth.users (or create test user record)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found in auth.users. Please create a user first via Supabase Auth.';
  END IF;

  -- Create user profile if not exists
  INSERT INTO users (id, store_name)
  VALUES (v_user_id, 'Loja Auralux - Teste')
  ON CONFLICT (id) DO UPDATE SET store_name = 'Loja Auralux - Teste';

  RAISE NOTICE 'Using user_id: %', v_user_id;

  -- ============================================
  -- CATEGORIES
  -- ============================================
  INSERT INTO categories (id, user_id, name, description)
  VALUES
    (gen_random_uuid(), v_user_id, 'Bolsas', 'Bolsas de luxo e acessórios'),
    (gen_random_uuid(), v_user_id, 'Sapatos', 'Calçados femininos premium'),
    (gen_random_uuid(), v_user_id, 'Acessórios', 'Acessórios diversos')
  RETURNING id INTO v_category_id; -- Pega o último ID

  -- ============================================
  -- CUSTOMERS
  -- ============================================
  INSERT INTO customers (id, user_id, full_name, whatsapp, email, address)
  VALUES
    (gen_random_uuid(), v_user_id, 'Ana Silva', '+5511987654321', 'ana.silva@email.com', 'Rua das Flores, 123 - São Paulo/SP'),
    (gen_random_uuid(), v_user_id, 'Beatriz Santos', '+5511976543210', 'beatriz@email.com', 'Av. Paulista, 1000 - São Paulo/SP'),
    (gen_random_uuid(), v_user_id, 'Carla Oliveira', '+5511965432109', 'carla.oliveira@email.com', 'Rua Augusta, 500 - São Paulo/SP'),
    (gen_random_uuid(), v_user_id, 'Daniela Costa', '+5511954321098', 'daniela@email.com', 'Rua Oscar Freire, 200 - São Paulo/SP'),
    (gen_random_uuid(), v_user_id, 'Eduarda Pereira', '+5511943210987', 'eduarda@email.com', 'Av. Brasil, 300 - São Paulo/SP')
  RETURNING id INTO v_customer1_id; -- Pega o último ID

  -- Pegar IDs específicos para usar nas vendas
  SELECT id INTO v_customer1_id FROM customers WHERE user_id = v_user_id AND full_name = 'Ana Silva';
  SELECT id INTO v_customer2_id FROM customers WHERE user_id = v_user_id AND full_name = 'Beatriz Santos';
  SELECT id INTO v_customer3_id FROM customers WHERE user_id = v_user_id AND full_name = 'Carla Oliveira';

  -- ============================================
  -- PRODUCTS
  -- ============================================
  INSERT INTO products (id, user_id, category_id, name, sku, sale_price, cost_price, quantity, low_stock_threshold)
  VALUES
    (gen_random_uuid(), v_user_id, v_category_id, 'Bolsa Prada Saffiano', 'PRADA-001', 8500.00, 5000.00, 3, 2),
    (gen_random_uuid(), v_user_id, v_category_id, 'Bolsa Louis Vuitton Neverfull', 'LV-002', 12000.00, 7000.00, 5, 2),
    (gen_random_uuid(), v_user_id, v_category_id, 'Bolsa Gucci Marmont', 'GUCCI-003', 9500.00, 5500.00, 2, 2),
    (gen_random_uuid(), v_user_id, v_category_id, 'Sapato Jimmy Choo', 'JC-004', 4500.00, 2500.00, 8, 3),
    (gen_random_uuid(), v_user_id, v_category_id, 'Sapato Christian Louboutin', 'CL-005', 6000.00, 3500.00, 4, 2),
    (gen_random_uuid(), v_user_id, v_category_id, 'Carteira Hermès', 'HERMES-006', 3500.00, 2000.00, 10, 3),
    (gen_random_uuid(), v_user_id, v_category_id, 'Cinto Ferragamo', 'FERR-007', 2500.00, 1500.00, 15, 5),
    (gen_random_uuid(), v_user_id, v_category_id, 'Óculos Dior', 'DIOR-008', 3200.00, 1800.00, 12, 4),
    (gen_random_uuid(), v_user_id, v_category_id, 'Relógio Cartier', 'CART-009', 25000.00, 15000.00, 2, 1),
    (gen_random_uuid(), v_user_id, v_category_id, 'Bolsa Chanel Classic', 'CHANEL-010', 15000.00, 9000.00, 1, 1)
  RETURNING id INTO v_product1_id;

  -- Pegar IDs específicos para usar nas vendas
  SELECT id INTO v_product1_id FROM products WHERE user_id = v_user_id AND sku = 'PRADA-001';
  SELECT id INTO v_product2_id FROM products WHERE user_id = v_user_id AND sku = 'LV-002';
  SELECT id INTO v_product3_id FROM products WHERE user_id = v_user_id AND sku = 'JC-004';

  -- ============================================
  -- SALES (Exemplos)
  -- ============================================

  -- Venda 1: Ana Silva - Bolsa Prada (PIX)
  INSERT INTO sales (id, user_id, customer_id, total_amount, payment_method, installment_count, status)
  VALUES (gen_random_uuid(), v_user_id, v_customer1_id, 8500.00, 'pix', 1, 'completed')
  RETURNING id INTO v_sale_id;

  INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, unit_cost)
  VALUES (v_sale_id, v_product1_id, 'Bolsa Prada Saffiano', 1, 8500.00, 5000.00);

  -- Venda 2: Beatriz Santos - Louis Vuitton (Parcelado 3x)
  INSERT INTO sales (id, user_id, customer_id, total_amount, payment_method, installment_count, actual_amount_received, status)
  VALUES (gen_random_uuid(), v_user_id, v_customer2_id, 12000.00, 'installment', 3, 11500.00, 'completed')
  RETURNING id INTO v_sale_id;

  INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, unit_cost)
  VALUES (v_sale_id, v_product2_id, 'Bolsa Louis Vuitton Neverfull', 1, 12000.00, 7000.00);

  -- Venda 3: Carla Oliveira - 2 Sapatos Jimmy Choo (Dinheiro)
  INSERT INTO sales (id, user_id, customer_id, total_amount, payment_method, installment_count, status)
  VALUES (gen_random_uuid(), v_user_id, v_customer3_id, 9000.00, 'cash', 1, 'completed')
  RETURNING id INTO v_sale_id;

  INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, unit_cost)
  VALUES (v_sale_id, v_product3_id, 'Sapato Jimmy Choo', 2, 4500.00, 2500.00);

  RAISE NOTICE '✅ Seed data inserted successfully!';
  RAISE NOTICE 'Created: 3 categories, 5 customers, 10 products, 3 sales';

END $$;
