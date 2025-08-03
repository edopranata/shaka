# 🗄️ Shaka POS - Enhanced Database Schema Documentation

## 📋 Overview
Dokumentasi lengkap struktur database untuk aplikasi Shaka POS dengan implementasi FIFO (First In First Out) inventory costing, supplier management, dan advanced features untuk future development.

**Last Updated:** August 3, 2025  
**Version:** v3.0 (Enhanced with Future Features Roadmap)  
**Database Engine:** MySQL 8.0+ / PostgreSQL 13+  
**Development Timeline:** MVP (Sprint 1-6) + Advanced Features (Sprint 7-14)

---

## 🏗️ Database Architecture

### 🎯 **Design Principles:**
- **FIFO Implementation:** Batch tracking untuk accurate cost calculation
- **Audit Trail:** Complete traceability untuk semua stock movements
- **Scalability:** Support untuk multi-store dan multi-warehouse
- **Performance:** Optimized indexing untuk high-frequency operations
- **Data Integrity:** Foreign keys dan constraints untuk data consistency

### 📊 **Enhanced Schema Overview:**
```
🏗️ MVP Foundation (Sprint 1-6):
├── Authentication & Users (Sprint 1) ✅
│   ├── users, roles, permissions
│   ├── user_profiles, activity_logs
├── Master Data (Sprint 2) 🔄
│   ├── suppliers, categories, units
│   ├── products, product_units, product_images
│   ├── product_batches, stock_movements
├── Purchase Management (Sprint 3) 🔄
│   ├── purchases, purchase_items
│   ├── fifo_transactions
├── Sales & POS (Sprint 4) 🔄
│   ├── customers, transactions, transaction_items
│   ├── payments, transaction_costs
├── Store & Location (Sprint 5) 🔄
│   ├── stores, locations, user_stores
│   ├── location_stocks
├── Reporting & Analytics (Sprint 6) 🔄
│   ├── Views dan materialized views untuk reporting

🚀 Advanced Features Roadmap (Sprint 7-14):
├── Customer Excellence (Sprint 7-8) 📈
│   ├── customer_tiers, customer_points_transactions
│   ├── customer_referrals, promotions, promotion_products
│   ├── promotion_usages
├── Inventory Intelligence (Sprint 9-10) 🤖
│   ├── demand_forecasts, supplier_performance_metrics
│   ├── auto_reorder_rules, stock_aging_snapshots
├── Business Intelligence (Sprint 9-10) 📊
│   ├── business_kpis, sales_analytics_daily
│   ├── customer_behavior_patterns
├── Financial Integration (Sprint 11-12) 💰
│   ├── chart_of_accounts, journal_entries
│   ├── journal_entry_lines, tax_rates
├── E-commerce Platform (Sprint 11-12) 🛒
│   ├── ecommerce_platforms, ecommerce_product_listings
│   ├── ecommerce_orders
├── IoT & Analytics (Sprint 13-14) 🔮
│   ├── iot_devices, iot_sensor_readings
│   ├── scan_logs, ml_models, ml_predictions
```

---

## 📁 **Table Structure by Module**

### 🔐 **1. Authentication & User Management (Sprint 1 - Complete)**

