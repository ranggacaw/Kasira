# COGS / HPP Module Specification for POS Application

## Module Name
**COGS / HPP Management Module**

COGS stands for **Cost of Goods Sold**. In Indonesian business terms, this is commonly known as **HPP (Harga Pokok Penjualan)**.

This module is used to calculate the real cost of each product sold, so the business owner can understand profit, margin, inventory cost, and product performance accurately.

---

## Purpose

The purpose of this module is to help business owners:

- Track product cost accurately
- Calculate gross profit per transaction
- Calculate gross profit per product
- Understand product margin
- Monitor inventory value
- Compare selling price vs cost price
- Generate profit reports
- Support better pricing decisions

---

## Target Users

This module is mainly used by:

- Owner
- Admin
- Manager

Cashier users should not be allowed to edit COGS / HPP data.

---

## Core Concept

Each product must have a cost value.

Example:

```txt
Product Name     : Iced Coffee Latte
Selling Price    : 25,000
Cost Price / HPP : 12,000
Gross Profit     : 13,000
Gross Margin     : 52%
```

Formula:

```txt
Gross Profit = Selling Price - COGS
Gross Margin = (Gross Profit / Selling Price) x 100
```

---

## Main Features

## 1. Product Cost Management

Each product should have the following fields:

```txt
Product Name
SKU / Barcode
Category
Selling Price
Cost Price / HPP
Estimated Margin
Active Status
```

### Requirements

- Admin can input cost price when creating a product.
- Admin can update cost price from the product detail page.
- Cost price should be hidden from cashier role.
- Cost price must be used when saving transaction items.
- The system should store cost price snapshot during transaction.

### Important Rule

When a product is sold, the system must save the current cost price into the transaction item.

Do not calculate old transaction profit using the latest product cost price.

Example:

```txt
Today Product Cost Price = 10,000
Tomorrow Product Cost Price = 12,000

If yesterday transaction used 10,000, it must stay 10,000.
```

---

## 2. Transaction COGS Snapshot

Every transaction item must store:

```txt
Product ID
Product Name Snapshot
Quantity
Selling Price Snapshot
Cost Price Snapshot
Subtotal Selling Price
Subtotal Cost Price
Gross Profit
Gross Margin
```

### Formula

```txt
Subtotal Selling Price = Quantity x Selling Price
Subtotal Cost Price = Quantity x Cost Price
Gross Profit = Subtotal Selling Price - Subtotal Cost Price
Gross Margin = (Gross Profit / Subtotal Selling Price) x 100
```

### Example

```txt
Product       : Chicken Risoles
Quantity      : 3
Selling Price : 8,000
Cost Price    : 4,500

Subtotal Sale : 24,000
Subtotal COGS : 13,500
Gross Profit  : 10,500
Gross Margin  : 43.75%
```

---

## 3. Inventory-Based COGS

The system should support inventory cost tracking.

When stock is added, the admin can input purchase cost.

```txt
Product
Outlet
Quantity In
Purchase Cost Per Unit
Total Purchase Cost
Supplier
Purchase Date
Notes
```

### Basic Calculation Method

For the MVP version, use **Manual Cost Price** from the product master data.

For advanced version, support:

- Average Cost Method
- FIFO Method

---

## 4. Average Cost Method

Average Cost is useful when the same product is purchased at different prices.

### Example

```txt
Batch 1: 10 pcs x 5,000 = 50,000
Batch 2: 10 pcs x 6,000 = 60,000

Total Quantity = 20 pcs
Total Cost     = 110,000
Average Cost   = 5,500
```

Formula:

```txt
Average Cost = Total Inventory Cost / Total Inventory Quantity
```

### Requirement

If Average Cost Method is enabled:

- Product cost price should be updated automatically after stock-in.
- Transaction item should use the current average cost as COGS snapshot.
- The system must store average cost history.

---

## 5. FIFO Cost Method

FIFO stands for **First In, First Out**.

The first stock purchased should be the first stock sold.

### Example

```txt
Stock Batch 1: 10 pcs x 5,000
Stock Batch 2: 10 pcs x 6,000

Customer buys 12 pcs.

COGS:
10 pcs x 5,000 = 50,000
2 pcs x 6,000  = 12,000

Total COGS = 62,000
```

### Requirement

FIFO should be implemented in advanced phase only.

For MVP, use manual product cost or average cost.

---

## 6. Profit Report

Create a report page named:

```txt
Reports > Profit & COGS
```

### Filters

