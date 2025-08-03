# 🔄 FIFO Algorithm Implementation Guide

## 📋 Overview
Dokumentasi lengkap implementasi algoritma FIFO (First In First Out) untuk sistem inventory costing yang akurat dalam aplikasi Shaka POS.

**Algorithm Type:** Weighted Average FIFO  
**Implementation:** Database-driven dengan real-time calculation  
**Performance Target:** < 100ms per transaction  
**Accuracy:** 100% cost tracking dengan audit trail

---

## 🎯 FIFO Algorithm Principles

### **Core Concept:**
```
FIFO = First In, First Out
- Barang yang masuk pertama akan keluar pertama
- Cost calculation berdasarkan urutan chronological pembelian
- Inventory valuation menggunakan cost terbaru yang masih tersisa
- Profit calculation akurat dengan real COGS
```

### **Business Rules:**
1. **Batch Ordering:** `received_date ASC, id ASC`
2. **Cost Basis:** Actual purchase cost per batch
3. **Partial Consumption:** Proportional cost allocation
4. **Expiry Handling:** Prioritize near-expiry batches
5. **Negative Stock:** Configurable prevention

---

## 🏗️ Database Structure for FIFO

### **Core Tables:**
```sql
-- Batch tracking
product_batches: stores each purchase as separate batch
fifo_transactions: logs every FIFO cost allocation
transaction_costs: detailed cost breakdown per sale item
stock_movements: complete audit trail

-- Key Fields:
received_date: untuk FIFO ordering
current_quantity: available quantity in batch  
unit_cost: purchase cost untuk cost calculation
```

### **FIFO Selection Query:**
```sql
-- Get available batches in FIFO order
SELECT 
    id, batch_number, current_quantity, unit_cost,
    (current_quantity - reserved_quantity) as available_qty
FROM product_batches 
WHERE product_id = ? 
    AND status = 'active' 
    AND (current_quantity - reserved_quantity) > 0
ORDER BY received_date ASC, id ASC;
```

---

## ⚙️ FIFO Algorithm Implementation

### **1. Purchase Processing (Batch Creation)**
```php
// When goods are received
function createProductBatch($purchaseItem) {
    return ProductBatch::create([
        'product_id' => $purchaseItem->product_id,
        'supplier_id' => $purchaseItem->purchase->supplier_id,
        'purchase_id' => $purchaseItem->purchase_id,
        'batch_number' => $this->generateBatchNumber($purchaseItem),
        'initial_quantity' => $purchaseItem->received_quantity,
        'current_quantity' => $purchaseItem->received_quantity,
        'unit_cost' => $purchaseItem->unit_cost,
        'total_cost' => $purchaseItem->total_cost,
        'received_date' => $purchaseItem->purchase->purchase_date,
        'expiry_date' => $purchaseItem->expiry_date,
        'status' => 'active'
    ]);
}
```

### **2. FIFO Cost Calculation (Sales Processing)**
```php
function calculateFifoCosts($productId, $quantityNeeded) {
    $batches = $this->getAvailableBatches($productId);
    $costs = [];
    $remainingQty = $quantityNeeded;
    
    foreach ($batches as $batch) {
        if ($remainingQty <= 0) break;
        
        $availableQty = $batch->current_quantity - $batch->reserved_quantity;
        $qtyToConsume = min($remainingQty, $availableQty);
        
        if ($qtyToConsume > 0) {
            $costs[] = [
                'batch_id' => $batch->id,
                'quantity' => $qtyToConsume,
                'unit_cost' => $batch->unit_cost,
                'total_cost' => $qtyToConsume * $batch->unit_cost
            ];
            
            $remainingQty -= $qtyToConsume;
        }
    }
    
    if ($remainingQty > 0) {
        throw new InsufficientStockException("Not enough stock available");
    }
    
    return $costs;
}

function getAvailableBatches($productId) {
    return ProductBatch::where('product_id', $productId)
        ->where('status', 'active')
        ->whereRaw('(current_quantity - reserved_quantity) > 0')
        ->orderBy('received_date', 'asc')
        ->orderBy('id', 'asc')
        ->get();
}
```

