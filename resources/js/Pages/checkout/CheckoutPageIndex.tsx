// Pages/Checkout/CheckoutPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import Layout from "@/Layouts/Layout";
import { useState } from "react";
import { router, Link, useForm, usePage } from "@inertiajs/react";
import ShippingForm from "./ShippingForm";
import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import { Cover } from "@/types/inventoryTypes";
import OrderSummary from "./OrderSummary";
import useStripeCaller from "@/hooks/stripe/useStripeCaller";
import { route } from "ziggy-js";
import { method } from "lodash";

type PaymentMethod = "COD" | "CARD";
interface Attribute {
    name: string;
    value: string;
}
interface CartItem {
    id: number;
    quantity: number;
    price_snapshot: number;
    product_variant: {
        id: number;
        attributes: Attribute[];
        stock_quantity?: number;
        sku?: string;
        product: {
            id: number;
            name: string;
            slug?: string;
            description?: string;
            thumbnail?: Cover;
        };
    };
    subtotal?: number;
    created_at?: string;
    updated_at?: string;
}

interface CheckoutPageProps {
    cartItems: CartItem[];
    tax : number
}

export default function CheckoutPageIndex({
    cartItems = [],
    tax , 
}: CheckoutPageProps) {
    return (
        <StoreConfigProvider>
            <CheckoutPage {...{ cartItems , tax  }} />
        </StoreConfigProvider>
    );
}

// Step Indicator Component
function StepIndicator({ currentStep }: { currentStep: number }) {
    const steps = [
        { number: 1, label: "Cart" },
        { number: 2, label: "Review" },
        { number: 3, label: "Checkout" },
    ];

    return (
        <div className="flex items-center justify-center gap-4 mb-12">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    {/* Step Circle */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                                step.number <= currentStep
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-500"
                            }`}
                        >
                            {step.number < currentStep ? (
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                step.number
                            )}
                        </div>
                        <span
                            className={`mt-2 text-sm font-medium ${
                                step.number === currentStep
                                    ? "text-blue-600"
                                    : "text-gray-500"
                            }`}
                        >
                            {step.label}
                        </span>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                        <div
                            className={`w-16 h-0.5 mb-6 mx-2 ${
                                step.number < currentStep
                                    ? "bg-blue-600"
                                    : "bg-gray-200"
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

function CheckoutPage({ cartItems , tax }: CheckoutPageProps) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();

    const [payment_method, setPaymen_method] = useState<PaymentMethod>("COD");

    const [shippingData, setShippingData] = useState({
        address: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            address_line1 : '' , 
            address_line2 : '' ,
            city: "",
            state: "",
            postal_code: "",
        },
        notes : '' , 
    });
    const [cardData, setCardData] = useState({
        card_number: "",
        expiry: "",
        cvv: "",
        cardholder_name: "",
    });
    const [coupon_code, setCoupon_code] = useState("");
    const page = usePage()
    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price_snapshot * item.quantity,
        0
    );
    const shipping = 5.0;
    const discount = coupon_code ? -10.0 : 0;
    const total = subtotal + shipping + discount;
    
    // const {payment_method_id , createPaymentMethod , processing } = useStripeCaller({cardData , payment_method , userInfo : shippingData});
    
    const handleCheckout = (e:React.FormEvent) => {
        e.preventDefault();
        if(payment_method === 'CARD'){
        //   createPaymentMethod()
          handlePlaceOrder()
        }
        else{
            handlePlaceOrder();
        }
    }
    const handlePlaceOrder = () => {
        const orderData = {
            ...shippingData,
            payment_method,
            coupon_code : coupon_code || null,
            // ...(payment_method === "CARD" && payment_method_id && { payment_method_id }),
        };

        router.post(route("order.checkout"), orderData, {
            onSuccess: () => {
                // Redirect to order confirmation
                console.log('the order is successfuly done')
            },
            onError: (errors) => {
                console.error("Checkout errors:",  errors.error);

            },
        });
    };

   
    return (
        <Layout currentPage="checkout">
            <div
                style={{ backgroundColor: theme.primary }}
                className="min-h-screen py-8"
            >
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Step Indicator */}
                    <StepIndicator currentStep={3} />

                    <h1
                        style={{ color: theme.text }}
                        className="text-3xl font-bold mb-8"
                    >
                        Checkout
                    </h1>

                    <form onSubmit={handleCheckout}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Forms */}
                            <div className="space-y-6">
                                {/* Shipping Information - ALWAYS shows */}
                                <div
                                    style={{
                                        backgroundColor: theme.secondary,
                                    }}
                                    className="rounded-lg p-6"
                                >
                                    <h2
                                        style={{ color: theme.text }}
                                        className="text-xl font-semibold mb-6"
                                    >
                                        Shipping Information
                                    </h2>
                                    <ShippingForm
                                        data={shippingData}
                                        onChange={setShippingData}
                                        theme={theme}
                                    />
                                </div>
                            </div>

                            {/* Right Column - Cart Review & Summary */}
                            <div className="lg:sticky lg:top-8 h-fit">
                                <div
                                    style={{
                                        backgroundColor: theme.secondary,
                                    }}
                                    className="rounded-lg p-6"
                                >
                                    <h2
                                        style={{ color: theme.text }}
                                        className="text-xl font-semibold mb-6"
                                    >
                                        Review your cart
                                    </h2>

                                    {/* Product Preview - Show first item */}
                                    {cartItems.length > 0 && (
                                        <div className="space-y-4 mb-6">
                                            {cartItems.slice(0, 1).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex gap-4"
                                                >
                                                    {/* Product Image */}
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {item.product_variant.product.thumbnail ? (
                                                            <img
                                                                src={item.product_variant.product.thumbnail.url}
                                                                alt={item.product_variant.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1">
                                                        <h3
                                                            style={{ color: theme.text }}
                                                            className="font-medium mb-1"
                                                        >
                                                            {item.product_variant.product.name}
                                                        </h3>
                                                        <p
                                                            style={{ color: theme.text }}
                                                            className="text-sm opacity-70 mb-2"
                                                        >
                                                            {(item.product_variant.attributes || [])
                                                                .map((attr) => attr.value)
                                                                .join(", ")}
                                                        </p>
                                                        <p
                                                            style={{ color: theme.text }}
                                                            className="text-sm"
                                                        >
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>

                                                    {/* Price */}
                                                    <div
                                                        style={{ color: theme.text }}
                                                        className="font-semibold"
                                                    >
                                                        ${item.price_snapshot}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Show "View all items" link if more than 1 item */}
                                            {cartItems.length > 1 && (
                                                <Link
                                                    href="/cart"
                                                    className="text-blue-600 hover:underline text-sm inline-block"
                                                >
                                                    + {cartItems.length - 1} more item
                                                    {cartItems.length - 1 > 1 ? "s" : ""} (View all)
                                                </Link>
                                            )}
                                        </div>
                                    )}

                                    {/* Divider */}
                                    <div
                                        style={{ borderColor: theme.accent }}
                                        className="border-t my-6"
                                    />

                                    <OrderSummary 
                                     {...{
                                        subtotal ,
                                        shipping ,
                                        tax ,
                                        total ,
                                        coupon_code ,
                                        theme ,
                                        payment_method , 
                                        cardData , 
                                    }}
                                    onPaymentMethodChange={setPaymen_method}
                                    onPromoChange={setCoupon_code}
                                    onChange={setCardData}
                                    
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