#### `users`
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_active (is_active)
);
```

#### `user_profiles`
```sql
CREATE TABLE user_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profiles_user (user_id)
);
```

#### `roles`, `permissions`, `model_has_roles`, etc.
```sql
-- Spatie Laravel Permission tables
-- Auto-generated dari package, tidak perlu custom modification
```

#### `activity_logs`
```sql
CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    action VARCHAR(100) NOT NULL,
    model_type VARCHAR(100),
    model_id BIGINT UNSIGNED,
    changes JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_activity_user (user_id),
    INDEX idx_activity_model (model_type, model_id),
    INDEX idx_activity_action (action),
    INDEX idx_activity_created (created_at)
);
```

---

### 🏪 **2. Supplier Management (Sprint 2)**

#### `suppliers`
```sql
CREATE TABLE suppliers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    tax_number VARCHAR(50),
    payment_terms INTEGER DEFAULT 30, -- days
    credit_limit DECIMAL(15,2) DEFAULT 0,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_suppliers_code (code),
    INDEX idx_suppliers_name (name),
    INDEX idx_suppliers_status (status),
    INDEX idx_suppliers_city (city)
);
```

---

### 📦 **3. Product Management (Sprint 2)**

#### `categories`
```sql
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id BIGINT UNSIGNED NULL,
    image VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_categories_parent (parent_id),
    INDEX idx_categories_active (is_active),
    INDEX idx_categories_sort (sort_order)
);
```

#### `units`
```sql
CREATE TABLE units (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    conversion_factor DECIMAL(10,4) DEFAULT 1.0000,
    base_unit_id BIGINT UNSIGNED NULL,
    is_base_unit BOOLEAN DEFAULT FALSE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (base_unit_id) REFERENCES units(id) ON DELETE SET NULL,
    UNIQUE KEY uk_units_symbol (symbol),
    INDEX idx_units_base (base_unit_id),
    INDEX idx_units_active (is_active)
);
```

#### `products`
```sql
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT UNSIGNED,
    brand VARCHAR(100),
    minimum_stock INTEGER DEFAULT 0,
    maximum_stock INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    shelf_life_days INTEGER, -- untuk expiry calculation
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    track_stock BOOLEAN DEFAULT TRUE,
    allow_negative_stock BOOLEAN DEFAULT FALSE,
    weight DECIMAL(8,3), -- kg
    dimensions VARCHAR(50), -- format: "L x W x H"
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    UNIQUE KEY uk_products_sku (sku),
    UNIQUE KEY uk_products_barcode (barcode),
    INDEX idx_products_category (category_id),
    INDEX idx_products_name (name),
    INDEX idx_products_active (is_active),
    INDEX idx_products_track_stock (track_stock),
    FULLTEXT idx_products_search (name, description, sku, barcode)
);
```

#### `product_units`
```sql
CREATE TABLE product_units (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    conversion_factor DECIMAL(10,4) NOT NULL DEFAULT 1.0000,
    cost_price DECIMAL(15,2) DEFAULT 0,
    selling_price DECIMAL(15,2) NOT NULL,
    wholesale_price DECIMAL(15,2),
    member_price DECIMAL(15,2),
    is_base_unit BOOLEAN DEFAULT FALSE,
    barcode VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    UNIQUE KEY uk_product_units (product_id, unit_id),
    UNIQUE KEY uk_product_unit_barcode (barcode),
    INDEX idx_product_units_product (product_id),
    INDEX idx_product_units_base (is_base_unit),
    INDEX idx_product_units_active (is_active)
);
```

#### `product_images`
```sql
CREATE TABLE product_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    file_size INTEGER, -- bytes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_images_product (product_id),
    INDEX idx_product_images_primary (is_primary),
    INDEX idx_product_images_sort (sort_order)
);
```

---

### 📊 **4. FIFO Inventory System (Sprint 2-3)**

#### `product_batches`
```sql
CREATE TABLE product_batches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    supplier_id BIGINT UNSIGNED,
    purchase_id BIGINT UNSIGNED,
    batch_number VARCHAR(100) NOT NULL,
    initial_quantity DECIMAL(12,4) NOT NULL,
    current_quantity DECIMAL(12,4) NOT NULL,
    reserved_quantity DECIMAL(12,4) DEFAULT 0,
    unit_cost DECIMAL(15,4) NOT NULL,
    total_cost DECIMAL(15,2) NOT NULL,
    manufactured_date DATE,
    expiry_date DATE,
    received_date DATE NOT NULL,
    status ENUM('active', 'expired', 'sold_out', 'damaged') DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    UNIQUE KEY uk_batch_number (product_id, batch_number),
    INDEX idx_batches_product (product_id),
    INDEX idx_batches_supplier (supplier_id),
    INDEX idx_batches_expiry (expiry_date),
    INDEX idx_batches_status (status),
    INDEX idx_batches_quantity (current_quantity),
    INDEX idx_batches_fifo (product_id, received_date, id) -- FIFO ordering
);
```

#### `stock_movements`
```sql
CREATE TABLE stock_movements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    batch_id BIGINT UNSIGNED,
    location_id BIGINT UNSIGNED,
    movement_type ENUM('in', 'out', 'transfer', 'adjustment') NOT NULL,
    reference_type VARCHAR(100), -- 'purchase', 'sale', 'adjustment', 'transfer'
    reference_id BIGINT UNSIGNED,
    quantity DECIMAL(12,4) NOT NULL, -- positive for in, negative for out
    unit_cost DECIMAL(15,4),
    total_cost DECIMAL(15,2),
    balance_after DECIMAL(12,4),
    notes TEXT,
    created_by BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES product_batches(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_movements_product (product_id),
    INDEX idx_movements_batch (batch_id),
    INDEX idx_movements_type (movement_type),
    INDEX idx_movements_reference (reference_type, reference_id),
    INDEX idx_movements_created (created_at),
    INDEX idx_movements_location (location_id)
);
```

#### `fifo_transactions`
```sql
CREATE TABLE fifo_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    transaction_type ENUM('purchase', 'sale', 'adjustment', 'transfer') NOT NULL,
    reference_id BIGINT UNSIGNED NOT NULL,
    batch_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(12,4) NOT NULL,
    unit_cost DECIMAL(15,4) NOT NULL,
    total_cost DECIMAL(15,2) NOT NULL,
    remaining_quantity_after DECIMAL(12,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES product_batches(id) ON DELETE CASCADE,
    INDEX idx_fifo_product (product_id),
    INDEX idx_fifo_batch (batch_id),
    INDEX idx_fifo_reference (transaction_type, reference_id),
    INDEX idx_fifo_created (created_at)
);
```

---

### 🛒 **5. Purchase Management (Sprint 3)**

#### `purchases`
```sql
CREATE TABLE purchases (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    purchase_number VARCHAR(100) UNIQUE NOT NULL,
    supplier_id BIGINT UNSIGNED NOT NULL,
    supplier_invoice VARCHAR(100),
    purchase_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    status ENUM('draft', 'pending', 'approved', 'received', 'completed', 'cancelled') DEFAULT 'draft',
    payment_status ENUM('unpaid', 'partial', 'paid', 'overpaid') DEFAULT 'unpaid',
    notes TEXT,
    approved_by BIGINT UNSIGNED,
    approved_at TIMESTAMP NULL,
    received_by BIGINT UNSIGNED,
    received_at TIMESTAMP NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_purchase_number (purchase_number),
    INDEX idx_purchases_supplier (supplier_id),
    INDEX idx_purchases_date (purchase_date),
    INDEX idx_purchases_status (status),
    INDEX idx_purchases_payment_status (payment_status),
    INDEX idx_purchases_created_by (created_by)
);
```

#### `purchase_items`
```sql
CREATE TABLE purchase_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    purchase_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(12,4) NOT NULL,
    unit_cost DECIMAL(15,4) NOT NULL,
    total_cost DECIMAL(15,2) NOT NULL,
    received_quantity DECIMAL(12,4) DEFAULT 0,
    batch_number VARCHAR(100),
    expiry_date DATE,
    manufactured_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT,
    INDEX idx_purchase_items_purchase (purchase_id),
    INDEX idx_purchase_items_product (product_id),
    INDEX idx_purchase_items_expiry (expiry_date)
);
```

---

### 💰 **6. Sales & POS System (Sprint 4)**

#### `customers`
```sql
CREATE TABLE customers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    date_of_birth DATE,
    customer_type ENUM('guest', 'regular', 'member', 'wholesale') DEFAULT 'regular',
    member_card_number VARCHAR(50) UNIQUE,
    credit_limit DECIMAL(15,2) DEFAULT 0,
    points_balance INTEGER DEFAULT 0,
    total_purchases DECIMAL(15,2) DEFAULT 0,
    last_purchase_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_customer_code (customer_code),
    UNIQUE KEY uk_member_card (member_card_number),
    INDEX idx_customers_type (customer_type),
    INDEX idx_customers_phone (phone),
    INDEX idx_customers_active (is_active),
    FULLTEXT idx_customers_search (name, phone, email)
);
```

#### `transactions`
```sql
CREATE TABLE transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transaction_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED NOT NULL, -- cashier
    location_id BIGINT UNSIGNED,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_cost DECIMAL(15,2) DEFAULT 0, -- COGS from FIFO
    gross_profit DECIMAL(15,2) DEFAULT 0,
    payment_method ENUM('cash', 'card', 'transfer', 'qris', 'split') DEFAULT 'cash',
    payment_status ENUM('pending', 'paid', 'partial', 'refunded') DEFAULT 'pending',
    status ENUM('draft', 'completed', 'cancelled', 'refunded') DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_transaction_number (transaction_number),
    INDEX idx_transactions_customer (customer_id),
    INDEX idx_transactions_user (user_id),
    INDEX idx_transactions_date (transaction_date),
    INDEX idx_transactions_status (status),
    INDEX idx_transactions_payment_status (payment_status),
    INDEX idx_transactions_location (location_id)
);
```

#### `transaction_items`
```sql
CREATE TABLE transaction_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transaction_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(12,4) NOT NULL,
    unit_price DECIMAL(15,4) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    unit_cost DECIMAL(15,4) DEFAULT 0, -- FIFO cost
    total_cost DECIMAL(15,2) DEFAULT 0, -- FIFO total cost
    item_profit DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT,
    INDEX idx_transaction_items_transaction (transaction_id),
    INDEX idx_transaction_items_product (product_id)
);
```

#### `transaction_costs`
```sql
CREATE TABLE transaction_costs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transaction_item_id BIGINT UNSIGNED NOT NULL,
    batch_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(12,4) NOT NULL,
    unit_cost DECIMAL(15,4) NOT NULL,
    total_cost DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (transaction_item_id) REFERENCES transaction_items(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES product_batches(id) ON DELETE RESTRICT,
    INDEX idx_transaction_costs_item (transaction_item_id),
    INDEX idx_transaction_costs_batch (batch_id)
);
```

#### `payments`
```sql
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transaction_id BIGINT UNSIGNED NOT NULL,
    payment_method ENUM('cash', 'card', 'transfer', 'qris', 'points') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    INDEX idx_payments_transaction (transaction_id),
    INDEX idx_payments_method (payment_method),
    INDEX idx_payments_reference (reference_number)
);
```

---

### 🏬 **7. Store & Location Management (Sprint 5)**

#### `stores`
```sql
CREATE TABLE stores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    tax_number VARCHAR(50),
    is_main_store BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    currency VARCHAR(3) DEFAULT 'IDR',
    logo VARCHAR(255),
    receipt_header TEXT,
    receipt_footer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_store_code (code),
    INDEX idx_stores_active (is_active),
    INDEX idx_stores_main (is_main_store)
);
```

#### `locations`
```sql
CREATE TABLE locations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location_type ENUM('warehouse', 'showroom', 'storage', 'damaged') DEFAULT 'warehouse',
    is_sellable BOOLEAN DEFAULT TRUE,
    is_purchasable BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY uk_location_code (store_id, code),
    INDEX idx_locations_store (store_id),
    INDEX idx_locations_type (location_type),
    INDEX idx_locations_sellable (is_sellable),
    INDEX idx_locations_active (is_active)
);
```

#### `location_stocks`
```sql
CREATE TABLE location_stocks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    location_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    batch_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(12,4) NOT NULL DEFAULT 0,
    reserved_quantity DECIMAL(12,4) NOT NULL DEFAULT 0,
    available_quantity DECIMAL(12,4) GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    last_movement_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES product_batches(id) ON DELETE CASCADE,
    UNIQUE KEY uk_location_stock (location_id, product_id, batch_id),
    INDEX idx_location_stocks_location (location_id),
    INDEX idx_location_stocks_product (product_id),
    INDEX idx_location_stocks_batch (batch_id),
    INDEX idx_location_stocks_quantity (quantity),
    INDEX idx_location_stocks_available (available_quantity)
);
```

#### `user_stores`
```sql
CREATE TABLE user_stores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    store_id BIGINT UNSIGNED NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_store (user_id, store_id),
    INDEX idx_user_stores_user (user_id),
    INDEX idx_user_stores_store (store_id)
);
```

---

## 📊 **8. Reporting Views & Materialized Tables (Sprint 6)**

### **Stock Summary View**
```sql
CREATE VIEW v_stock_summary AS
SELECT 
    p.id as product_id,
    p.sku,
    p.name as product_name,
    c.name as category_name,
    SUM(pb.current_quantity) as total_quantity,
    AVG(pb.unit_cost) as avg_cost,
    SUM(pb.current_quantity * pb.unit_cost) as total_value,
    MIN(pb.expiry_date) as nearest_expiry,
    COUNT(CASE WHEN pb.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as expiring_batches
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_batches pb ON p.id = pb.product_id AND pb.status = 'active'
WHERE p.is_active = TRUE
GROUP BY p.id, p.sku, p.name, c.name;
```

### **FIFO Cost Analysis View**
```sql
CREATE VIEW v_fifo_cost_analysis AS
SELECT 
    ti.transaction_id,
    ti.product_id,
    p.name as product_name,
    ti.quantity,
    ti.unit_price,
    ti.total_price,
    SUM(tc.total_cost) as total_cost,
    (ti.total_price - SUM(tc.total_cost)) as gross_profit,
    ((ti.total_price - SUM(tc.total_cost)) / ti.total_price * 100) as margin_percentage
FROM transaction_items ti
JOIN products p ON ti.product_id = p.id
LEFT JOIN transaction_costs tc ON ti.id = tc.transaction_item_id
GROUP BY ti.id, ti.transaction_id, ti.product_id, p.name, ti.quantity, ti.unit_price, ti.total_price;
```

---

## 🔧 **Indexes & Performance Optimization**

### **Critical Indexes for FIFO Performance:**
```sql
-- FIFO batch selection optimization
CREATE INDEX idx_fifo_selection ON product_batches (product_id, status, received_date, id);

-- Stock movement tracking
CREATE INDEX idx_stock_movements_tracking ON stock_movements (product_id, created_at DESC);

-- Transaction cost calculation
CREATE INDEX idx_transaction_costs_calc ON transaction_costs (transaction_item_id, batch_id);

-- Expiry date monitoring
CREATE INDEX idx_expiry_monitoring ON product_batches (expiry_date, status) WHERE status = 'active';
```

### **Composite Indexes:**
```sql
-- Product search optimization
CREATE INDEX idx_product_search ON products (is_active, track_stock, category_id);

-- Transaction reporting
CREATE INDEX idx_transaction_reporting ON transactions (transaction_date, status, location_id);

-- Supplier performance
CREATE INDEX idx_supplier_performance ON purchases (supplier_id, purchase_date, status);
```

---

## 🔒 **Constraints & Data Integrity**

### **Check Constraints:**
```sql
-- Ensure positive quantities
ALTER TABLE product_batches ADD CONSTRAINT chk_batch_quantity 
CHECK (initial_quantity >= 0 AND current_quantity >= 0 AND current_quantity <= initial_quantity);

-- Ensure logical pricing
ALTER TABLE product_units ADD CONSTRAINT chk_pricing 
CHECK (selling_price >= 0 AND cost_price >= 0);

-- Ensure valid dates
ALTER TABLE product_batches ADD CONSTRAINT chk_batch_dates 
CHECK (expiry_date IS NULL OR expiry_date >= received_date);
```

### **Triggers for FIFO Maintenance:**
```sql
-- Update batch quantities after stock movement
DELIMITER //
CREATE TRIGGER tr_update_batch_quantity 
AFTER INSERT ON stock_movements
FOR EACH ROW
BEGIN
    IF NEW.batch_id IS NOT NULL THEN
        UPDATE product_batches 
        SET current_quantity = current_quantity + NEW.quantity,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.batch_id;
    END IF;
END//
DELIMITER ;
```

---

## 📈 **Database Size Estimations**

### **Expected Data Volume (1 Year):**
| Table | Estimated Rows | Storage Size |
|-------|---------------|--------------|
| products | 10,000 | ~15 MB |
| product_batches | 50,000 | ~25 MB |
| transactions | 100,000 | ~45 MB |
| transaction_items | 500,000 | ~150 MB |
| stock_movements | 1,000,000 | ~200 MB |
| fifo_transactions | 500,000 | ~100 MB |
| **Total Estimated** | | **~535 MB** |

### **Performance Targets:**
- **FIFO Cost Calculation:** < 100ms per transaction
- **Stock Lookup:** < 50ms per product
- **Batch Selection:** < 25ms per FIFO operation
- **Report Generation:** < 5s untuk monthly reports

---

## 🛠️ **Migration Strategy**

### **Phase 1: Foundation (Sprint 2)**
1. Core tables: suppliers, enhanced products, categories, units
2. Basic FIFO tables: product_batches, stock_movements
3. Essential indexes dan constraints

### **Phase 2: FIFO Implementation (Sprint 3)**
1. Purchase management tables
2. FIFO transaction tracking
3. Advanced indexes dan triggers

### **Phase 3: Sales Integration (Sprint 4)**
1. Enhanced transaction tables dengan cost tracking
2. Performance optimization indexes
3. Reporting views preparation

### **Phase 4: Multi-location (Sprint 5)**
1. Store dan location tables
2. Location-based stock tracking
3. Final performance tuning

---

## 🚀 **ADVANCED FEATURES DATABASE SCHEMA** (Sprint 7-14)

### 🎯 **9. Customer Excellence System (Sprint 7-8)**

#### `customer_tiers`
```sql
CREATE TABLE customer_tiers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    min_points INTEGER DEFAULT 0,
    min_purchases_amount DECIMAL(15,2) DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    benefits JSON, -- Store tier benefits as JSON
    tier_color VARCHAR(7) DEFAULT '#000000', -- Hex color for UI
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer_tiers_active (is_active),
    INDEX idx_customer_tiers_points (min_points)
);
```

#### `customer_points_transactions`
```sql
CREATE TABLE customer_points_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    transaction_id BIGINT UNSIGNED,
    transaction_type ENUM('earn', 'redeem', 'expire', 'adjustment', 'bonus') NOT NULL,
    points INTEGER NOT NULL,
    description VARCHAR(255),
    expires_at DATE,
    is_expired BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
    INDEX idx_points_customer (customer_id),
    INDEX idx_points_expiry (expires_at),
    INDEX idx_points_type (transaction_type),
    INDEX idx_points_expired (is_expired)
);
```

#### `customer_referrals`
```sql
CREATE TABLE customer_referrals (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    referrer_id BIGINT UNSIGNED NOT NULL,
    referred_id BIGINT UNSIGNED NOT NULL,
    referral_code VARCHAR(50) UNIQUE,
    status ENUM('pending', 'completed', 'expired', 'cancelled') DEFAULT 'pending',
    referrer_reward_points INTEGER DEFAULT 0,
    referred_reward_points INTEGER DEFAULT 0,
    minimum_purchase_amount DECIMAL(15,2) DEFAULT 0,
    completed_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (referrer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_id) REFERENCES customers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_referral_pair (referrer_id, referred_id),
    INDEX idx_referrals_code (referral_code),
    INDEX idx_referrals_status (status)
);
```

#### `promotions`
```sql
CREATE TABLE promotions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE,
    description TEXT,
    promotion_type ENUM('percentage', 'fixed_amount', 'buy_x_get_y', 'bundle', 'tier_based', 'cashback') NOT NULL,
    discount_value DECIMAL(15,2),
    min_purchase_amount DECIMAL(15,2) DEFAULT 0,
    max_discount_amount DECIMAL(15,2),
    usage_limit_per_customer INTEGER,
    total_usage_limit INTEGER,
    current_usage_count INTEGER DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    applicable_days JSON, -- [1,2,3,4,5] for Mon-Fri
    applicable_hours JSON, -- [{"start": "09:00", "end": "17:00"}]
    customer_tiers JSON, -- Applicable customer tiers
    location_ids JSON, -- Applicable store locations
    auto_apply BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_promotions_code (code),
    INDEX idx_promotions_dates (start_date, end_date),
    INDEX idx_promotions_active (is_active),
    INDEX idx_promotions_type (promotion_type),
    INDEX idx_promotions_auto (auto_apply)
);
```

#### `promotion_products`
```sql
CREATE TABLE promotion_products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    promotion_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED,
    category_id BIGINT UNSIGNED,
    inclusion_type ENUM('include', 'exclude') DEFAULT 'include',
    min_quantity INTEGER DEFAULT 1,
    buy_quantity INTEGER DEFAULT 1, -- For buy X get Y promotions
    get_quantity INTEGER DEFAULT 0, -- For buy X get Y promotions
    
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_promo_products_promotion (promotion_id),
    INDEX idx_promo_products_product (product_id),
    INDEX idx_promo_products_category (category_id)
);
```

#### `promotion_usages`
```sql
CREATE TABLE promotion_usages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    promotion_id BIGINT UNSIGNED NOT NULL,
    transaction_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED,
    discount_amount DECIMAL(15,2) NOT NULL,
    cashback_amount DECIMAL(15,2) DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    INDEX idx_promo_usage_promotion (promotion_id),
    INDEX idx_promo_usage_customer (customer_id),
    INDEX idx_promo_usage_date (used_at)
);
```

### 🤖 **10. Inventory Intelligence System (Sprint 9-10)**

#### `demand_forecasts`
```sql
CREATE TABLE demand_forecasts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    location_id BIGINT UNSIGNED,
    forecast_date DATE NOT NULL,
    forecast_period ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily',
    predicted_demand DECIMAL(12,4) NOT NULL,
    confidence_level DECIMAL(5,2), -- 0-100%
    seasonal_factor DECIMAL(8,4) DEFAULT 1.0000,
    trend_factor DECIMAL(8,4) DEFAULT 1.0000,
    promotional_impact DECIMAL(8,4) DEFAULT 1.0000,
    weather_impact DECIMAL(8,4) DEFAULT 1.0000,
    forecast_method ENUM('moving_average', 'exponential_smoothing', 'linear_regression', 'seasonal_decomposition', 'neural_network') NOT NULL,
    model_accuracy DECIMAL(5,2), -- Historical accuracy %
    actual_demand DECIMAL(12,4), -- Filled after actual data available
    forecast_error DECIMAL(12,4), -- Calculated after actual data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    UNIQUE KEY uk_demand_forecast (product_id, location_id, forecast_date, forecast_period),
    INDEX idx_forecasts_date (forecast_date),
    INDEX idx_forecasts_product (product_id),
    INDEX idx_forecasts_accuracy (model_accuracy)
);
```

#### `supplier_performance_metrics`
```sql
CREATE TABLE supplier_performance_metrics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    supplier_id BIGINT UNSIGNED NOT NULL,
    month_year DATE NOT NULL, -- First day of month
    total_orders INTEGER DEFAULT 0,
    completed_orders INTEGER DEFAULT 0,
    on_time_deliveries INTEGER DEFAULT 0,
    early_deliveries INTEGER DEFAULT 0,
    late_deliveries INTEGER DEFAULT 0,
    quality_score DECIMAL(5,2) DEFAULT 0, -- 0-100%
    avg_delivery_days DECIMAL(8,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    return_rate DECIMAL(5,2) DEFAULT 0, -- 0-100%
    defect_rate DECIMAL(5,2) DEFAULT 0, -- 0-100%
    communication_score DECIMAL(5,2) DEFAULT 0, -- 0-100%
    overall_rating DECIMAL(3,1) DEFAULT 0, -- 0-5 stars
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_supplier_month (supplier_id, month_year),
    INDEX idx_supplier_performance_date (month_year),
    INDEX idx_supplier_performance_rating (overall_rating)
);
```

#### `auto_reorder_rules`
```sql
CREATE TABLE auto_reorder_rules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    location_id BIGINT UNSIGNED,
    supplier_id BIGINT UNSIGNED NOT NULL,
    rule_name VARCHAR(255),
    trigger_level DECIMAL(12,4) NOT NULL,
    reorder_quantity DECIMAL(12,4) NOT NULL,
    max_stock_level DECIMAL(12,4),
    lead_time_days INTEGER DEFAULT 7,
    safety_stock_days INTEGER DEFAULT 3,
    min_order_quantity DECIMAL(12,4) DEFAULT 1,
    order_multiple DECIMAL(12,4) DEFAULT 1, -- Round up to nearest multiple
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    seasonal_adjustment BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_triggered_at TIMESTAMP NULL,
    next_check_at TIMESTAMP NULL,
    auto_approve BOOLEAN DEFAULT FALSE,
    approval_threshold DECIMAL(15,2), -- Auto-approve if under this amount
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_reorder_rule (product_id, location_id),
    INDEX idx_reorder_active (is_active),
    INDEX idx_reorder_next_check (next_check_at),
    INDEX idx_reorder_priority (priority)
);
```

#### `stock_aging_snapshots`
```sql
CREATE TABLE stock_aging_snapshots (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    snapshot_date DATE NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    batch_id BIGINT UNSIGNED NOT NULL,
    location_id BIGINT UNSIGNED,
    quantity_on_date DECIMAL(12,4) NOT NULL,
    days_in_stock INTEGER NOT NULL,
    aging_category ENUM('0-30', '31-60', '61-90', '91-180', '180+', 'expired') NOT NULL,
    unit_cost DECIMAL(15,4) NOT NULL,
    total_value DECIMAL(15,2) NOT NULL,
    market_value DECIMAL(15,2), -- Current market value
    depreciation_rate DECIMAL(5,2), -- Monthly depreciation %
    recommended_action ENUM('none', 'promote', 'discount', 'liquidate', 'dispose') DEFAULT 'none',
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES product_batches(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    INDEX idx_aging_snapshot_date (snapshot_date),
    INDEX idx_aging_category (aging_category),
    INDEX idx_aging_action (recommended_action),
    INDEX idx_aging_product_date (product_id, snapshot_date)
);
```

### 📊 **11. Business Intelligence System (Sprint 9-10)**

#### `business_kpis`
```sql
CREATE TABLE business_kpis (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kpi_name VARCHAR(100) NOT NULL,
    kpi_category ENUM('sales', 'inventory', 'customer', 'financial', 'operational', 'quality', 'efficiency') NOT NULL,
    measurement_date DATE NOT NULL,
    measurement_period ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly') NOT NULL,
    current_value DECIMAL(15,4) NOT NULL,
    target_value DECIMAL(15,4),
    previous_period_value DECIMAL(15,4),
    variance_percentage DECIMAL(8,4),
    variance_amount DECIMAL(15,4),
    benchmark_value DECIMAL(15,4), -- Industry benchmark
    location_id BIGINT UNSIGNED,
    department VARCHAR(100),
    metadata JSON, -- Additional context data
    alert_threshold_min DECIMAL(15,4),
    alert_threshold_max DECIMAL(15,4),
    is_alert_triggered BOOLEAN DEFAULT FALSE,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    INDEX idx_kpi_category_date (kpi_category, measurement_date),
    INDEX idx_kpi_name_date (kpi_name, measurement_date),
    INDEX idx_kpi_alert (is_alert_triggered),
    INDEX idx_kpi_location_date (location_id, measurement_date)
);
```

#### `sales_analytics_daily`
```sql
CREATE TABLE sales_analytics_daily (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    analysis_date DATE NOT NULL,
    location_id BIGINT UNSIGNED,
    category_id BIGINT UNSIGNED,
    total_transactions INTEGER DEFAULT 0,
    total_items_sold INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    total_cost DECIMAL(15,2) DEFAULT 0,
    gross_profit DECIMAL(15,2) DEFAULT 0,
    gross_margin_percentage DECIMAL(5,2) DEFAULT 0,
    avg_transaction_value DECIMAL(15,2) DEFAULT 0,
    avg_items_per_transaction DECIMAL(8,2) DEFAULT 0,
    unique_customers INTEGER DEFAULT 0,
    returning_customers INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    top_selling_product_id BIGINT UNSIGNED,
    peak_hour INTEGER, -- 0-23
    weather_condition VARCHAR(50),
    weather_impact_factor DECIMAL(5,2) DEFAULT 1.00,
    promotional_impact DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    refund_amount DECIMAL(15,2) DEFAULT 0,
    payment_method_breakdown JSON, -- Cash, card, etc. breakdown
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (top_selling_product_id) REFERENCES products(id) ON DELETE SET NULL,
    UNIQUE KEY uk_daily_analytics (analysis_date, location_id, category_id),
    INDEX idx_analytics_date (analysis_date),
    INDEX idx_analytics_location (location_id),
    INDEX idx_analytics_margin (gross_margin_percentage)
);
```

#### `customer_behavior_patterns`
```sql
CREATE TABLE customer_behavior_patterns (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    behavior_type ENUM('purchase_frequency', 'seasonal_patterns', 'price_sensitivity', 'brand_loyalty', 'category_preference', 'time_patterns', 'channel_preference') NOT NULL,
    pattern_data JSON, -- Store behavior metrics as JSON
    confidence_level DECIMAL(5,2),
    sample_size INTEGER, -- Number of transactions analyzed
    analysis_period_start DATE,
    analysis_period_end DATE,
    predicted_next_purchase DATE,
    predicted_spend_amount DECIMAL(15,2),
    churn_risk_score DECIMAL(5,2), -- 0-100%
    lifetime_value DECIMAL(15,2),
    segmentation_tags JSON, -- Customer segment tags
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_customer_behavior (customer_id, behavior_type),
    INDEX idx_behavior_type (behavior_type),
    INDEX idx_behavior_churn (churn_risk_score),
    INDEX idx_behavior_lifetime_value (lifetime_value)
);
```

---

*Enhanced Database Schema Version: 3.0*  
*Last Updated: August 3, 2025*  
*MVP Tables: 25+ | Advanced Features Tables: 15+*  
*Total Estimated Tables: 40+*  
*Expected Performance: < 100ms for FIFO operations, < 200ms for analytics queries*  
*Full Implementation Timeline: 14 Sprints (28 weeks)*

---

## 🎯 **Implementation Phases Summary**

### **MVP Phase (Sprint 1-6): Core Business Operations**
- Foundation tables for POS operations
- FIFO inventory management
- Basic supplier management
- Core sales and purchase functions
- Essential reporting

### **Growth Phase (Sprint 7-8): Customer Excellence**
- Advanced customer loyalty programs
- Sophisticated promotion management
- Customer tier system
- Referral programs

### **Intelligence Phase (Sprint 9-10): Smart Operations**
- Predictive inventory management
- Supplier performance analytics
- Advanced business intelligence
- Customer behavior analysis

### **Enterprise Phase (Sprint 11-14): Advanced Integration**
- Financial system integration
- E-commerce platform connectivity
- IoT device integration
- Machine learning capabilities
