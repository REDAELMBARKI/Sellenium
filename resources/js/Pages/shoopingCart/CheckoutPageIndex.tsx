// Pages/Checkout/CheckoutPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import Layout from "@/Layouts/Layout";
import { useState } from "react";
import { router, Link } from "@inertiajs/react";
import ShippingForm from "./ShippingForm";
import PaymentMethodSelector from "./PaymentMethodSelector";
import CardPaymentForm from "./CardPaymentForm";
import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import { Cover } from "@/types/inventoryTypes";
import OrderSummary from "./OrderSummary";

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
    tax
}: CheckoutPageProps) {
    return (
        <StoreConfigProvider>
            <CheckoutPage {...{ cartItems , tax }} />
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
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            zip_code: "",
            country: "",
        },
    });
    const [cardData, setCardData] = useState({
        card_number: "",
        expiry: "",
        cvv: "",
        cardholder_name: "",
    });
    const [promoCode, setPromoCode] = useState("");

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price_snapshot * item.quantity,
        0
    );
    const shipping = 5.0;
    const discount = promoCode ? -10.0 : 0;
    const total = subtotal + shipping + discount;
    
    const {payment_method_id} = useStripe();


    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
  
        let payment_method_id = null ;
        if(payment_method === 'CARD')
        {
           payment_method_id = loadStipe();
        }
        const orderData = {
            ...shippingData,
            payment_method,
            promo_code: promoCode || null,
            ...(payment_method === "CARD" && payment_method_id && { payment_method_id }),
        };

        router.post("/checkout", orderData, {
            onSuccess: () => {
                // Redirect to order confirmation
            },
            onError: (errors) => {
                console.error("Checkout errors:", errors);
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

                    <form onSubmit={handlePlaceOrder}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Forms */}
                            <div className="space-y-6">
                                {/* Payment Method Selector - AT TOP, FLEXED */}
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
                                        Payment Method
                                    </h2>
                                    
                                    {/* Flexed Payment Options */}
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymen_method("COD")}
                                            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                                                payment_method === "COD"
                                                    ? "border-blue-600 bg-blue-50"
                                                    : "border-gray-300 hover:border-gray-400"
                                            }`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <svg
                                                    className="w-8 h-8"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                <span
                                                    style={{ color: theme.text }}
                                                    className="font-medium"
                                                >
                                                    Cash on Delivery
                                                </span>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymen_method("CARD")}
                                            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                                                payment_method === "CARD"
                                                    ? "border-blue-600 bg-blue-50"
                                                    : "border-gray-300 hover:border-gray-400"
                                            }`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <svg
                                                    className="w-8 h-8"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                    />
                                                </svg>
                                                <span
                                                    style={{ color: theme.text }}
                                                    className="font-medium"
                                                >
                                                    Credit/Debit Card
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                             
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
                                        promoCode ,
                                        theme ,
                                        payment_method , 
                                        cardData , 
                                    }}
                                    onPromoChange={setPromoCode}
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