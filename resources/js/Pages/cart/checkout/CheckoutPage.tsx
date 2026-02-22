// Pages/Checkout/CheckoutPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import {  useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import PageHeader from "../shared/PageHeader";
import PaymentMethodOptions from "./PaymentMethodOptions";
import CardPaymentForm from "./CardPaymentForm";
import MiniCartPreview from "../shared/MiniCardPreview";
import OrderSummaryCard from "../shared/OrderSummary";
import ShippingAddressReview from "./ShippingAddressReview";
import axios from "axios";
import { useToast } from "@/contextHooks/useToasts";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

type PaymentMethod = "COD" | "CARD";

interface CheckoutPageProps {
    cartItems: any[];
    tax: number;
    shippingData: any;
    onStepChange : (action : 'prev' | 'next' ) => void , 
    onChangeBackendErrors : ( errors : any) => void
    onResetShippingData : () => void , 
    zone : any
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
export default function CheckoutPage({ cartItems, tax, shippingData ,onStepChange , zone ,onChangeBackendErrors , onResetShippingData  }: CheckoutPageProps) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();
    const [payment_method, setPayment_method] = useState<PaymentMethod>("COD");
    const [orderCreatedRespose, setOrderCreatedRespose] = useState({
        client_secret : undefined, 
        order_id : undefined
    });

    const [coupon_code, setCoupon_code] = useState("");
    const {addToast} = useToast()
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price_snapshot * item.quantity,
        0
    );
    const shipping = subtotal >= 50 ? 0 : 5.0;
    const discount = coupon_code ? -10.0 : 0;
    const total = subtotal + shipping + tax + discount;

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        const orderData = {
            ...shippingData,
            payment_method,
            coupon_code: coupon_code || null,
        };

        router.post(route("order.checkout"), orderData, {
            onSuccess: (page : any) => {
                    const {client_secret , order_id} = page.props ;
                    setOrderCreatedRespose({
                        client_secret ,
                        order_id
                    })
                    setCoupon_code("")
                    onResetShippingData()
                    onChangeBackendErrors([])
            },
            onError: (errors) => {
                  if (errors?.submit) {
                        addToast({
                        type: "error",
                        title: "Order failed",
                        description: Array.isArray(errors.submit) ? errors.submit[0] : errors.submit,
                        });
                    }
                onChangeBackendErrors(errors)
            },
        });
    };

    const applyCouponWithFeedback = async () => {
        try{
            const res = await axios({method:"POST" , url : route("coupon.feedback") , data : {coupon_code}}) ; 
            if(res){
                 if (res.data.success) {
                        addToast({
                        type: "success",
                        title: "Coupon Valid",
                        description: Array.isArray(res.data.success) ? res.data.success[0] : res.data.success,
                        });
                    }
            }

        }catch(err : any){
               const errorMessage = err.response?.data?.error || 'Failed to apply coupon';
                if(errorMessage){
                    addToast({
                            type: "error",
                            title: "Coupon failed",
                            description: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
                            });
                }
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
                                        zone={zone}
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
                                        {/* stripe payment form  */}
                                    {orderCreatedRespose.client_secret && (
                                        <Elements stripe={stripePromise} options={{ clientSecret: orderCreatedRespose.client_secret }}>
                                            <CardPaymentForm {...{ orderCreatedRespose }} />
                                        </Elements>)
                                     }
                                            
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
               
    );
}



