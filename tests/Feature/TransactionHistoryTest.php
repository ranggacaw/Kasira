<?php

namespace Tests\Feature;

use App\Models\Outlet;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ReceiptDelivery;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TransactionHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_transaction_history_can_be_filtered(): void
    {
        $admin = $this->createUserWithRole(Role::ADMIN);
        $cashierOne = $this->createUserWithRole(Role::CASHIER);
        $cashierTwo = $this->createUserWithRole(Role::CASHIER);
        $secondOutlet = Outlet::query()->create([
            'name' => 'Branch Outlet',
            'code' => 'BRN',
            'is_active' => true,
            'is_primary' => false,
        ]);

        $productOne = Product::query()->create([
            'name' => 'Latte',
            'sku' => 'LAT100',
            'selling_price' => 25000,
            'cost_price' => 10000,
            'stock_quantity' => 20,
            'outlet_id' => $cashierOne->outlet_id,
        ]);

        $productTwo = Product::query()->create([
            'name' => 'Tea',
            'sku' => 'TEA200',
            'selling_price' => 15000,
            'cost_price' => 5000,
            'stock_quantity' => 20,
            'outlet_id' => $secondOutlet->id,
        ]);

        $targetTransaction = $this->createTransaction($cashierOne, $cashierOne->outlet_id, $productOne, Payment::METHOD_CASH, now());
        $otherTransaction = $this->createTransaction($cashierTwo, $secondOutlet->id, $productTwo, Payment::METHOD_BANK_TRANSFER, now()->subDays(5));

        $this->actingAs($admin)
            ->get('/transactions?cashier_id='.$cashierOne->id.'&outlet_id='.$cashierOne->outlet_id.'&payment_method='.urlencode(Payment::METHOD_CASH).'&date_from='.today()->toDateString())
            ->assertOk()
            ->assertSee($targetTransaction->invoice_number)
            ->assertDontSee($otherTransaction->invoice_number);
    }

    public function test_receipt_page_supports_reprint_logging(): void
    {
        $cashier = $this->createUserWithRole(Role::CASHIER);
        $product = Product::query()->create([
            'name' => 'Brownie',
            'sku' => 'BRN001',
            'selling_price' => 18000,
            'cost_price' => 7000,
            'stock_quantity' => 15,
            'outlet_id' => $cashier->outlet_id,
        ]);

        $transaction = $this->createTransaction($cashier, $cashier->outlet_id, $product, Payment::METHOD_CASH, now());

        $this->actingAs($cashier)
            ->get('/transactions/'.$transaction->id)
            ->assertOk()
            ->assertSee($transaction->invoice_number);

        $this->actingAs($cashier)
            ->post('/transactions/'.$transaction->id.'/receipts', [
                'channel' => ReceiptDelivery::CHANNEL_PRINT,
                'recipient' => null,
            ])->assertRedirect();

        $this->assertDatabaseHas('receipt_deliveries', [
            'transaction_id' => $transaction->id,
            'channel' => ReceiptDelivery::CHANNEL_PRINT,
            'status' => 'logged',
        ]);
    }

    public function test_cashier_transaction_detail_hides_profitability_fields(): void
    {
        $cashier = $this->createUserWithRole(Role::CASHIER);
        $product = Product::query()->create([
            'name' => 'Brownie',
            'sku' => 'BRN001',
            'selling_price' => 18000,
            'cost_price' => 7000,
            'stock_quantity' => 15,
            'outlet_id' => $cashier->outlet_id,
        ]);

        $transaction = $this->createTransaction($cashier, $cashier->outlet_id, $product, Payment::METHOD_CASH, now());

        $this->actingAs($cashier)
            ->get('/transactions/'.$transaction->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Transactions/Show')
                ->where('transaction.items.0.name', 'Brownie')
                ->missing('transaction.items.0.cost_price')
                ->missing('transaction.items.0.gross_profit')
                ->where('canViewProfitability', false));
    }

    public function test_manager_transaction_detail_includes_profitability_snapshots(): void
    {
        $manager = $this->createUserWithRole(Role::MANAGER);
        $product = Product::query()->create([
            'name' => 'Brownie',
            'sku' => 'BRN001',
            'selling_price' => 18000,
            'cost_price' => 7000,
            'stock_quantity' => 15,
            'outlet_id' => $manager->outlet_id,
        ]);

        $transaction = $this->createTransaction($manager, $manager->outlet_id, $product, Payment::METHOD_CASH, now());

        $this->actingAs($manager)
            ->get('/transactions/'.$transaction->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Transactions/Show')
                ->where('transaction.items.0.name', 'Brownie')
                ->where('transaction.items.0.cost_price', '7000.00')
                ->where('transaction.items.0.gross_profit', '18000.00')
                ->where('transaction.items.0.gross_margin', '72.00')
                ->where('canViewProfitability', true));
    }

    private function createTransaction(User $cashier, int $outletId, Product $product, string $paymentMethod, \DateTimeInterface $paidAt): Transaction
    {
        $transaction = Transaction::query()->create([
            'invoice_number' => Transaction::generateInvoiceNumber(),
            'cashier_id' => $cashier->id,
            'outlet_id' => $outletId,
            'subtotal' => 25000,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'service_fee_amount' => 0,
            'total' => 25000,
            'paid_at' => $paidAt,
        ]);

        $transaction->items()->create([
            'product_id' => $product->id,
            'product_name_snapshot' => $product->name,
            'quantity' => 1,
            'unit_price' => 25000,
            'unit_cost' => $product->cost_price,
            'subtotal' => 25000,
            'selling_price_snapshot' => 25000,
            'cost_price_snapshot' => $product->cost_price,
            'subtotal_revenue_snapshot' => 25000,
            'subtotal_cost_snapshot' => $product->cost_price,
            'gross_profit_snapshot' => 25000 - (float) $product->cost_price,
            'gross_margin_snapshot' => round(((25000 - (float) $product->cost_price) / 25000) * 100, 2),
        ]);

        $transaction->payments()->create([
            'method' => $paymentMethod,
            'amount' => 25000,
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
