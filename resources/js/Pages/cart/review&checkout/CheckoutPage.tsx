// Pages/Checkout/CheckoutPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import Layout from "@/Layouts/Layout";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import { route } from "ziggy-js";
import PageHeader from "../shared/PageHeader";
import StepIndicator from "../shared/StepIndicator";
import PaymentMethodOptions from "./PaymentMethodOptions";
import CardPaymentForm from "./CardPaymentForm";
import MiniCartPreview from "../shared/MiniCardPreview";
import OrderSummaryCard from "../shared/OrderSummary";
import { isEmpty } from "lodash";
import { isEmptyObject } from "@/functions/product/souldSaveDraft";
import { Button } from "@/components/ui/button";
import ShippingAddressReview from "./ShippingAddressReview";
import axios from "axios";

type PaymentMethod = "COD" | "CARD";

interface CheckoutPageProps {
    cartItems: any[];
    tax: number;
    shippingData: any;
    onStepChange : (action : 'prev' | 'next' ) => void , 
    onChangeBackendErrors : ( errors : any) => void
}

export default function CheckoutPage({ cartItems, tax, shippingData ,onStepChange , onChangeBackendErrors  }: CheckoutPageProps) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();

    const [payment_method, setPayment_method] = useState<PaymentMethod>("COD");
    const [cardData, setCardData] = useState({
        card_number: "",
        expiry: "",
        cvv: "",
        cardholder_name: "",
    });
    const [coupon_code, setCoupon_code] = useState("");

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price_snapshot * item.quantity,
        0
    );
    const shipping = subtotal >= 50 ? 0 : 5.0;
    const discount = coupon_code ? -10.0 : 0;
    const total = subtotal + shipping + tax + discount;

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(shippingData)
        const orderData = {
            ...shippingData,
            payment_method,
            coupon_code: coupon_code || null,
        };

        router.post(route("order.checkout"), orderData, {
            onSuccess: () => alert("Order placed successfully!"),
            onError: (errors) => {
                console.log("Checkout errors:", errors);
                onChangeBackendErrors(errors)
            },
        });
    };

    const applyCouponWithFeedback = async () => {
        try{
            const res = await axios({method:"POST" , url : route("coupon.feedback") , data : {coupon_code}}) ; 
            if(res){
                alert(res.data.success)
            }

        }catch(err : any){
              console.log(err)
               const errorMessage = err.response?.data?.error || 'Failed to apply coupon';
               alert(errorMessage);
               console.log('Error applying coupon:', err);
        }

    }
    
    return (
       
            <div
                style={{ backgroundColor: theme.bg }}
                className="min-h-screen py-8"
            >
                <div className="container mx-auto px-4 max-w-7xl">
                    <form onSubmit={handlePlaceOrder}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Payment Options */}
                            <div className="lg:col-span-2 space-y-6">
                                <div
                                    style={{
                                        backgroundColor: theme.card,
                                        borderColor: theme.border,
                                    }}
                                    className="rounded-lg border p-6"
                                >
                                    <PageHeader
                                        title="Payment Method"
                                        backLink={() => onStepChange('prev')}
                                        backLabel="Back to Shipping"
                                        theme={theme}
                                    />

                                    <PaymentMethodOptions
                                        payment_method={payment_method}
                                        onPaymentMethodChange={setPayment_method}
                                        theme={theme}
                                    />

                                    {payment_method === "CARD" && (
                                        <div className="mt-6">
                                            <CardPaymentForm
                                                data={cardData}
                                                onChange={setCardData}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Shipping Address Review */}
                                <ShippingAddressReview {...{ onStepChange , shippingData  , theme}}  />
                            
                            </div>

                            {/* Right: Mini Cart + Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-4 space-y-4">
                                    <MiniCartPreview
                                        cartItems={cartItems}
                                        theme={theme}
                                    />

                                    <OrderSummaryCard
                                        applyCouponWithFeedback={applyCouponWithFeedback}
                                        subtotal={subtotal}
                                        shipping={shipping}
                                        tax={tax}
                                        total={total}
                                        discount={discount}
                                        coupon_code={coupon_code}
                                        onPromoChange={setCoupon_code}
                                        theme={theme}
                                        itemCount={cartItems.length}
                                        showPromoCode={true}
                                        showSecurityBadge={true}
                                        ctaButton={
                                            <button
                                                type="submit"
                                                style={{
                                                    backgroundColor: theme.primary,
                                                    color: theme.textInverse,
                                                    borderRadius: theme.borderRadius,
                                                }}
                                                className="w-full py-3 font-bold hover:opacity-90 transition-all mb-3"
                                            >
                                                {payment_method === "COD"
                                                    ? "Place Order (COD)"
                                                    : "Proceed to Payment"}
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

