<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response
    {
        $products = Product::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Pos/Checkout', [
            'products' => $products,
            'paymentMethods' => Payment::methods(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'discount_type' => ['required', Rule::in(['percentage', 'fixed'])],
            'discount_value' => 'required|numeric|min:0',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'service_fee_rate' => 'required|numeric|min:0|max:100',
            'payment_method' => ['required', Rule::in(Payment::methods())],
            'payment_reference' => 'nullable|string|max:255',
        ]);

        if ($validated['discount_type'] === 'percentage' && $validated['discount_value'] > 100) {
            throw ValidationException::withMessages([
                'discount_value' => 'Percentage discounts may not exceed 100%.',
            ]);
        }

        $products = Product::query()
            ->where('is_active', true)
            ->whereIn('id', collect($validated['items'])->pluck('product_id'))
            ->get()
            ->keyBy('id');

        $items = collect($validated['items'])->map(function (array $item) use ($products): array {
            $product = $products->get($item['product_id']);

            if (! $product) {
                throw ValidationException::withMessages([
                    'items' => 'One or more selected products are unavailable.',
                ]);
            }

            $unitPrice = round((float) $product->selling_price, 2);
            $subtotal = round($unitPrice * $item['quantity'], 2);

            return [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
            ];
        });

        $subtotal = round($items->sum('subtotal'), 2);
        $discountAmount = $validated['discount_type'] === 'percentage'
            ? round($subtotal * ($validated['discount_value'] / 100), 2)
            : round(min($validated['discount_value'], $subtotal), 2);
        $discountedSubtotal = max($subtotal - $discountAmount, 0);
        $taxAmount = round($discountedSubtotal * ($validated['tax_rate'] / 100), 2);
        $serviceFeeAmount = round($discountedSubtotal * ($validated['service_fee_rate'] / 100), 2);
        $total = round($discountedSubtotal + $taxAmount + $serviceFeeAmount, 2);

        $transaction = DB::transaction(function () use (
            $request,
            $items,
            $subtotal,
            $discountAmount,
            $taxAmount,
            $serviceFeeAmount,
            $total,
            $validated,
        ) {
            $transaction = Transaction::create([
                'invoice_number' => Transaction::generateInvoiceNumber(),
                'cashier_id' => $request->user()->id,
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'tax_amount' => $taxAmount,
                'service_fee_amount' => $serviceFeeAmount,
                'total' => $total,
                'paid_at' => now(),
            ]);

            foreach ($items as $item) {
                $transaction->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

            $transaction->payments()->create([
                'method' => $validated['payment_method'],
                'amount' => $total,
                'reference' => $validated['payment_reference'] ?? null,
            ]);

            return $transaction;
        });

        return redirect()->route('pos.checkout')->with('success', "Transaction {$transaction->invoice_number} completed successfully.");
    }
}
