import PosLayout from '@/Layouts/PosLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

export default function Checkout({
    products,
    paymentMethods,
    outlets,
    selectedOutletId,
    categories,
    customers,
    promotions,
    receiptChannels,
    features,
    currentShift,
    draftOrders,
}) {
    const { auth } = usePage().props;
    const [activeCategoryId, setActiveCategoryId] = useState('all');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState(0);
    const [taxRate, setTaxRate] = useState(0);
    const [serviceFeeRate, setServiceFeeRate] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0] || 'Cash');
    const [selectedOutlet, setSelectedOutlet] = useState(selectedOutletId || outlets[0]?.id || '');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedPromotion, setSelectedPromotion] = useState('');
    const [paymentReference, setPaymentReference] = useState('');
    const [receiptChannel, setReceiptChannel] = useState('');
    const [receiptRecipient, setReceiptRecipient] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    const [paidAmount, setPaidAmount] = useState('');
    const [activeDraftId, setActiveDraftId] = useState(null);

    const filteredProducts = useMemo(
        () =>
            products.filter((product) =>
                activeCategoryId === 'all' ? true : product.category?.id === activeCategoryId,
            ),
        [activeCategoryId, products],
    );

    const subtotal = useMemo(
        () => cart.reduce((sum, item) => sum + item.subtotal, 0),
        [cart],
    );
    const manualDiscountAmount =
        discountType === 'percentage' ? (subtotal * discountValue) / 100 : discountValue;
    const promotionRecord = promotions.find(
        (promotion) => promotion.id === Number(selectedPromotion),
    );
    const promotionDiscountAmount = promotionRecord
        ? promotionRecord.type === 'percentage'
            ? ((subtotal - manualDiscountAmount) * promotionRecord.value) / 100
            : promotionRecord.value
        : 0;
    const discountAmount = Math.max(0, manualDiscountAmount + promotionDiscountAmount);
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = (discountedSubtotal * taxRate) / 100;
    const serviceFeeAmount = (discountedSubtotal * serviceFeeRate) / 100;
    const total = discountedSubtotal + taxAmount + serviceFeeAmount;
    const normalizedPaidAmount = Number(paidAmount || 0);
    const changeDue =
        selectedPaymentMethod === 'Cash' ? Math.max(0, normalizedPaidAmount - total) : 0;

    const checkoutForm = useForm({
        outlet_id: selectedOutlet,
        items: cart,
        customer_id: selectedCustomer,
        promotion_id: selectedPromotion,
        voucher_code: voucherCode,
        discount_type: discountType,
        discount_value: discountValue,
        tax_rate: taxRate,
        service_fee_rate: serviceFeeRate,
        payment_method: selectedPaymentMethod,
        payment_reference: paymentReference,
        paid_amount: normalizedPaidAmount || '',
        receipt_channel: receiptChannel,
        receipt_recipient: receiptRecipient,
        draft_order_id: activeDraftId,
    });

    useEffect(() => {
        checkoutForm.setData({
            outlet_id: selectedOutlet,
            items: cart,
            customer_id: selectedCustomer,
            promotion_id: selectedPromotion,
            voucher_code: voucherCode,
            discount_type: discountType,
            discount_value: discountValue,
            tax_rate: taxRate,
            service_fee_rate: serviceFeeRate,
            payment_method: selectedPaymentMethod,
            payment_reference: paymentReference,
            paid_amount: normalizedPaidAmount || '',
            receipt_channel: receiptChannel,
            receipt_recipient: receiptRecipient,
            draft_order_id: activeDraftId,
        });
    }, [
        activeDraftId,
        cart,
        discountType,
        discountValue,
        normalizedPaidAmount,
        paymentReference,
        receiptChannel,
        receiptRecipient,
        selectedCustomer,
        selectedOutlet,
        selectedPaymentMethod,
        selectedPromotion,
        serviceFeeRate,
        taxRate,
        voucherCode,
    ]);

    const addToCart = (product) => {
        const existing = cart.find((item) => item.product_id === product.id);
        if (existing) {
            setCart(
                cart.map((item) =>
                    item.product_id === product.id
                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                              subtotal: (item.quantity + 1) * item.unit_price,
                          }
                        : item,
                ),
            );
            return;
        }

        setCart([
            ...cart,
            {
                product_id: product.id,
                name: product.name,
                quantity: 1,
                unit_price: Number(product.selling_price),
                subtotal: Number(product.selling_price),
            },
        ]);
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            setCart((current) => current.filter((item) => item.product_id !== productId));
            return;
        }

        setCart(
            cart.map((item) =>
                item.product_id === productId
                    ? { ...item, quantity, subtotal: quantity * item.unit_price }
                    : item,
            ),
        );
    };

    const resetSale = () => {
        setCart([]);
        setSelectedCustomer('');
        setSelectedPromotion('');
        setVoucherCode('');
        setDiscountType('percentage');
        setDiscountValue(0);
        setTaxRate(0);
        setServiceFeeRate(0);
        setPaymentReference('');
        setReceiptChannel('');
        setReceiptRecipient('');
        setPaidAmount('');
        setActiveDraftId(null);
    };

    const saveDraft = () => {
        const name = window.prompt('Draft order name', `Draft ${new Date().toLocaleTimeString()}`);
        if (!name || cart.length === 0) {
            return;
        }

        router.post(route('pos.drafts.store'), {
            outlet_id: selectedOutlet,
            customer_id: selectedCustomer || null,
            name,
            cart,
            adjustments: {
                discount_type: discountType,
                discount_value: discountValue,
                tax_rate: taxRate,
                service_fee_rate: serviceFeeRate,
                promotion_id: selectedPromotion || null,
                voucher_code: voucherCode || null,
            },
        });
    };

    const resumeDraft = (draft) => {
        setActiveDraftId(draft.id);
        setCart(draft.cart || []);
        setSelectedCustomer(draft.customer_id || '');
        setDiscountType(draft.adjustments?.discount_type || 'percentage');
        setDiscountValue(draft.adjustments?.discount_value || 0);
        setTaxRate(draft.adjustments?.tax_rate || 0);
        setServiceFeeRate(draft.adjustments?.service_fee_rate || 0);
        setSelectedPromotion(draft.adjustments?.promotion_id || '');
        setVoucherCode(draft.adjustments?.voucher_code || '');
        setIsCartOpen(true);
    };

    const submitCheckout = (event) => {
        event.preventDefault();
        checkoutForm.post(route('pos.store'));
    };

    return (
        <PosLayout
            title="Checkout workspace"
            subtitle="Touch-first product browsing, floating mobile cart access, and draft order resume."
            actions={
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={selectedOutlet}
                        onChange={(event) => {
                            const outlet = event.target.value;
                            setSelectedOutlet(outlet);
                            router.get(route('pos.index'), { outlet }, { preserveState: true });
                        }}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
                    >
                        {outlets.map((outlet) => (
                            <option key={outlet.id} value={outlet.id} className="text-slate-900">
                                {outlet.name}
                            </option>
                        ))}
                    </select>
                    {features.cashierShifts && (
                        currentShift ? (
                            <button
                                type="button"
                                onClick={() =>
                                    router.patch(route('premium.shifts.close', currentShift.id), {
                                        closing_balance: total,
                                    })
                                }
                                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                            >
                                Close shift
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() =>
                                    router.post(route('premium.shifts.open'), {
                                        outlet_id: selectedOutlet,
                                        opening_balance: 0,
                                    })
                                }
                                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                            >
                                Open shift
                            </button>
                        )
                    )}
                </div>
            }
        >
            <Head title="POS" />

            <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
                <section className="space-y-4">
                    <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5 p-3 backdrop-blur">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveCategoryId('all')}
                                className={`rounded-full px-4 py-2 text-sm font-medium ${
                                    activeCategoryId === 'all'
                                        ? 'bg-white text-slate-950'
                                        : 'bg-white/5 text-slate-300'
                                }`}
                            >
                                All products
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setActiveCategoryId(category.id)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                                        activeCategoryId === category.id
                                            ? 'bg-white text-slate-950'
                                            : 'bg-white/5 text-slate-300'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {draftOrders.length > 0 && (
                        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                                    Draft orders
                                </h3>
                                <span className="text-xs uppercase tracking-wide text-slate-500">
                                    {draftOrders.length} saved
                                </span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                {draftOrders.map((draft) => (
                                    <div
                                        key={draft.id}
                                        className="rounded-2xl border border-white/10 bg-slate-900/50 p-4"
                                    >
                                        <p className="font-medium text-white">{draft.name}</p>
                                        <p className="mt-1 text-sm text-slate-400">
                                            {draft.customer?.name || 'Walk-in'}
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => resumeDraft(draft)}
                                                className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-950"
                                            >
                                                Resume
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.delete(route('pos.drafts.destroy', draft.id))
                                                }
                                                className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => addToCart(product)}
                                className="rounded-[2rem] border border-white/10 bg-white/5 p-5 text-left backdrop-blur transition hover:border-emerald-300/40 hover:bg-white/10"
                            >
                                <p className="text-lg font-semibold text-white">{product.name}</p>
                                <p className="mt-1 text-sm text-slate-400">
                                    {product.category?.name || 'Uncategorized'}
                                </p>
                                <p className="mt-4 text-lg font-semibold text-emerald-300">
                                    {formatCurrency(product.selling_price)}
                                </p>
                                <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                                    Stock {product.stock_quantity}
                                </p>
                            </button>
                        ))}
                    </div>
                </section>

                <>
                    <button
                        type="button"
                        onClick={() => setIsCartOpen(true)}
                        className="fixed bottom-4 right-4 z-30 rounded-full bg-emerald-400 px-5 py-4 text-sm font-semibold text-slate-950 shadow-xl shadow-emerald-400/30 lg:hidden"
                    >
                        Cart {cart.length > 0 ? `(${cart.length})` : ''}
                    </button>

                    <div
                        className={`fixed inset-0 z-40 bg-slate-950/50 transition lg:hidden ${
                            isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                        }`}
                        onClick={() => setIsCartOpen(false)}
                    />

                    <section
                        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[88vh] rounded-t-[2rem] border border-white/10 bg-slate-900 p-4 shadow-2xl transition-transform lg:static lg:max-h-none lg:rounded-[2rem] lg:border lg:bg-white/5 lg:p-5 lg:backdrop-blur ${
                            isCartOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
                        }`}
                    >
                        <form onSubmit={submitCheckout} className="flex h-full flex-col">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Cart summary</h3>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {activeDraftId ? 'Draft resumed' : 'Ready for payment'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsCartOpen(false)}
                                    className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300 lg:hidden"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
                                {cart.map((item) => (
                                    <div
                                        key={item.product_id}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-white">{item.name}</p>
                                                <p className="mt-1 text-sm text-slate-400">
                                                    {formatCurrency(item.unit_price)} each
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCart((current) =>
                                                        current.filter(
                                                            (currentItem) =>
                                                                currentItem.product_id !== item.product_id,
                                                        ),
                                                    )
                                                }
                                                className="text-sm text-rose-300"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(item.product_id, item.quantity - 1)
                                                    }
                                                    className="h-8 w-8 rounded-full bg-white/10 text-white"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-semibold text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(item.product_id, item.quantity + 1)
                                                    }
                                                    className="h-8 w-8 rounded-full bg-white text-slate-950"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="font-semibold text-white">
                                                {formatCurrency(item.subtotal)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {cart.length === 0 && (
                                    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-400">
                                        Add products to start a sale or resume a saved draft.
                                    </div>
                                )}

                                <div className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-4">
                                    <select
                                        value={selectedCustomer}
                                        onChange={(event) => setSelectedCustomer(event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                    >
                                        <option value="">Walk-in customer</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <select
                                            value={discountType}
                                            onChange={(event) => setDiscountType(event.target.value)}
                                            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                        >
                                            <option value="percentage">Discount %</option>
                                            <option value="fixed">Discount nominal</option>
                                        </select>
                                        <input
                                            type="number"
                                            value={discountValue}
                                            onChange={(event) =>
                                                setDiscountValue(Number(event.target.value || 0))
                                            }
                                            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                        />
                                    </div>
                                    {features.promotions && (
                                        <select
                                            value={selectedPromotion}
                                            onChange={(event) => setSelectedPromotion(event.target.value)}
                                            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                        >
                                            <option value="">No promotion</option>
                                            {promotions.map((promotion) => (
                                                <option key={promotion.id} value={promotion.id}>
                                                    {promotion.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    <input
                                        value={voucherCode}
                                        onChange={(event) => setVoucherCode(event.target.value)}
                                        placeholder="Voucher code"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                    />
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <input
                                            type="number"
                                            value={taxRate}
                                            onChange={(event) => setTaxRate(Number(event.target.value || 0))}
                                            placeholder="Tax %"
                                            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                        />
                                        <input
                                            type="number"
                                            value={serviceFeeRate}
                                            onChange={(event) =>
                                                setServiceFeeRate(Number(event.target.value || 0))
                                            }
                                            placeholder="Service fee %"
                                            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                        />
                                    </div>
                                    <select
                                        value={selectedPaymentMethod}
                                        onChange={(event) => setSelectedPaymentMethod(event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                    >
                                        {paymentMethods.map((method) => (
                                            <option key={method} value={method}>
                                                {method}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedPaymentMethod === 'Cash' && (
                                        <input
                                            type="number"
                                            value={paidAmount}
                                            onChange={(event) => setPaidAmount(event.target.value)}
                                            placeholder="Paid amount"
                                            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                        />
                                    )}
                                    <input
                                        value={paymentReference}
                                        onChange={(event) => setPaymentReference(event.target.value)}
                                        placeholder="Payment reference"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                    />
                                    <select
                                        value={receiptChannel}
                                        onChange={(event) => setReceiptChannel(event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                    >
                                        <option value="">Receipt handoff later</option>
                                        {receiptChannels.map((channel) => (
                                            <option key={channel} value={channel}>
                                                {channel}
                                            </option>
                                        ))}
                                    </select>
                                    {receiptChannel && receiptChannel !== 'print' && (
                                        <input
                                            value={receiptRecipient}
                                            onChange={(event) =>
                                                setReceiptRecipient(event.target.value)
                                            }
                                            placeholder="Email or WhatsApp recipient"
                                            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                                <div className="flex items-center justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(discountAmount)}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span>Tax</span>
                                    <span>{formatCurrency(taxAmount)}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span>Service fee</span>
                                    <span>{formatCurrency(serviceFeeAmount)}</span>
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t border-emerald-300/20 pt-3 text-base font-semibold text-white">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                                {selectedPaymentMethod === 'Cash' && (
                                    <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-wide text-emerald-200">
                                        <span>Change due</span>
                                        <span>{formatCurrency(changeDue)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={saveDraft}
                                    className="flex-1 rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-white"
                                >
                                    Save draft
                                </button>
                                <button
                                    type="submit"
                                    disabled={checkoutForm.processing || cart.length === 0}
                                    className="flex-1 rounded-full bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
                                >
                                    Charge sale
                                </button>
                            </div>

                            <div className="mt-3 flex gap-3">
                                <button
                                    type="button"
                                    onClick={resetSale}
                                    className="flex-1 rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300"
                                >
                                    Start new
                                </button>
                                <Link
                                    href={route('transactions.index')}
                                    className="flex flex-1 items-center justify-center rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300"
                                >
                                    View receipts
                                </Link>
                            </div>
                        </form>
                    </section>
                </>
            </div>
        </PosLayout>
    );
}
