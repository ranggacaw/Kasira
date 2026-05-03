import PosLayout from '@/Layouts/PosLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
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
    taxAmount,
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
    const [expandedItemId, setExpandedItemId] = useState(null);

    const content = (isMobileDrawer = false) => (
        <form onSubmit={onSubmit} className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-4 sm:p-5">
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
                            className="touch-target rounded-full border border-outline-variant px-3 py-2 text-sm font-medium text-on-surface-variant transition hover:bg-surface-container"
                        >
                            Clear
                        </button>
                    )}
                    {isMobileDrawer ? (
                        <button
                            type="button"
                            onClick={() => setIsCartOpen(false)}
                            className="touch-target rounded-full border border-outline-variant px-3 py-2 text-sm font-medium text-on-surface-variant"
                        >
                            Close
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="touch-scroll flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
                <div className="flex flex-col gap-2">
                    {cart.map((item) => {
                        const isExpanded = expandedItemId === item.product_id;
                        return (
                            <div
                                key={item.product_id}
                                className={`overflow-hidden rounded-xl border bg-white transition-colors ${isExpanded ? 'border-primary ring-1 ring-primary/20' : 'border-outline-variant'}`}
                            >
                                <div
                                    className="flex cursor-pointer items-center gap-3 p-3 hover:bg-surface-container-lowest"
                                    onClick={() => setExpandedItemId(isExpanded ? null : item.product_id)}
                                >
                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center text-on-surface-variant">
                                        <svg className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <span className="w-5 shrink-0 text-center text-sm font-bold text-on-surface">{item.quantity}</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-on-surface">{item.name}</p>
                                    </div>
                                    <p className="shrink-0 text-sm font-bold text-on-surface">
                                        {formatCurrency(item.subtotal)}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveItem(item.product_id);
                                        }}
                                        className="shrink-0 rounded-full p-1 text-on-surface-variant transition hover:bg-surface-container-high hover:text-error"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-outline-variant bg-surface-container-lowest p-3">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-on-surface-variant">Quantity</label>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant bg-white text-lg font-bold text-on-surface transition hover:bg-surface-container-high"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if (!isNaN(val) && val >= 1) {
                                                            onUpdateQuantity(item.product_id, val);
                                                        }
                                                    }}
                                                    className="h-9 w-20 rounded-lg border border-outline-variant bg-white text-center text-sm font-bold text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant bg-white text-lg font-bold text-on-surface transition hover:bg-surface-container-high"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {cart.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-outline-variant p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="mt-3 text-sm text-on-surface-variant">Add products to start a sale</p>
                    </div>
                )}
            </div>

            <div
                className="border-t-4 border-primary/10 bg-surface-container-lowest p-4 sm:p-5"
                style={isMobileDrawer ? { paddingBottom: 'calc(var(--safe-bottom) + 1rem)' } : undefined}
            >
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

                {cart.length > 0 && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <select
                            value={selectedCustomer}
                            onChange={(event) => setSelectedCustomer(event.target.value)}
                            className="touch-input rounded-xl border-2 border-outline-variant bg-white px-4 py-3 text-sm text-on-surface sm:col-span-2"
                        >
                            <option value="">Walk-in customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={discountType}
                            onChange={(event) => setDiscountType(event.target.value)}
                            className="touch-input rounded-xl border-2 border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface"
                        >
                            <option value="percentage">Discount %</option>
                            <option value="fixed">Discount IDR</option>
                        </select>
                        <input
                            type="number"
                            value={discountValue || ''}
                            onChange={(event) => setDiscountValue(Number(event.target.value || 0))}
                            placeholder="0"
                            className="touch-input rounded-xl border-2 border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface"
                        />

                        <input
                            type="number"
                            value={taxRateValue || ''}
                            onChange={(event) => setTaxRate(Number(event.target.value || 0))}
                            placeholder="Tax %"
                            className="touch-input rounded-xl border-2 border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface"
                        />
                        <input
                            type="number"
                            value={serviceFeeRateValue || ''}
                            onChange={(event) => setServiceFeeRate(Number(event.target.value || 0))}
                            placeholder="Service %"
                            className="touch-input rounded-xl border-2 border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface"
                        />
                    </div>
                )}

                {cart.length > 0 && (
                    <>
                        <div className="mt-4">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Payment Method
                            </label>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setSelectedPaymentMethod(method)}
                                        className={`touch-target rounded-2xl px-3 py-3 text-sm font-bold transition ${
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

                        {selectedPaymentMethod === 'Cash' && (
                            <div className="mt-3">
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {quickCashAmounts.map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => setPaidAmount(amount.toString())}
                                            className="touch-target rounded-xl border-2 border-outline-variant bg-white px-3 py-2.5 text-sm font-bold text-on-surface transition hover:border-primary hover:text-primary"
                                        >
                                            {amount / 1000}K
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedPaymentMethod === 'Cash' ? (
                            <div className="mt-3">
                                <input
                                    type="text"
                                    value={paidAmount}
                                    onChange={(event) => setPaidAmount(event.target.value)}
                                    placeholder="Enter amount"
                                    className="touch-input w-full rounded-2xl border-2 border-outline-variant bg-white px-4 py-3 text-right text-sm font-bold text-on-surface focus:border-primary focus:outline-none"
                                />
                                {changeDue > 0 && (
                                    <div className="mt-2 flex justify-between px-1">
                                        <span className="text-xs font-medium text-on-surface-variant">Change:</span>
                                        <span className="text-sm font-bold text-tertiary">{formatCurrency(changeDue)}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-3">
                                <input
                                    type="text"
                                    placeholder="Payment reference"
                                    className="touch-input w-full rounded-xl border-2 border-outline-variant bg-white px-4 py-3 text-sm text-on-surface"
                                />
                            </div>
                        )}

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <button
                                type="button"
                                onClick={onClear}
                                className="touch-target flex-1 rounded-2xl border-2 border-outline-variant px-4 py-3 text-sm font-bold text-on-surface-variant transition hover:bg-surface-container"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={onSaveDraft}
                                disabled={cart.length === 0}
                                className="touch-target flex-1 rounded-2xl border-2 border-outline-variant px-4 py-3 text-sm font-bold text-on-surface-variant transition hover:bg-surface-container disabled:opacity-50"
                            >
                                Draft
                            </button>
                            <button
                                type="submit"
                                disabled={processing || cart.length === 0}
                                className="touch-target flex-1 rounded-2xl bg-primary px-4 py-4 text-sm font-extrabold text-white shadow-xl shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-50 sm:flex-[1.5]"
                            >
                                Charge {formatCurrency(total)}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </form>
    );

    return (
        <>
            {cart.length > 0 ? (
                <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="fixed inset-x-4 z-30 flex items-center justify-between rounded-[1.75rem] bg-primary px-5 py-4 text-white shadow-2xl shadow-primary/30 md:hidden"
                    style={{ bottom: 'calc(var(--safe-bottom) + 1rem)' }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-[0.18em] opacity-80">
                            Cart ready
                        </span>
                        <p className="mt-1 text-sm font-semibold">{cart.length} items in the order</p>
                    </div>
                    <span className="text-xl font-extrabold">{formatCurrency(total)}</span>
                </button>
            ) : null}

            <div
                className={`fixed inset-0 z-40 bg-surface-container/80 transition md:hidden ${
                    isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={() => setIsCartOpen(false)}
            />

            <div
                className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 md:hidden ${
                    isCartOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="max-h-[calc(100dvh-3rem)] overflow-hidden rounded-t-[2rem] border border-outline-variant bg-surface-container-lowest shadow-2xl shadow-slate-900/20">
                    {content(true)}
                </div>
            </div>

            <div className="hidden h-full md:flex md:flex-col">{content(false)}</div>
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
    defaultTaxRate,
}) {
    const [activeCategoryId, setActiveCategoryId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState(0);
    const [taxRate, setTaxRate] = useState(Number(defaultTaxRate || 0));
    const [serviceFeeRate, setServiceFeeRate] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0] || 'Cash');
    const [selectedOutlet, setSelectedOutlet] = useState(selectedOutletId || outlets[0]?.id || '');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedPromotion, setSelectedPromotion] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    const [paidAmount, setPaidAmount] = useState('');
    const [activeDraftId, setActiveDraftId] = useState(null);

    const filteredProducts = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return products.filter((product) => {
                const matchesCategory =
                    activeCategoryId === 'all'
                        ? true
                        : product.category?.id === activeCategoryId;
                const matchesSearch = normalizedQuery
                    ? [product.name, product.sku, product.barcode]
                        .filter(Boolean)
                        .some((value) => value.toLowerCase().includes(normalizedQuery))
                    : true;

                return matchesCategory && matchesSearch;
            });
    }, [activeCategoryId, products, searchQuery]);

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
        setTaxRate(Number(defaultTaxRate || 0));
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

    const promptShiftAmount = (label, fallbackValue = 0) => {
        const response = window.prompt(label, String(fallbackValue ?? 0));

        if (response === null) {
            return null;
        }

        const amount = Number(response);

        if (!Number.isFinite(amount) || amount < 0) {
            window.alert('Enter a valid non-negative amount.');

            return null;
        }

        return amount;
    };

    const openShift = () => {
        const openingBalance = promptShiftAmount('Opening cash amount', currentShift?.opening_balance || 0);

        if (openingBalance === null) {
            return;
        }

        router.post(route('premium.shifts.open'), {
            outlet_id: selectedOutlet,
            opening_balance: openingBalance,
        });
    };

    const closeShift = () => {
        const closingBalance = promptShiftAmount(
            'Counted closing cash amount',
            currentShift?.expected_cash || currentShift?.opening_balance || 0,
        );

        if (closingBalance === null) {
            return;
        }

        router.patch(route('premium.shifts.close', currentShift.id), {
            closing_balance: closingBalance,
        });
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
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm text-on-surface-variant">
                                    Shift open • Opening cash {formatCurrency(currentShift.opening_balance)}
                                </div>
                                <button
                                    type="button"
                                    onClick={closeShift}
                                    className="rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container transition"
                                >
                                    Close shift
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={openShift}
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
            <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 pb-24 sm:p-6">
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
                <div className="flex-shrink-0 space-y-3">
                    <div className="relative">
                        <svg
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search by name, SKU, or barcode"
                            className="w-full rounded-xl border border-outline-variant bg-white py-3 pl-10 pr-10 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant transition hover:text-primary"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <div className="touch-scroll flex gap-2 overflow-x-auto pb-2 pr-4">
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
                    {filteredProducts.length === 0 ? (
                        <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-white p-8 text-center">
                            <div>
                                <p className="text-base font-semibold text-on-surface">
                                    No menu found
                                </p>
                                <p className="mt-1 text-sm text-on-surface-variant">
                                    Try a different menu name or change category.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
                                            <p className="mt-0.5 text-xs text-on-surface-variant">
                                                {[product.category?.name || 'Uncategorized', product.sku || product.barcode].filter(Boolean).join(' • ')}
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
                                    <p className="mt-4 text-xl font-extrabold text-primary">
                                        {formatCurrency(product.selling_price)}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PosLayout>
    );
}
