// Pages/Checkout/ShippingPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import Layout from "@/Layouts/Layout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import ShippingForm from "./ShippingForm";
import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import { route } from "ziggy-js";
import StepIndicator from "../shared/StepIndicator";
import PageHeader from "../shared/PageHeader";
import OrderSummaryCard from "../shared/OrderSummary";
import MiniCartPreview from "../shared/MiniCardPreview";
import { ShippingData } from "@/types/cart/shipping";

interface ShippingPageProps {
    cartItems: any[];
    tax: number;
    shippingData : ShippingData ,
    onStepChange : (action : 'prev' | 'next' ) => void,
    setShippingData : React.Dispatch<React.SetStateAction<ShippingData>>
}



export default function ShippingPage({ cartItems, tax  , shippingData, setShippingData , onStepChange}: ShippingPageProps) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();


    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price_snapshot * item.quantity,
        0
    );
    const shipping = subtotal >= 50 ? 0 : 5.0;
    const total = subtotal + shipping;

    const handleContinueToPayment = (e: React.FormEvent) => {
        e.preventDefault();
        onStepChange('next');
    };

    return (
        <Layout currentPage="checkout">
            <div
                style={{ backgroundColor: theme.bg }}
                className="min-h-screen py-8"
            >
                <div className="container mx-auto px-4 max-w-7xl">
                    <StepIndicator currentStep={2} />

                    {/* Free Shipping Banner */}
                    {subtotal >= 50 && (
                        <div
                            style={{
                                backgroundColor: theme.success,
                                color: theme.textInverse,
                            }}
                            className="mb-6 py-3 text-center font-semibold rounded-lg"
                        >
                            🎉 FREE SHIPPING UNLOCKED!
                        </div>
                    )}

                    <form onSubmit={handleContinueToPayment}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Shipping Form */}
                            <div className="lg:col-span-2">
                                <div
                                    style={{
                                        backgroundColor: theme.card,
                                        borderColor: theme.border,
                                    }}
                                    className="rounded-lg border p-6"
                                >
                                    <PageHeader
                                        title="Shipping Information"
                                        backLink={() => onStepChange('prev')}
                                        backLabel="Back to Cart"
                                        theme={theme}
                                    />

                                    <ShippingForm
                                        data={shippingData}
                                        onChange={setShippingData}
                                        theme={theme}
                                    />
                                </div>
                            </div>

                            {/* Right: Mini Cart + Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-4 space-y-4">
                                    <MiniCartPreview
                                        cartItems={cartItems}
                                        theme={theme}
                                    />

                                    <OrderSummaryCard
                                        subtotal={subtotal}
                                        shipping={shipping}
                                        tax={tax}
                                        total={total}
                                        theme={theme}
                                        itemCount={cartItems.length}
                                        ctaButton={
                                            <button
                                                type="submit"
                                                style={{
                                                    backgroundColor: theme.primary,
                                                    color: theme.textInverse,
                                                    borderRadius: theme.borderRadius,
                                                }}
                                                className="w-full py-3 font-bold hover:opacity-90 transition-all"
                                            >
                                                Continue to Payment
                                            </button>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}