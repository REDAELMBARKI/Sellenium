// Pages/Checkout/CheckoutPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import Layout from "@/Layouts/Layout";
import { useState } from "react";
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

type PaymentMethod = "COD" | "CARD";

interface CheckoutPageProps {
    cartItems: any[];
    tax: number;
    shippingData: any;
    onStepChange : (action : 'prev' | 'next' ) => void
}

export default function CheckoutPage({ cartItems, tax, shippingData ,onStepChange }: CheckoutPageProps) {
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
        const orderData = {
            ...shippingData,
            payment_method,
            coupon_code: coupon_code || null,
        };

        router.post(route("order.checkout"), orderData, {
            onSuccess: () => console.log("Order placed successfully!"),
            onError: (errors) => console.error("Checkout errors:", errors),
        });
    };

    return (
        <Layout currentPage="checkout">
            <div
                style={{ backgroundColor: theme.bg }}
                className="min-h-screen py-8"
            >
                <div className="container mx-auto px-4 max-w-7xl">
                    <StepIndicator currentStep={3} />

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
        </Layout>
    );
}


const ShippingAddressReview = ({ shippingData, theme , onStepChange } : {onStepChange : (action : any) => void ,  shippingData : any , theme : any}) => {


    return (
                           <div
                                    style={{
                                        backgroundColor: theme.bgSecondary,
                                        borderColor: theme.border,
                                        borderRadius: theme.borderRadius,
                                    }}
                                    className="border p-4"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3
                                            style={{ color: theme.text }}
                                            className="font-semibold"
                                        >
                                            Shipping Address
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() =>
                                               onStepChange('prev')
                                            }
                                            style={{ color: theme.link }}
                                            className="text-xs hover:underline"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div
                                        style={{ color: theme.textSecondary }}
                                        className="text-sm space-y-1"
                                    >
                                        <p>
                                            {shippingData?.address?.first_name}{" "}
                                            {shippingData?.address?.last_name}
                                        </p>
                                        <p>{shippingData?.address?.address_line1}</p>
                                        {shippingData?.address?.address_line2 && (
                                            <p>{shippingData?.address?.address_line2}</p>
                                        )}
                                        <p>
                                            {shippingData?.address?.city}{" "}
                                            {shippingData?.address?.state}{" "}
                                            {shippingData?.address?.postal_code}
                                        </p>
                                    </div>

                                    {isEmptyObject(shippingData) &&  (<div className="flex flex-col items-center gap-4 mt-4">
                                                 <p className="text-center ">
                                                    no address (address is required)
                                                 </p>
                                                <div>
                                                    <Button onClick={() => onStepChange('prev')}>add address</Button>
                                                </div>
                                        </div> )}
                                </div>
    )
} ;