```txt
Date Range
Outlet
Cashier
Category
Product
Payment Method
```

### Summary Cards

```txt
Total Revenue
Total COGS / HPP
Gross Profit
Gross Margin
Total Transactions
Average Transaction Value
```

### Formula

```txt
Total Revenue = Sum of transaction item subtotal selling price
Total COGS = Sum of transaction item subtotal cost price
Gross Profit = Total Revenue - Total COGS
Gross Margin = (Gross Profit / Total Revenue) x 100
```

---

## 7. Product Profitability Report

Create a product profitability table.

### Columns

```txt
Product Name
Category
Quantity Sold
Total Revenue
Total COGS
Gross Profit
Gross Margin
Average Selling Price
Average Cost Price
```

### Sort Options

```txt
Highest Revenue
Highest Profit
Lowest Profit
Highest Margin
Lowest Margin
Most Sold
Least Sold
```

---

## 8. Category Profitability Report

Create category-level profitability report.

### Columns

```txt
Category Name
Quantity Sold
Total Revenue
Total COGS
Gross Profit
Gross Margin
```

This helps the owner understand which category produces the best profit.

---

## 9. Outlet Profitability Report

For multi-outlet businesses, each outlet must have its own COGS and profit report.

### Columns

```txt
Outlet Name
Total Revenue
Total COGS
Gross Profit
Gross Margin
Total Transactions
```

---

## 10. Low Margin Alert

The system should warn the admin when a product has a low margin.

Example:

```txt
Selling Price : 10,000
Cost Price    : 9,000
Margin        : 10%
```

If margin is below the configured minimum margin, show an alert.

### Settings

```txt
Minimum Product Margin Percentage
Default: 20%
```

### Alert Message

```txt
Warning: This product has a low profit margin. Please review the selling price or cost price.
```

---

## 11. Role & Permission Rules

### Owner

Can:

- View all COGS data
- View profit reports
- Edit cost price
- Export COGS reports
- Manage COGS settings

### Admin

Can:

- Add product cost price
- Edit product cost price
- View profit reports, if allowed by owner

### Manager

Can:

- View profit reports
- View product profitability
- Cannot edit cost price unless permission is granted

### Cashier

Can:

- Process sales
- View selling price only
- Cannot view cost price
- Cannot view profit
- Cannot edit HPP / COGS

---

## 12. UI / UX Requirements

This application is PWA-first and only supports mobile and tablet screens.

### POS View

- Do not show sidebar in POS screen.
- POS should focus on product selection, cart, payment, and receipt.
- Cost price must never appear in POS cashier view.

### Back Office / Master Data View

Use sidebar drawer navigation for:

```txt
Dashboard
Products
Categories
Inventory
Transactions
Reports
COGS / HPP
Settings
```

### COGS / HPP Page

Create a page:

```txt
/reports/cogs
```

Or:

```txt
/hpp
```

Recommended page title:

```txt
COGS / HPP Report
```

### Product Form UI

Add fields:

```txt
Selling Price
Cost Price / HPP
Estimated Profit
Estimated Margin
```

Estimated profit and margin should update automatically when selling price or cost price changes.

---

## 13. Database Schema Recommendation

## products table

Add these fields:

```txt
cost_price decimal(15,2) nullable
selling_price decimal(15,2) not null
minimum_margin decimal(5,2) nullable
costing_method varchar(50) default 'manual'
```

Example costing methods:

```txt
manual
average
fifo
```

---

## transaction_items table

Add these fields:

```txt
product_id foreign key
product_name_snapshot varchar
quantity decimal(15,2)
selling_price_snapshot decimal(15,2)
cost_price_snapshot decimal(15,2)
subtotal_selling_price decimal(15,2)
subtotal_cost_price decimal(15,2)
gross_profit decimal(15,2)
gross_margin decimal(5,2)
```

---

## stock_movements table

Add these fields:

```txt
product_id foreign key
outlet_id foreign key nullable
movement_type varchar
quantity decimal(15,2)
cost_price_per_unit decimal(15,2) nullable
total_cost decimal(15,2) nullable
reference_type varchar nullable
reference_id bigint nullable
notes text nullable
created_by foreign key
created_at timestamp
```

Movement types:

```txt
stock_in
stock_out
sale
adjustment
return
transfer
```

---

## product_cost_histories table

Create table:

```txt
id
product_id
old_cost_price
new_cost_price
costing_method
reason
changed_by
created_at
```

Purpose:

- Track cost changes
- Audit HPP changes
- Prevent confusion in profit reports

---

