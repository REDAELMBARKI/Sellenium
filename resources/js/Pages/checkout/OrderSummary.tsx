// Pages/Checkout/components/OrderSummary.tsx
import { Lock, Tag } from "lucide-react";
import { router } from '@inertiajs/react';
import { route } from "ziggy-js";
import CardPaymentForm from "./CardPaymentForm";
import PaymentMethodOptions from "./PaymentMethodOptions";

interface OrderSummaryProps {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    coupon_code: string;
    onPromoChange: (code: string) => void;
    payment_method: string;
    theme: any;
    cardData: any;
    onChange: (data: any) => void;
    onPaymentMethodChange: (method: any) => void;
}

export default function OrderSummary({
    payment_method , 
    onPaymentMethodChange ,
    subtotal,
    shipping,
    tax,
    total,
    coupon_code,
    onPromoChange,
    theme,
    cardData , 
    onChange 
}: OrderSummaryProps) {


    return (
        <div
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                boxShadow: theme.shadowMd,
            }}
            className="border rounded-lg p-6 sticky top-4"
        >
            <h2 style={{ color: theme.text }} className="text-xl font-bold mb-6">
                Order Summary
            </h2>
            
            {/* Price Breakdown */}
            <div
                className="space-y-3 mb-6 pb-6"
                style={{
                    borderBottomColor: theme.border,
                    borderBottomWidth: "1px",
                }}
            >
                <div className="flex justify-between">
                    <span style={{ color: theme.textSecondary }}>Subtotal</span>
                    <span style={{ color: theme.text }}>
                        ${subtotal}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span style={{ color: theme.textSecondary }}>Shipping</span>
                    <span style={{ color: theme.text }}>
                        {shipping === 0 ? (
                            <span style={{ color: theme.success }}>Free</span>
                        ) : (
                            `$${shipping}`
                        )}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span style={{ color: theme.textSecondary }}>Tax (10%)</span>
                    <span style={{ color: theme.text }}>${tax}</span>
                </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
                <label
                    style={{ color: theme.textSecondary }}
                    className="block text-sm mb-2"
                >
                    <Tag size={16} className="inline mr-2" />
                    Promo Code
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={coupon_code}
                        onChange={(e) => onPromoChange(e.target.value)}
                        style={{
                            borderColor: theme.border,
                            backgroundColor: theme.bgSecondary,
                            color: theme.text,
                        }}
                        className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
                        placeholder="Enter code"
                    />
                    <button
                        type="button"
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

            {/* Total */}
            <div
                className="mb-6 pb-6"
                style={{
                    borderBottomColor: theme.border,
                    borderBottomWidth: "1px",
                }}
            >
                <div className="flex justify-between items-center">
                    <span style={{ color: theme.text }} className="font-bold text-lg">
                        Total
                    </span>
                    <span style={{ color: theme.primary }} className="font-bold text-2xl">
                        ${total}
                    </span>
                </div>
            </div>
            <PaymentMethodOptions  {...{payment_method , theme , onPaymentMethodChange}}/>
            {
                payment_method === 'CARD' &&
                  <CardPaymentForm
                    data={cardData}
                    onChange={onChange}
                />
                              
            }

            {/* Place Order Button */}
            <button
                type="submit"
                style={{
                    backgroundColor: theme.primary,
                    color: theme.textInverse,
                }}
                className="w-full py-3 rounded font-bold hover:opacity-90 transition mb-3"
            >
                {payment_method === "COD" ? "Place Order (COD)" : "Proceed to Payment"}
            </button>

            <button
                type="button"
                onClick={() => window.history.back()}
                style={{
                    backgroundColor: theme.secondary,
                    color: theme.text,
                }}
                className="w-full py-2 rounded font-medium hover:opacity-80 transition"
            >
                Continue Shopping
            </button>

            {/* Security Badge */}
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
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                    ✓ SSL Protected
                </div>
            </div>
        </div>
    );
}