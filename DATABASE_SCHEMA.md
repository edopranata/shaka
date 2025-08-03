# 🗄️ Shaka POS - Database Schema Documentation

## 📋 Overview
Dokumentasi lengkap struktur database untuk aplikasi Shaka POS dengan implementasi FIFO (First In First Out) inventory costing dan supplier management.

**Last Updated:** August 3, 2025  
**Version:** v2.0 (Enhanced with FIFO & Supplier)  
**Database Engine:** MySQL 8.0+ / PostgreSQL 13+

---

## 🏗️ Database Architecture

### 🎯 **Design Principles:**
- **FIFO Implementation:** Batch tracking untuk accurate cost calculation
- **Audit Trail:** Complete traceability untuk semua stock movements
- **Scalability:** Support untuk multi-store dan multi-warehouse
- **Performance:** Optimized indexing untuk high-frequency operations
- **Data Integrity:** Foreign keys dan constraints untuk data consistency

### 📊 **Schema Overview:**
```
Authentication & Users (Sprint 1) ✅
├── users, roles, permissions
├── user_profiles, activity_logs

Master Data (Sprint 2) 🔄
├── suppliers, categories, units
├── products, product_units, product_images
├── product_batches, stock_movements

Purchase Management (Sprint 3) 🔄
├── purchases, purchase_items
├── fifo_transactions

Sales & POS (Sprint 4) 🔄
├── customers, transactions, transaction_items
├── payments, transaction_costs

Store & Location (Sprint 5) 🔄
├── stores, locations, user_stores
├── location_stocks

Reporting & Analytics (Sprint 6) 🔄
├── Views dan materialized views untuk reporting
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

*Database Schema Version: 2.0*  
*Last Updated: August 3, 2025*  
*Compatible with: MySQL 8.0+, PostgreSQL 13+*  
*FIFO Implementation: Complete*  
*Estimated Implementation Time: 6 Sprints (14 weeks)*