### **3. Transaction Processing with FIFO**
```php
function processSaleTransaction($transactionItems) {
    DB::transaction(function () use ($transactionItems) {
        foreach ($transactionItems as $item) {
            // Calculate FIFO costs
            $fifoCosts = $this->calculateFifoCosts(
                $item->product_id, 
                $item->quantity
            );
            
            $totalCost = 0;
            
            // Create transaction cost records
            foreach ($fifoCosts as $cost) {
                TransactionCost::create([
                    'transaction_item_id' => $item->id,
                    'batch_id' => $cost['batch_id'],
                    'quantity' => $cost['quantity'],
                    'unit_cost' => $cost['unit_cost'],
                    'total_cost' => $cost['total_cost']
                ]);
                
                // Update batch quantities
                $this->updateBatchQuantity(
                    $cost['batch_id'], 
                    -$cost['quantity']
                );
                
                // Log FIFO transaction
                FifoTransaction::create([
                    'product_id' => $item->product_id,
                    'transaction_type' => 'sale',
                    'reference_id' => $item->transaction_id,
                    'batch_id' => $cost['batch_id'],
                    'quantity' => $cost['quantity'],
                    'unit_cost' => $cost['unit_cost'],
                    'total_cost' => $cost['total_cost']
                ]);
                
                $totalCost += $cost['total_cost'];
            }
            
            // Update transaction item with FIFO costs
            $item->update([
                'unit_cost' => $totalCost / $item->quantity,
                'total_cost' => $totalCost,
                'item_profit' => $item->total_price - $totalCost
            ]);
        }
    });
}
```

### **4. Batch Quantity Management**
```php
function updateBatchQuantity($batchId, $quantityChange) {
    $batch = ProductBatch::findOrFail($batchId);
    
    $newQuantity = $batch->current_quantity + $quantityChange;
    
    if ($newQuantity < 0) {
        throw new InvalidQuantityException("Negative quantity not allowed");
    }
    
    $batch->update([
        'current_quantity' => $newQuantity,
        'status' => $newQuantity <= 0 ? 'sold_out' : 'active'
    ]);
    
    // Log stock movement
    StockMovement::create([
        'product_id' => $batch->product_id,
        'batch_id' => $batch->id,
        'movement_type' => $quantityChange > 0 ? 'in' : 'out',
        'quantity' => abs($quantityChange),
        'unit_cost' => $batch->unit_cost,
        'balance_after' => $newQuantity,
        'reference_type' => 'fifo_adjustment',
        'reference_id' => $batchId
    ]);
}
```

---

## 📊 FIFO Reporting & Analytics

### **1. Current Stock Valuation**
```sql
-- FIFO-based inventory valuation
SELECT 
    p.id,
    p.sku,
    p.name,
    SUM(pb.current_quantity) as total_quantity,
    SUM(pb.current_quantity * pb.unit_cost) as fifo_value,
    (SUM(pb.current_quantity * pb.unit_cost) / SUM(pb.current_quantity)) as avg_unit_cost
FROM products p
JOIN product_batches pb ON p.id = pb.product_id
WHERE pb.status = 'active' AND pb.current_quantity > 0
GROUP BY p.id, p.sku, p.name
ORDER BY fifo_value DESC;
```

### **2. Profit Analysis dengan FIFO**
```sql
-- Accurate profit calculation
SELECT 
    DATE(t.transaction_date) as sale_date,
    SUM(ti.total_price) as total_sales,
    SUM(tc.total_cost) as total_cogs,
    SUM(ti.total_price - COALESCE(tc_sum.total_cost, 0)) as gross_profit,
    (SUM(ti.total_price - COALESCE(tc_sum.total_cost, 0)) / SUM(ti.total_price) * 100) as margin_percentage
FROM transactions t
JOIN transaction_items ti ON t.id = ti.transaction_id
LEFT JOIN (
    SELECT 
        transaction_item_id,
        SUM(total_cost) as total_cost
    FROM transaction_costs 
    GROUP BY transaction_item_id
) tc_sum ON ti.id = tc_sum.transaction_item_id
WHERE t.status = 'completed'
    AND t.transaction_date BETWEEN ? AND ?
GROUP BY DATE(t.transaction_date)
ORDER BY sale_date DESC;
```

### **3. Batch Aging Analysis**
```sql
-- Monitor slow-moving and expiring inventory
SELECT 
    p.name as product_name,
    pb.batch_number,
    pb.current_quantity,
    pb.unit_cost,
    (pb.current_quantity * pb.unit_cost) as batch_value,
    pb.received_date,
    pb.expiry_date,
    DATEDIFF(pb.expiry_date, CURDATE()) as days_to_expire,
    DATEDIFF(CURDATE(), pb.received_date) as days_in_stock
FROM product_batches pb
JOIN products p ON pb.product_id = p.id
WHERE pb.status = 'active' 
    AND pb.current_quantity > 0
ORDER BY 
    CASE 
        WHEN pb.expiry_date IS NOT NULL THEN DATEDIFF(pb.expiry_date, CURDATE())
        ELSE 999999 
    END ASC,
    pb.received_date ASC;
```

---

## 🚨 Exception Handling & Edge Cases

### **1. Insufficient Stock**
```php
class InsufficientStockException extends Exception {
    public function __construct($productId, $requested, $available) {
        $message = "Insufficient stock for product {$productId}. Requested: {$requested}, Available: {$available}";
        parent::__construct($message);
    }
}
```

