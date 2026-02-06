import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import Layout from "@/Layouts/Layout";
import {
    CreditCard,
    Banknote,
    MapPin,
    Phone,
    Package,
    Lock,
} from "lucide-react";
import { StyledCo } from "./styles/ShopingCartPageStyles";

type PaymentMethod = "cod" | "card";

interface ShoppingCartPageProps {
    items: any[];
    paymentMethod: PaymentMethod;
    onPaymentMethodChange: (method: PaymentMethod) => void;
    onPromoChange: (promo: string) => void;
    promoCode: string;
}




export default function ShoppingCartPage({
    items,
    paymentMethod,
    onPaymentMethodChange,
    onPromoChange,
    promoCode,
}: ShoppingCartPageProps){
   return (
       <Layout currentPage="shopping cart">
            <ShoppingCartContent 
             {...{
                items,
                paymentMethod,
                onPaymentMethodChange,
                onPromoChange,
                promoCode,
            }}

/>
       </Layout>
   )
}

function ShoppingCartContent({
    items,
    paymentMethod,
    onPaymentMethodChange,
    onPromoChange,
    promoCode,
}: ShoppingCartPageProps) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();

    const subtotal = (items || []).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return (
        
            <div
                style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    boxShadow: theme.shadowMd,
                }}
                className="border rounded-lg p-6 sticky top-4"
            >
                <h2
                    style={{ color: theme.text }}
                    className="text-xl font-bold mb-6"
                >
                    Order Summary
                    <StyledCo.Test >hello</StyledCo.Test>
                </h2>

                <div
                    className="space-y-4 mb-6 pb-6"
                    style={{
                        borderBottomColor: theme.border,
                        borderBottomWidth: "1px",
                    }}
                >
                    <div className="flex justify-between">
                        <span style={{ color: theme.textSecondary }}>
                            Subtotal
                        </span>
                        <span style={{ color: theme.text }}>
                            ${subtotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span style={{ color: theme.textSecondary }}>
                            Shipping
                        </span>
                        <span style={{ color: theme.text }}>
                            {shipping === 0 ? (
                                <span style={{ color: theme.success }}>
                                    Free
                                </span>
                            ) : (
                                `$${shipping.toFixed(2)}`
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span style={{ color: theme.textSecondary }}>
                            Tax (10%)
                        </span>
                        <span style={{ color: theme.text }}>
                            ${tax.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <input
                            type="text"
                            placeholder="Enter promo code"
                            value={promoCode}
                            onChange={(e) => onPromoChange(e.target.value)}
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
                        />
                        <button
                            style={{
                                backgroundColor: theme.secondary,
                                color: theme.text,
                            }}
                            className="px-4 py-2 rounded text-sm font-medium hover:opacity-80"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                <div
                    className="mb-6 pb-6"
                    style={{
                        borderBottomColor: theme.border,
                        borderBottomWidth: "1px",
                    }}
                >
                    <div className="flex justify-between items-center">
                        <span
                            style={{ color: theme.text }}
                            className="font-bold text-lg"
                        >
                            Total
                        </span>
                        <span
                            style={{ color: theme.primary }}
                            className="font-bold text-2xl"
                        >
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    <h3
                        style={{ color: theme.text }}
                        className="font-bold mb-4"
                    >
                        Payment Method
                    </h3>

                    <div className="space-y-2">
                        <label
                            className="flex items-center gap-3 p-3 rounded border cursor-pointer transition"
                            style={{
                                borderColor:
                                    paymentMethod === "cod"
                                        ? theme.primary
                                        : theme.border,
                                backgroundColor:
                                    paymentMethod === "cod"
                                        ? theme.bgSecondary
                                        : "transparent",
                            }}
                            onClick={() => onPaymentMethodChange("cod")}
                        >
                            <input
                                type="radio"
                                checked={paymentMethod === "cod"}
                                onChange={() => onPaymentMethodChange("cod")}
                                className="w-4 h-4"
                            />
                            <Banknote
                                size={20}
                                style={{ color: theme.primary }}
                            />
                            <div>
                                <div
                                    style={{ color: theme.text }}
                                    className="font-medium"
                                >
                                    Cash on Delivery
                                </div>
                                <div
                                    style={{ color: theme.textSecondary }}
                                    className="text-xs"
                                >
                                    Pay when you receive
                                </div>
                            </div>
                        </label>

                        <label
                            className="flex items-center gap-3 p-3 rounded border cursor-pointer transition"
                            style={{
                                borderColor:
                                    paymentMethod === "card"
                                        ? theme.primary
                                        : theme.border,
                                backgroundColor:
                                    paymentMethod === "card"
                                        ? theme.bgSecondary
                                        : "transparent",
                            }}
                            onClick={() => onPaymentMethodChange("card")}
                        >
                            <input
                                type="radio"
                                checked={paymentMethod === "card"}
                                onChange={() => onPaymentMethodChange("card")}
                                className="w-4 h-4"
                            />
                            <CreditCard
                                size={20}
                                style={{ color: theme.primary }}
                            />
                            <div>
                                <div
                                    style={{ color: theme.text }}
                                    className="font-medium"
                                >
                                    Card Payment
                                </div>
                                <div
                                    style={{ color: theme.textSecondary }}
                                    className="text-xs"
                                >
                                    Secure payment
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: theme.bgSecondary,
                        borderColor: theme.border,
                    }}
                    className="border rounded-lg p-4 mb-6"
                >
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <MapPin
                                size={18}
                                style={{ color: theme.primary }}
                                className="mt-0.5"
                            />
                            <div>
                                <div
                                    style={{ color: theme.textSecondary }}
                                    className="text-xs"
                                >
                                    Deliver to:
                                </div>
                                <div
                                    style={{ color: theme.text }}
                                    className="font-medium text-sm"
                                >
                                    123 Main St, New York, NY 10001
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone
                                size={18}
                                style={{ color: theme.primary }}
                                className="mt-0.5"
                            />
                            <div>
                                <div
                                    style={{ color: theme.textSecondary }}
                                    className="text-xs"
                                >
                                    Contact:
                                </div>
                                <div
                                    style={{ color: theme.text }}
                                    className="font-medium text-sm"
                                >
                                    +1 (555) 123-4567
                                </div>
                            </div>
                        </div>

                        {paymentMethod === "cod" && (
                            <div className="flex items-start gap-3">
                                <Package
                                    size={18}
                                    style={{ color: theme.primary }}
                                    className="mt-0.5"
                                />
                                <div>
                                    <div
                                        style={{ color: theme.textSecondary }}
                                        className="text-xs"
                                    >
                                        Payment:
                                    </div>
                                    <div
                                        style={{ color: theme.text }}
                                        className="font-medium text-sm"
                                    >
                                        Cash on Delivery
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {paymentMethod === "card" && (
                    <div
                        className="space-y-3 mb-6 pb-6"
                        style={{
                            borderBottomColor: theme.border,
                            borderBottomWidth: "1px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Card Number"
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                style={{
                                    borderColor: theme.border,
                                    backgroundColor: theme.bgSecondary,
                                    color: theme.text,
                                }}
                                className="border rounded px-3 py-2 text-sm focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                style={{
                                    borderColor: theme.border,
                                    backgroundColor: theme.bgSecondary,
                                    color: theme.text,
                                }}
                                className="border rounded px-3 py-2 text-sm focus:outline-none"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Cardholder Name"
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                            }}
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                        />
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        style={{
                            backgroundColor: theme.primary,
                            color: theme.textInverse,
                        }}
                        className="w-full py-3 rounded font-bold hover:opacity-90 transition"
                    >
                        {paymentMethod === "cod"
                            ? "Place Order (COD)"
                            : "Proceed to Payment"}
                    </button>
                    <button
                        style={{
                            backgroundColor: theme.secondary,
                            color: theme.text,
                        }}
                        className="w-full py-2 rounded font-medium hover:opacity-80 transition"
                    >
                        Continue Shopping
                    </button>
                </div>

                <div
                    className="flex items-center justify-center gap-4 mt-6 pt-6"
                    style={{
                        borderTopColor: theme.border,
                        borderTopWidth: "1px",
                    }}
                >
                    <div
                        className="flex items-center gap-1"
                        style={{ color: theme.textSecondary }}
                    >
                        <Lock size={14} />
                        <span className="text-xs">Secure Checkout</span>
                    </div>
                    <div
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                    >
                        ✓ SSL Protected
                    </div>
                </div>
            </div>
     
    );
}
