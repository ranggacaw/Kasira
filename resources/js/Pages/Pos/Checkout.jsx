import { Head, usePage, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Checkout({ products, paymentMethods }) {
    const { auth } = usePage().props;
    const flash = usePage().props?.flash || {};

    const [cart, setCart] = useState([]);
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState(0);
    const [taxRate, setTaxRate] = useState(0);
    const [serviceFeeRate, setServiceFeeRate] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0] || '');
    const [paymentReference, setPaymentReference] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastTransaction, setLastTransaction] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            setLastTransaction(flash.success);
            setTimeout(() => setShowSuccess(false), 5000);
        }
    }, [flash]);

    const addToCart = (product) => {
        const existing = cart.find((item) => item.product_id === product.id);
        if (existing) {
            setCart(
                cart.map((item) =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unit_price }
                        : item
                )
            );
        } else {
            setCart([
                ...cart,
                {
                    product_id: product.id,
                    name: product.name,
                    quantity: 1,
                    unit_price: product.selling_price,
                    subtotal: product.selling_price,
                },
            ]);
        }
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            setCart(cart.filter((item) => item.product_id !== productId));
        } else {
            setCart(
                cart.map((item) =>
                    item.product_id === productId
                        ? { ...item, quantity, subtotal: quantity * item.unit_price }
                        : item
                )
            );
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.product_id !== productId));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

    const discountAmount =
        discountType === 'percentage' ? (subtotal * discountValue) / 100 : discountValue;

    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * taxRate) / 100;
    const serviceFeeAmount = (afterDiscount * serviceFeeRate) / 100;
    const total = afterDiscount + taxAmount + serviceFeeAmount;

    const { data, setData, post, processing, errors, reset } = useForm({
        items: cart,
        subtotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        service_fee_amount: serviceFeeAmount,
        total,
        payment_method: selectedPaymentMethod,
        payment_reference: paymentReference,
    });

    useEffect(() => {
        setData({
            items: cart,
            subtotal,
            discount_amount: discountAmount,
            tax_amount: taxAmount,
            service_fee_amount: serviceFeeAmount,
            total,
            payment_method: selectedPaymentMethod,
            payment_reference: paymentReference,
        });
    }, [cart, subtotal, discountAmount, taxAmount, serviceFeeAmount, total, selectedPaymentMethod, paymentReference]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pos.checkout.store'), {
            onSuccess: () => {
                setCart([]);
                setDiscountValue(0);
                setTaxRate(0);
                setServiceFeeRate(0);
                setPaymentReference('');
                reset();
            },
        });
    };

    const startNewSale = () => {
        setCart([]);
        setDiscountValue(0);
        setTaxRate(0);
        setServiceFeeRate(0);
        setPaymentReference('');
        setShowSuccess(false);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-slate-900">
                            POS Checkout
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Create a new sale transaction
                        </p>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        {auth.user?.role?.name}
                    </div>
                </div>
            }
        >
            <Head title="POS Checkout" />

            {showSuccess && (
                <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                    {lastTransaction}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                <div className="space-y-6">
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Products
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="flex flex-col items-start rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                                >
                                    <span className="font-medium text-slate-900">
                                        {product.name}
                                    </span>
                                    <span className="mt-1 text-sm font-semibold text-emerald-600">
                                        {formatCurrency(product.selling_price)}
                                    </span>
                                    {product.sku && (
                                        <span className="mt-2 text-xs text-slate-400">
                                            {product.sku}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {cart.length > 0 && (
                        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Cart ({cart.length} items)
                            </h3>
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <div
                                        key={item.product_id}
                                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-900">
                                                {item.name}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {formatCurrency(item.unit_price)} each
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product_id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product_id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="w-24 text-right font-medium text-slate-900">
                                                {formatCurrency(item.subtotal)}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removeFromCart(item.product_id)
                                                }
                                                className="text-red-500 transition hover:text-red-700"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Totals
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        Discount
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={discountType}
                                            onChange={(e) =>
                                                setDiscountType(e.target.value)
                                            }
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                        >
                                            <option value="percentage">%</option>
                                            <option value="fixed">Fixed</option>
                                        </select>
                                        <input
                                            type="number"
                                            value={discountValue}
                                            onChange={(e) =>
                                                setDiscountValue(
                                                    parseFloat(e.target.value) || 0
                                                )
                                            }
                                            min="0"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        Tax Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={taxRate}
                                        onChange={(e) =>
                                            setTaxRate(parseFloat(e.target.value) || 0)
                                        }
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        Service Fee (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={serviceFeeRate}
                                        onChange={(e) =>
                                            setServiceFeeRate(
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="mt-2 flex justify-between text-sm text-red-600">
                                            <span>Discount</span>
                                            <span>-{formatCurrency(discountAmount)}</span>
                                        </div>
                                    )}
                                    {taxAmount > 0 && (
                                        <div className="mt-2 flex justify-between text-sm text-slate-600">
                                            <span>Tax</span>
                                            <span>{formatCurrency(taxAmount)}</span>
                                        </div>
                                    )}
                                    {serviceFeeAmount > 0 && (
                                        <div className="mt-2 flex justify-between text-sm text-slate-600">
                                            <span>Service Fee</span>
                                            <span>
                                                {formatCurrency(serviceFeeAmount)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="mt-4 flex justify-between text-lg font-semibold text-slate-900">
                                        <span>Total</span>
                                        <span>{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Payment
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Payment Method
                                    </label>
                                    <div className="grid gap-2">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedPaymentMethod(method)
                                                }
                                                className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                                                    selectedPaymentMethod === method
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                                                }`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        Reference (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentReference}
                                        onChange={(e) =>
                                            setPaymentReference(e.target.value)
                                        }
                                        placeholder="Transaction reference"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={startNewSale}
                                className="flex-1 rounded-full border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                disabled={cart.length === 0 || processing}
                                className="flex-1 rounded-full bg-emerald-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Complete Sale'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}