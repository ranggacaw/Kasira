import PosLayout from '@/Layouts/PosLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value || 0);

function CartPanel({
    cart,
    subtotal,
    discountAmount,
    taxRate,
    taxAmount,
    serviceFeeRate,
    serviceFeeAmount,
    total,
    changeDue,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paidAmount,
    setPaidAmount,
    quickCashAmounts,
    customers,
    selectedCustomer,
    setSelectedCustomer,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    taxRate: taxRateValue,
    setTaxRate,
    serviceFeeRate: serviceFeeRateValue,
    setServiceFeeRate,
    paymentMethods,
    activeDraftId,
    onUpdateQuantity,
    onRemoveItem,
    onClear,
    onSaveDraft,
    onSubmit,
    processing,
}) {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <>
            {/* Mobile: Cart Toggle Button */}
            <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-6 right-6 z-30 flex flex-col items-end rounded-3xl bg-primary px-6 py-4 text-white shadow-2xl shadow-primary/30 lg:hidden"
            >
                <span className="text-xs font-medium opacity-80">{cart.length} items</span>
                <span className="text-xl font-extrabold">{formatCurrency(total)}</span>
            </button>

            {/* Mobile: Cart Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-surface-container/80 transition lg:hidden ${
                    isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Cart Panel */}
            <div className={`flex h-full flex-col bg-white transition-transform duration-300 lg:static ${
                isCartOpen ? 'translate-y-0 fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] rounded-t-3xl lg:rounded-none' : 'lg:translate-y-0'
            }`}>
                <form onSubmit={onSubmit} className="flex h-full flex-col">
                    {/* Cart Header */}
                    <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-5">
                        <div>
                            <h3 className="text-lg font-bold text-on-surface">Current Order</h3>
                            <p className="text-sm text-on-surface-variant">
                                {cart.length} items {activeDraftId ? '• Draft resumed' : ''}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {cart.length > 0 && (
                                <button
                                    type="button"
                                    onClick={onClear}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsCartOpen(false)}
                                className="rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium text-on-surface-variant lg:hidden"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-3">
                        {cart.map((item) => (
                            <div
                                key={item.product_id}
                                className="flex gap-3 rounded-2xl bg-surface-container p-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-on-surface">{item.name}</p>
                                    <p className="text-sm text-on-surface-variant">
                                        {formatCurrency(item.unit_price)} each
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                                        className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-outline-variant bg-white text-lg font-bold text-on-surface hover:bg-surface-container-high transition"
                                    >
                                        −
                                    </button>
                                    <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                                        className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-outline-variant bg-white text-lg font-bold text-on-surface hover:bg-surface-container-high transition"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="min-w-[90px] text-right font-bold text-on-surface">
                                    {formatCurrency(item.subtotal)}
                                </p>
                            </div>
                        ))}

                        {cart.length === 0 && (
                            <div className="rounded-xl border-2 border-dashed border-outline-variant p-8 text-center">
                                <svg className="mx-auto h-12 w-12 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="mt-3 text-sm text-on-surface-variant">Add products to start a sale</p>
                            </div>
                        )}
                    </div>

                    {/* Order Summary & Payment */}
                    <div className="border-t-4 border-primary/10 bg-surface-container-lowest p-5">
                        {/* Summary */}
                        <div className="space-y-2 border-b border-outline-variant pb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-on-surface-variant">Subtotal</span>
                                <span className="font-semibold text-on-surface">{formatCurrency(subtotal)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-on-surface-variant">Discount</span>
                                    <span className="font-semibold text-tertiary">-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}
                            {taxRateValue > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-on-surface-variant">Tax ({taxRateValue}%)</span>
                                    <span className="font-semibold text-on-surface">{formatCurrency(taxAmount)}</span>
                                </div>
                            )}
                            {serviceFeeRateValue > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-on-surface-variant">Service ({serviceFeeRateValue}%)</span>
                                    <span className="font-semibold text-on-surface">{formatCurrency(serviceFeeAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2">
                                <span className="text-lg font-bold text-on-surface">Total</span>
                                <span className="text-2xl font-extrabold text-primary">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        {/* Quick Adjustments */}
                        {cart.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {/* Customer */}
                                <select
                                    value={selectedCustomer}
                                    onChange={(event) => setSelectedCustomer(event.target.value)}
                                    className="col-span-2 rounded-xl border-2 border-outline-variant bg-white px-4 py-3 text-sm text-on-surface"
                                >
                                    <option value="">Walk-in customer</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Discount */}
                                <select
                                    value={discountType}
                                    onChange={(event) => setDiscountType(event.target.value)}
                                    className="rounded-xl border-2 border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface"
                                >
                                    <option value="percentage">Discount %</option>
                                    <option value="fixed">Discount IDR</option>
                                </select>
                                <input
                                    type="number"
                                    value={discountValue || ''}
                                    onChange={(event) => setDiscountValue(Number(event.target.value || 0))}
                                    placeholder="0"
                                    className="rounded-xl border-2 border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface"
                                />

                                {/* Tax & Service */}
                                <input
                                    type="number"
                                    value={taxRateValue || ''}
                                    onChange={(event) => setTaxRate(Number(event.target.value || 0))}
                                    placeholder="Tax %"
                                    className="rounded-xl border-2 border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface"
                                />
                                <input
                                    type="number"
                                    value={serviceFeeRateValue || ''}
                                    onChange={(event) => setServiceFeeRate(Number(event.target.value || 0))}
                                    placeholder="Service %"
                                    className="rounded-xl border-2 border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface"
                                />
                            </div>
                        )}

                        {/* Payment Method */}
                        {cart.length > 0 && (
                            <>
                                <div className="mt-4">
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                        Payment Method
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method}
                                                type="button"
                                                onClick={() => setSelectedPaymentMethod(method)}
                                                className={`rounded-2xl py-3.5 text-sm font-bold transition ${
                                                    selectedPaymentMethod === method
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                                                }`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Cash (Cash only) */}
                                {selectedPaymentMethod === 'Cash' && (
                                    <div className="mt-3">
                                        <div className="grid grid-cols-4 gap-2">
                                            {quickCashAmounts.map((amount) => (
                                                <button
                                                    key={amount}
                                                    type="button"
                                                    onClick={() => setPaidAmount(amount.toString())}
                                                    className="rounded-xl border-2 border-outline-variant bg-white py-2.5 text-sm font-bold text-on-surface hover:border-primary hover:text-primary transition"
                                                >
                                                    {amount / 1000}K
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Paid Amount */}
                                {selectedPaymentMethod === 'Cash' && (
                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            value={paidAmount}
                                            onChange={(event) => setPaidAmount(event.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full rounded-2xl border-2 border-outline-variant bg-white px-4 py-3 text-right text-sm font-bold text-on-surface focus:border-primary focus:outline-none"
                                        />
                                        {changeDue > 0 && (
                                            <div className="mt-2 flex justify-between px-1">
                                                <span className="text-xs font-medium text-on-surface-variant">Change:</span>
                                                <span className="text-sm font-bold text-tertiary">{formatCurrency(changeDue)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Payment Reference (Non-cash) */}
                                {selectedPaymentMethod !== 'Cash' && (
                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            placeholder="Payment reference"
                                            className="w-full rounded-xl border-2 border-outline-variant bg-white px-4 py-3 text-sm text-on-surface"
                                        />
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="mt-4 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={onClear}
                                        className="flex-1 rounded-2xl border-2 border-outline-variant py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container transition"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onSaveDraft}
                                        disabled={cart.length === 0}
                                        className="flex-1 rounded-2xl border-2 border-outline-variant py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container transition disabled:opacity-50"
                                    >
                                        Draft
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing || cart.length === 0}
                                        className="flex-[2] rounded-2xl bg-primary py-4 text-sm font-extrabold text-white hover:bg-primary/90 transition disabled:opacity-50 shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        <span>Charge</span>
                                        <span>{formatCurrency(total)}</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}

export default function Checkout({
    products,
    paymentMethods,
    outlets,
    selectedOutletId,
    categories,
    customers,
    promotions,
    features,
    currentShift,
    draftOrders,
}) {
    const { auth } = usePage().props;
    const [activeCategoryId, setActiveCategoryId] = useState('all');
    const [cart, setCart] = useState([]);
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState(0);
    const [taxRate, setTaxRate] = useState(0);
    const [serviceFeeRate, setServiceFeeRate] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0] || 'Cash');
    const [selectedOutlet, setSelectedOutlet] = useState(selectedOutletId || outlets[0]?.id || '');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedPromotion, setSelectedPromotion] = useState('');
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

    const quickCashAmounts = [50000, 100000, 150000, 200000];

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
        paid_amount: normalizedPaidAmount || '',
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
            paid_amount: normalizedPaidAmount || '',
            draft_order_id: activeDraftId,
        });
    }, [
        activeDraftId,
        cart,
        discountType,
        discountValue,
        normalizedPaidAmount,
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
    };

    const submitCheckout = (event) => {
        event.preventDefault();
        checkoutForm.post(route('pos.store'));
    };

    const handleOutletChange = (outletId) => {
        setSelectedOutlet(outletId);
        router.get(route('pos.index'), { outlet: outletId }, { preserveState: true });
    };

    const cartPanel = (
        <CartPanel
            cart={cart}
            subtotal={subtotal}
            discountAmount={discountAmount}
            taxRate={taxRate}
            taxAmount={taxAmount}
            serviceFeeRate={serviceFeeRate}
            serviceFeeAmount={serviceFeeAmount}
            total={total}
            changeDue={changeDue}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            paidAmount={paidAmount}
            setPaidAmount={setPaidAmount}
            quickCashAmounts={quickCashAmounts}
            customers={customers}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            discountType={discountType}
            setDiscountType={setDiscountType}
            discountValue={discountValue}
            setDiscountValue={setDiscountValue}
            taxRateValue={taxRate}
            setTaxRate={setTaxRate}
            serviceFeeRateValue={serviceFeeRate}
            setServiceFeeRate={setServiceFeeRate}
            paymentMethods={paymentMethods}
            activeDraftId={activeDraftId}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={(productId) => setCart((current) => current.filter((item) => item.product_id !== productId))}
            onClear={resetSale}
            onSaveDraft={saveDraft}
            onSubmit={submitCheckout}
            processing={checkoutForm.processing}
        />
    );

    return (
        <PosLayout
            title="New Sale"
            currentOutlet={selectedOutlet}
            outlets={outlets}
            onOutletChange={handleOutletChange}
            currentShift={currentShift}
            activeNav="new-sale"
            cart={cartPanel}
            actions={
                <div className="flex flex-wrap items-center gap-3">
                    {features.cashierShifts && (
                        currentShift ? (
                            <button
                                type="button"
                                onClick={() =>
                                    router.patch(route('premium.shifts.close', currentShift.id), {
                                        closing_balance: total,
                                    })
                                }
                                className="rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container transition"
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
                                className="rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container transition"
                            >
                                Open shift
                            </button>
                        )
                    )}
                </div>
            }
        >
            <Head title="POS" />

            {/* Empty state */}
            {products.length === 0 && (
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                        <svg className="mx-auto h-16 w-16 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <h3 className="mt-4 text-lg font-semibold text-on-surface">No products available</h3>
                        <p className="mt-2 text-sm text-on-surface-variant">Add products to your outlet to start selling.</p>
                        <Link href={route('products.index')} className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                            Add products →
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Content Grid - Products only */}
            <div className="flex flex-1 flex-col overflow-hidden p-6 gap-4">
                {/* Section: Draft Orders */}
                {draftOrders.length > 0 && (
                    <div className="flex-shrink-0 rounded-2xl border border-outline-variant bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-on-surface-variant">
                                Draft orders
                            </h3>
                            <span className="text-xs uppercase tracking-wide text-outline">
                                {draftOrders.length} saved
                            </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {draftOrders.map((draft) => (
                                <div
                                    key={draft.id}
                                    className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container p-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-on-surface">{draft.name}</p>
                                        <p className="text-xs text-on-surface-variant">
                                            {draft.customer?.name || 'Walk-in'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => resumeDraft(draft)}
                                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition"
                                    >
                                        Resume
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.delete(route('pos.drafts.destroy', draft.id))}
                                        className="rounded-lg border border-outline-variant px-2 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section: Categories */}
                <div className="flex-shrink-0">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            type="button"
                            onClick={() => setActiveCategoryId('all')}
                            className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                                activeCategoryId === 'all'
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'border border-outline-variant bg-white text-on-surface hover:bg-surface-container-high'
                            }`}
                        >
                            All Products
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setActiveCategoryId(category.id)}
                                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                                    activeCategoryId === category.id
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'border border-outline-variant bg-white text-on-surface hover:bg-surface-container-high'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section: Product Grid */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => addToCart(product)}
                                disabled={!product.is_active || (product.track_stock && product.stock_quantity === 0)}
                                className={`group rounded-2xl border-2 border-outline-variant bg-white p-4 text-left transition hover:border-primary hover:shadow-lg hover:shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-on-surface group-hover:text-primary transition">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-on-surface-variant mt-0.5">
                                            {product.category?.name || 'Uncategorized'}
                                        </p>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                                        !product.is_active
                                            ? 'bg-red-100 text-red-600'
                                            : product.track_stock
                                                ? product.stock_quantity > 10
                                                    ? 'bg-tertiary-container/15 text-tertiary'
                                                    : product.stock_quantity > 0
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-red-100 text-red-600'
                                                : 'bg-tertiary-container/15 text-tertiary'
                                    }`}>
                                        {product.track_stock ? product.stock_quantity : '∞'}
                                    </span>
                                </div>
                                <p className="text-xl font-extrabold text-primary mt-4">
                                    {formatCurrency(product.selling_price)}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </PosLayout>
    );
}