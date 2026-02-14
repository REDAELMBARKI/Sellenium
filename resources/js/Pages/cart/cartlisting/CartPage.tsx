// Pages/Cart/CartPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import Layout from "@/Layouts/Layout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import { ArrowLeft } from "lucide-react";
import { route } from "ziggy-js";
import StepIndicator from "../shared/StepIndicator";
import CartItemsList from "./CartItemsList";
import CartSummary from "./CartSummary";

interface CartPageProps {
    cartItems: any[];
    onStepChange : (action : 'prev' | 'next' ) => void
}


export default function CartPage({ cartItems , onStepChange }: CartPageProps) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();

    const [coupon_code, setCoupon_code] = useState("");

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price_snapshot * item.quantity,
        0
    );
    const shipping = subtotal >= 50 ? 0 : 15.94;

    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        router.patch(
            route("cart.update", itemId),
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onError: (errors) => console.error("Update error:", errors),
            }
        );
    };

    const handleRemoveItem = (itemId: number) => {
        router.delete(route("cart.destroy", itemId), {
            preserveScroll: true,
            onError: (errors) => console.error("Delete error:", errors),
        });
    };

    const handleProceedToCheckout = () => {
        onStepChange('next');
    };

    return (
            <div style={{ backgroundColor: theme.bg }} className="min-h-screen py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                
                     {/* Continue Shopping Button */}
                            <button
                                type="button"
                                onClick={() => router.visit("/")}
                                style={{ color: theme.link }}
                                className="mb-6 flex items-center gap-2 text-sm font-medium hover:underline"
                            >
                                <ArrowLeft size={16} />
                                CONTINUE SHOPPING
                            </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Cart Items */}
                        <div className="lg:col-span-2">
                           

                            {/* Cart Header */}
                            <div className="mb-6">
                                <h1 style={{ color: theme.text }} className="text-2xl font-bold">
                                    Shopping Cart ({cartItems.length} Item
                                    {cartItems.length !== 1 ? "s" : ""}): $
                                    {(subtotal + shipping).toFixed(2)}
                                </h1>
                            </div>

                            {/* Cart Items List */}
                            <CartItemsList
                                cartItems={cartItems}
                                theme={theme}
                                coupon_code={coupon_code}
                                onCouponChange={setCoupon_code}
                                onQuantityChange={handleQuantityChange}
                                onRemoveItem={handleRemoveItem}
                            />
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <CartSummary
                                subtotal={subtotal}
                                shipping={shipping}
                                itemCount={cartItems.length}
                                theme={theme}
                                onProceedToCheckout={handleProceedToCheckout}
                            />
                        </div>
                    </div>
                </div>
            </div>
    );
}