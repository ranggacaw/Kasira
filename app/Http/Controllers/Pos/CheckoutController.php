<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'discount_amount' => 'required|numeric|min:0',
            'tax_amount' => 'required|numeric|min:0',
            'service_fee_amount' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'payment_method' => ['required', Rule::in(Payment::methods())],
            'payment_reference' => 'nullable|string|max:255',
        ]);

        $transaction = Transaction::create([
            'invoice_number' => Transaction::generateInvoiceNumber(),
            'cashier_id' => auth()->id(),
            'subtotal' => $validated['subtotal'],
            'discount_amount' => $validated['discount_amount'],
            'tax_amount' => $validated['tax_amount'],
            'service_fee_amount' => $validated['service_fee_amount'],
            'total' => $validated['total'],
            'paid_at' => now(),
        ]);

        foreach ($validated['items'] as $item) {
            $transaction->items()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'subtotal' => $item['subtotal'],
            ]);
        }

        $transaction->payments()->create([
            'method' => $validated['payment_method'],
            'amount' => $validated['total'],
            'reference' => $validated['payment_reference'] ?? null,
        ]);

        return redirect()->route('pos.checkout')->with('success', "Transaction {$transaction->invoice_number} completed successfully.");
    }
}