## inventory_batches table

For future FIFO support:

```txt
id
product_id
outlet_id
quantity_initial
quantity_remaining
cost_price_per_unit
total_cost
purchase_date
supplier_id nullable
created_at
updated_at
```

---

## 14. Laravel Models

Recommended models:

```txt
Product
Transaction
TransactionItem
StockMovement
ProductCostHistory
InventoryBatch
Outlet
User
```

---

## 15. Service Classes

Create service classes:

```txt
App\Services\COGS\COGSCalculatorService
App\Services\COGS\AverageCostService
App\Services\COGS\FIFOService
App\Services\Reports\ProfitReportService
```

---

## 16. COGS Calculation Service

Create a service responsible for calculating COGS.

### Method Example

```php
calculateForTransactionItem(Product $product, float $quantity): array
```

### Return Example

```php
[
    'cost_price' => 4500,
    'subtotal_cost_price' => 13500,
    'gross_profit' => 10500,
    'gross_margin' => 43.75,
]
```

---

## 17. Transaction Flow

When cashier completes a transaction:

1. Validate product stock.
2. Get product selling price.
3. Get product current cost price.
4. Save transaction item with selling price snapshot.
5. Save transaction item with cost price snapshot.
6. Calculate subtotal selling price.
7. Calculate subtotal cost price.
8. Calculate gross profit.
9. Reduce stock.
10. Save stock movement as `sale`.
11. Save payment.
12. Generate receipt.

---

## 18. API / Controller Structure

Recommended controllers:

```txt
ProductController
InventoryController
TransactionController
ReportController
COGSController
ProductCostHistoryController
```

### Routes

```php
Route::middleware(['auth'])->group(function () {
    Route::get('/reports/cogs', [COGSController::class, 'index'])->name('reports.cogs');
    Route::get('/reports/product-profitability', [COGSController::class, 'productProfitability'])->name('reports.product-profitability');
    Route::get('/reports/category-profitability', [COGSController::class, 'categoryProfitability'])->name('reports.category-profitability');
    Route::get('/products/{product}/cost-history', [ProductCostHistoryController::class, 'index'])->name('products.cost-history');
});
```

---

## 19. Frontend Pages

Using Inertia React, create:

```txt
resources/js/Pages/Reports/COGS/Index.tsx
resources/js/Pages/Reports/COGS/ProductProfitability.tsx
resources/js/Pages/Reports/COGS/CategoryProfitability.tsx
resources/js/Pages/Products/CostHistory.tsx
```

---

## 20. shadcn/ui Components

Use these components:

```txt
Card
Button
Input
Select
Dialog
Drawer
Sheet
Table
Badge
Tabs
Date Picker
Dropdown Menu
Toast
```

---

## 21. Validation Rules

### Product Cost Price

```txt
nullable
numeric
min:0
```

### Selling Price

```txt
required
numeric
min:0
```

### Minimum Margin

```txt
nullable
numeric
min:0
max:100
```

---

## 22. Export Requirements

Owner should be able to export:

```txt
COGS Report
Product Profitability Report
Category Profitability Report
Outlet Profitability Report
```

Export formats:

```txt
Excel
PDF
```

---

## 23. Important Business Rules

- Cashier must never see cost price.
- Old transaction COGS must never change when product cost price changes.
- Transaction item must always store price snapshots.
- Profit report must use transaction item snapshots.
- Product cost history must be saved every time cost price changes.
- HPP can be manual in MVP.
- Average cost and FIFO can be added in future phase.

---

## 24. MVP Scope

For the first version, implement only:

```txt
Manual cost price per product
Cost price snapshot in transaction item
Gross profit calculation
Gross margin calculation
COGS report
Product profitability report
Low margin warning
Role restriction for cashier
```

Do not implement FIFO in MVP.

---

## 25. Future Scope

Future version can include:

```txt
Average cost method
FIFO cost method
Supplier management
Purchase order module
Inventory batch tracking
Automatic COGS recalculation
Advanced profit analytics
AI pricing recommendation
```

---

## 26. AI Coding Instruction

Build this module inside the existing Laravel + Inertia React + shadcn/ui + PostgreSQL POS application.

The application must be mobile-first and tablet-friendly because it is designed as a PWA.

Do not design for desktop layout.

Use drawer or sheet navigation for back-office pages.

POS screen must remain clean and cashier-focused.

COGS / HPP data must be protected by role and permission.

Use transaction snapshots for all profit calculations.

Prioritize clean code, reusable services, and scalable database design.
