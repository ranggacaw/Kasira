<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Outlet;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CogsReportingTest extends TestCase
{
    use RefreshDatabase;

    public function test_cogs_report_applies_snapshot_filters(): void
    {
        $manager = $this->createUserWithRole(Role::MANAGER);
        $cashier = $this->createUserWithRole(Role::CASHIER);

        $secondaryOutlet = Outlet::query()->create([
            'name' => 'Branch Outlet',
            'code' => 'BRN',
            'is_active' => true,
            'is_primary' => false,
        ]);

        $beverages = Category::query()->create([
            'name' => 'Beverages',
            'color' => '#0f766e',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $food = Category::query()->create([
            'name' => 'Food',
            'color' => '#9333ea',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        $latte = Product::query()->create([
            'outlet_id' => $manager->outlet_id,
            'category_id' => $beverages->id,
            'name' => 'Latte',
            'sku' => 'LAT100',
            'selling_price' => 25000,
            'cost_price' => 10000,
            'stock_quantity' => 20,
            'minimum_stock' => 2,
            'is_active' => true,
            'track_stock' => true,
        ]);

        $cake = Product::query()->create([
            'outlet_id' => $manager->outlet_id,
            'category_id' => $food->id,
            'name' => 'Cake',
            'sku' => 'CAK200',
            'selling_price' => 30000,
            'cost_price' => 12000,
            'stock_quantity' => 20,
            'minimum_stock' => 2,
            'is_active' => true,
            'track_stock' => true,
        ]);

        $remoteProduct = Product::query()->create([
            'outlet_id' => $secondaryOutlet->id,
            'category_id' => $beverages->id,
            'name' => 'Remote Latte',
            'sku' => 'REM300',
            'selling_price' => 26000,
            'cost_price' => 11000,
            'stock_quantity' => 20,
            'minimum_stock' => 2,
            'is_active' => true,
            'track_stock' => true,
        ]);

        $matchedTransaction = $this->createTransaction(
            $cashier,
            $manager->outlet_id,
            $latte,
            Payment::METHOD_CASH,
            today()->setTime(10, 0),
            2,
        );

        $this->createTransaction(
            $cashier,
            $manager->outlet_id,
            $cake,
            Payment::METHOD_QRIS,
            today()->subDay()->setTime(10, 0),
            1,
        );

        $this->createTransaction(
            $cashier,
            $secondaryOutlet->id,
            $remoteProduct,
            Payment::METHOD_CASH,
            today()->setTime(9, 0),
            1,
        );

        $this->actingAs($manager)
            ->get('/reports/cogs?outlet='.$manager->outlet_id.'&date_from='.today()->toDateString().'&date_to='.today()->toDateString().'&cashier_id='.$cashier->id.'&category_id='.$beverages->id.'&product_id='.$latte->id.'&payment_method='.urlencode(Payment::METHOD_CASH).'&sort=highest_profit')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Reports/Cogs')
                ->where('filters.outlet', $manager->outlet_id)
                ->where('filters.cashier_id', (string) $cashier->id)
                ->where('filters.category_id', (string) $beverages->id)
                ->where('filters.product_id', (string) $latte->id)
                ->where('filters.payment_method', Payment::METHOD_CASH)
                ->where('summary.revenue', 50000)
                ->where('summary.cogs', 20000)
                ->where('summary.gross_profit', 30000)
                ->where('summary.transaction_count', 1)
                ->where('productProfitability.0.product_name', 'Latte'));

        $this->assertNotNull($matchedTransaction);
    }

    public function test_cogs_report_still_loads_without_snapshot_columns(): void
    {
        $manager = $this->createUserWithRole(Role::MANAGER);
        $cashier = $this->createUserWithRole(Role::CASHIER);

        $beverages = Category::query()->create([
            'name' => 'Beverages',
            'color' => '#0f766e',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $latte = Product::query()->create([
            'outlet_id' => $manager->outlet_id,
            'category_id' => $beverages->id,
            'name' => 'Latte',
            'sku' => 'LAT100',
            'selling_price' => 25000,
            'cost_price' => 10000,
            'stock_quantity' => 20,
            'minimum_stock' => 2,
            'is_active' => true,
            'track_stock' => true,
        ]);

        $this->createTransaction(
            $cashier,
            $manager->outlet_id,
            $latte,
            Payment::METHOD_CASH,
            today()->setTime(10, 0),
            2,
        );

        Schema::table('transaction_items', function ($table): void {
            $table->dropColumn([
                'product_name_snapshot',
                'selling_price_snapshot',
                'cost_price_snapshot',
                'subtotal_revenue_snapshot',
                'subtotal_cost_snapshot',
                'gross_profit_snapshot',
                'gross_margin_snapshot',
            ]);
        });

        $this->actingAs($manager)
            ->get('/reports/cogs?outlet='.$manager->outlet_id.'&date_from='.today()->toDateString().'&date_to='.today()->toDateString())
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Reports/Cogs')
                ->where('summary.revenue', 50000)
                ->where('summary.cogs', 20000)
                ->where('summary.gross_profit', 30000)
                ->where('summary.transaction_count', 1)
                ->where('productProfitability.0.product_name', 'Latte'));
    }

    private function createTransaction(
        User $cashier,
        int $outletId,
        Product $product,
        string $paymentMethod,
        \DateTimeInterface $paidAt,
        int $quantity,
    ): Transaction {
        $subtotalRevenue = (float) $product->selling_price * $quantity;
        $subtotalCost = (float) $product->cost_price * $quantity;
        $grossProfit = $subtotalRevenue - $subtotalCost;

        $transaction = Transaction::query()->create([
            'invoice_number' => Transaction::generateInvoiceNumber(),
            'cashier_id' => $cashier->id,
            'outlet_id' => $outletId,
            'subtotal' => $subtotalRevenue,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'service_fee_amount' => 0,
            'total' => $subtotalRevenue,
            'status' => Transaction::STATUS_COMPLETED,
            'paid_amount' => $subtotalRevenue,
            'paid_at' => $paidAt,
        ]);

        $transaction->items()->create([
            'product_id' => $product->id,
            'product_name_snapshot' => $product->name,
            'quantity' => $quantity,
            'unit_price' => $product->selling_price,
            'unit_cost' => $product->cost_price,
            'subtotal' => $subtotalRevenue,
            'selling_price_snapshot' => $product->selling_price,
            'cost_price_snapshot' => $product->cost_price,
            'subtotal_revenue_snapshot' => $subtotalRevenue,
            'subtotal_cost_snapshot' => $subtotalCost,
            'gross_profit_snapshot' => $grossProfit,
            'gross_margin_snapshot' => round(($grossProfit / $subtotalRevenue) * 100, 2),
        ]);

        $transaction->payments()->create([
            'method' => $paymentMethod,
            'amount' => $subtotalRevenue,
        ]);

        return $transaction;
    }

    private function createUserWithRole(string $roleName): User
    {
        $role = Role::query()->firstOrCreate(['name' => $roleName]);

        return User::factory()->create([
            'role_id' => $role->id,
        ]);
    }
}
