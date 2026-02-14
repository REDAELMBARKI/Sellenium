// Pages/Checkout/ShippingPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import Layout from "@/Layouts/Layout";
import StepIndicator from "../shared/StepIndicator";
import PageHeader from "../shared/PageHeader";
import OrderSummaryCard from "../shared/OrderSummary";
import MiniCartPreview from "../shared/MiniCardPreview";
import { ShippingData } from "@/types/cart/shipping";
import { shippingSchema } from "@/shemas/checkout";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";
import ShippingForm from "./ShippingForm";
import { useEffect } from "react";

interface ShippingPageProps {
    cartItems: any[];
    tax: number;
    shippingData : ShippingData ,
    onStepChange : (action : 'prev' | 'next' ) => void,
    setShippingData : React.Dispatch<React.SetStateAction<ShippingData>>
    onChangeBackendErrors : (errors : any) => void
    backendErrors : any
}



export default function ShippingPage({ cartItems, tax  , shippingData, setShippingData , onStepChange , backendErrors , onChangeBackendErrors }: ShippingPageProps) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();
    const {register , handleSubmit , formState : {errors : ZodErrors , isDirty}} = useForm<any>(
        {resolver : zodResolver(shippingSchema) , mode : "onChange" , defaultValues : shippingData}
    ) ; 


    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price_snapshot * item.quantity,
        0
    );
    const shipping = subtotal >= 50 ? 0 : 5.0;
    const total = subtotal + shipping;
    
    const onValid: any = (data : any) => {
        onChangeBackendErrors({});
        setShippingData(data);
        onStepChange('next');
    };

    const handleContinueToPayment = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onValid)() ;
    };

    return (
      
            <div
                style={{ backgroundColor: theme.bg }}
                className="min-h-screen py-8"
            >
                <div className="container mx-auto px-4 max-w-7xl">

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
                                        {...{
                                            ZodErrors , 
                                            backendErrors , 
                                            register , 
                                            theme , 
                                            onChange:setShippingData
                                        }}
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
    );
}