### **2. Expired Batch Handling**
```php
function handleExpiredBatches() {
    $expiredBatches = ProductBatch::where('expiry_date', '<', now())
        ->where('status', 'active')
        ->where('current_quantity', '>', 0)
        ->get();
    
    foreach ($expiredBatches as $batch) {
        // Mark as expired
        $batch->update(['status' => 'expired']);
        
        // Create adjustment entry
        StockMovement::create([
            'product_id' => $batch->product_id,
            'batch_id' => $batch->id,
            'movement_type' => 'out',
            'quantity' => $batch->current_quantity,
            'reference_type' => 'expiry_adjustment',
            'notes' => 'Expired batch adjustment'
        ]);
        
        // Zero out quantity
        $batch->update(['current_quantity' => 0]);
    }
}
```

### **3. Negative Cost Prevention**
```php
function validateFifoCost($unitCost) {
    if ($unitCost < 0) {
        throw new InvalidCostException("Unit cost cannot be negative");
    }
    
    if ($unitCost > 999999.99) {
        throw new InvalidCostException("Unit cost exceeds maximum allowed value");
    }
}
```

---

## ⚡ Performance Optimization

### **1. Batch Selection Optimization**
```sql
-- Optimized index for FIFO selection
CREATE INDEX idx_fifo_selection ON product_batches (
    product_id, 
    status, 
    received_date, 
    id
) WHERE status = 'active';

-- Covering index untuk quick lookups
CREATE INDEX idx_batch_summary ON product_batches (
    product_id, 
    current_quantity, 
    unit_cost
) WHERE status = 'active' AND current_quantity > 0;
```

### **2. Caching Strategy**
```php
// Cache frequently accessed stock levels
function getCachedStockLevel($productId) {
    return Cache::remember("stock_level_{$productId}", 300, function () use ($productId) {
        return ProductBatch::where('product_id', $productId)
            ->where('status', 'active')
            ->sum('current_quantity');
    });
}

// Invalidate cache on stock changes
function invalidateStockCache($productId) {
    Cache::forget("stock_level_{$productId}");
    Cache::forget("fifo_batches_{$productId}");
}
```

### **3. Bulk Operations**
```php
// Efficient bulk FIFO processing
function processBulkFifoTransactions($transactions) {
    $productBatches = $this->preloadBatchesForProducts($transactions);
    
    DB::transaction(function () use ($transactions, $productBatches) {
        foreach ($transactions as $transaction) {
            $this->processFifoWithPreloadedBatches(
                $transaction, 
                $productBatches
            );
        }
    });
}
```

---

## 🔍 Testing & Validation

### **1. FIFO Accuracy Tests**
```php
class FifoTest extends TestCase {
    public function test_fifo_cost_calculation_accuracy() {
        // Create test batches with known costs
        $this->createBatch('PROD1', 100, 10.00, '2024-01-01');
        $this->createBatch('PROD1', 50, 12.00, '2024-01-02');
        
        // Process sale
        $costs = $this->calculateFifoCosts('PROD1', 120);
        
        // Verify FIFO ordering
        $this->assertEquals(100, $costs[0]['quantity']);
        $this->assertEquals(10.00, $costs[0]['unit_cost']);
        $this->assertEquals(20, $costs[1]['quantity']);
        $this->assertEquals(12.00, $costs[1]['unit_cost']);
    }
}
```

### **2. Performance Benchmarks**
```php
public function test_fifo_performance() {
    // Create 1000 batches
    $this->createTestBatches(1000);
    
    $startTime = microtime(true);
    $this->calculateFifoCosts('PROD1', 500);
    $endTime = microtime(true);
    
    $executionTime = ($endTime - $startTime) * 1000; // ms
    $this->assertLessThan(100, $executionTime); // < 100ms
}
```

---

## 📈 Monitoring & Alerts

### **1. Stock Level Monitoring**
```sql
-- Low stock dengan FIFO values
CREATE VIEW v_low_stock_fifo AS
SELECT 
    p.id,
    p.name,
    p.minimum_stock,
    COALESCE(SUM(pb.current_quantity), 0) as current_stock,
    COALESCE(SUM(pb.current_quantity * pb.unit_cost), 0) as stock_value
FROM products p
LEFT JOIN product_batches pb ON p.id = pb.product_id AND pb.status = 'active'
WHERE p.is_active = TRUE
GROUP BY p.id
HAVING current_stock <= p.minimum_stock AND current_stock > 0;
```

### **2. Expiry Alerts**
```php
function getExpiryAlerts($daysAhead = 30) {
    return ProductBatch::with('product')
        ->where('status', 'active')
        ->where('current_quantity', '>', 0)
        ->where('expiry_date', '<=', now()->addDays($daysAhead))
        ->where('expiry_date', '>', now())
        ->orderBy('expiry_date')
        ->get();
}
```

---

*FIFO Implementation Guide Version: 2.0*  
*Last Updated: August 3, 2025*  
*Performance Target: < 100ms per FIFO calculation*  
*Accuracy: 100% cost tracking dengan complete audit trail*
