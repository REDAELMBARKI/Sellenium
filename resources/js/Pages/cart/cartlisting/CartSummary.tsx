// Pages/Cart/components/CartSummary.tsx
import { ThemePalette } from "@/types/ThemeTypes";

interface CartSummaryProps {
    subtotal: number;
    shipping: number;
    itemCount: number;
    theme: ThemePalette;
    onProceedToCheckout: () => void;
}

export default function CartSummary({
    subtotal,
    shipping,
    itemCount,
    theme,
    onProceedToCheckout,
}: CartSummaryProps) {
    const total = subtotal + shipping;
    const isFreeShipping = subtotal >= 50;

    return (
        <div
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                boxShadow: theme.shadowMd,
                borderRadius: theme.borderRadius,
            }}
            className="border rounded-lg p-6 sticky top-4"
        >
            <h3 style={{ color: theme.text }} className="text-lg font-bold mb-4">
                Order Summary
            </h3>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                    <span style={{ color: theme.textSecondary }}>
                        Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""}):
                    </span>
                    <span style={{ color: theme.text }} className="font-semibold">
                        ${subtotal.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span style={{ color: theme.textSecondary }}>Shipping:</span>
                    <span style={{ color: theme.text }} className="font-semibold">
                        ${shipping.toFixed(2)}
                    </span>
                </div>

                {/* Free Shipping Progress */}
                {isFreeShipping ? (
                    <div
                        style={{
                            backgroundColor: theme.success + "20",
                            color: theme.success,
                            borderRadius: theme.borderRadius,
                        }}
                        className="text-xs p-2 font-medium"
                    >
                        ✓ You've qualified for FREE shipping!
                    </div>
                ) : (
                    <div
                        style={{
                            backgroundColor: theme.warning + "20",
                            color: theme.warning,
                            borderRadius: theme.borderRadius,
                        }}
                        className="text-xs p-2"
                    >
                        Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                    </div>
                )}
            </div>

            {/* Total */}
            <div style={{ borderColor: theme.border }} className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span style={{ color: theme.text }} className="font-bold text-lg">
                        TOTAL:
                    </span>
                    <span style={{ color: theme.primary }} className="font-bold text-2xl">
                        ${total.toFixed(2)}
                    </span>
                </div>
                {isFreeShipping && (
                    <div
                        style={{
                            backgroundColor: theme.success,
                            color: theme.textInverse,
                            borderRadius: theme.borderRadius,
                        }}
                        className="text-xs font-semibold px-2 py-1 inline-block mt-2"
                    >
                        FREE SHIPPING!
                    </div>
                )}
            </div>

            {/* Proceed to Checkout Button */}
            <button
                type="button"
                onClick={onProceedToCheckout}
                disabled={itemCount === 0}
                style={{
                    backgroundColor: theme.primary,
                    color: theme.textInverse,
                    borderRadius: theme.borderRadius,
                }}
                className="w-full py-3 font-bold hover:opacity-90 transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                PROCEED TO CHECKOUT
            </button>

            {/* Express Checkout Divider */}
            <div className="text-center mb-4">
                <span style={{ color: theme.textMuted }} className="text-xs">
                    OR
                </span>
            </div>

            {/* PayPal Button */}
            <button
                type="button"
                style={{
                    backgroundColor: "#FFC439",
                    color: "#003087",
                    borderRadius: theme.borderRadius,
                }}
                className="w-full py-3 font-bold hover:opacity-90 transition-all mb-6"
            >
                <span className="block text-xs">EXPRESS CHECKOUT</span>
                <span className="text-2xl">Pay</span>
                <span className="text-2xl font-bold">Pal</span>
            </button>

            {/* Money-Back Guarantee */}
            <div
                style={{
                    borderColor: theme.border,
                    color: theme.textSecondary,
                }}
                className="pt-4 border-t flex items-center gap-2 text-xs"
            >
                <span>✓</span>
                <span>30-Day Money-Back Guarantee</span>
            </div>
        </div>
    );
}