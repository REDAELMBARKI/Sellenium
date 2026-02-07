// Pages/Checkout/CheckoutPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import Layout from "@/Layouts/Layout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import ShippingForm from "./ShippingForm";
import PaymentMethodSelector from "./PaymentMethodSelector";
import CardPaymentForm from "./CardPaymentForm";
import CartItemsList from "./CartItemsList";
import OrderSummary from "./OrderSummary";
import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";

type PaymentMethod = "COD" | "CARD";

interface CartItem {
    id: number;
    product_variant_id: number;
    quantity: number;
    product_variant: {
        id: number;
        name: string;
        price: number;
        old_price?: number;
        stock: number;
        sku: string;
        image?: string;
        product: {
            id: number;
            name: string;
            description?: string;
        };
    };
}

interface CheckoutPageProps {
    cartItems: CartItem[];
}

export default function CheckoutPageIndex ({cartItems = []} : CheckoutPageProps){
    return (
        <StoreConfigProvider>
             <CheckoutPage  {...{cartItems}} />
        </StoreConfigProvider>
    )
}
 function CheckoutPage({ cartItems }: CheckoutPageProps) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
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
        (sum, item) => sum + item.product_variant.price * item.quantity,
        0
    );
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const handleQuantityChange = (cartId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        router.put(
            `/cart/${cartId}`,
            { quantity: newQuantity },
            {
                preserveScroll: true,
            }
        );
    };

    const handleDeleteItem = (cartId: number) => {
        router.delete(`/cart/${cartId}`, {
            preserveScroll: true,
        });
    };

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();

        const orderData = {
            ...shippingData,
            payment_method: paymentMethod,
            promo_code: promoCode || null,
            ...(paymentMethod === "CARD" && { card: cardData }),
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
                <div className="container mx-auto px-4">
                    <h1
                        style={{ color: theme.text }}
                        className="text-3xl font-bold mb-8"
                    >
                        Checkout
                    </h1>

                    <form onSubmit={handlePlaceOrder}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Cart Items & Forms */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Cart Items */}
                                <CartItemsList
                                    items={cartItems}
                                    onQuantityChange={handleQuantityChange}
                                    onDelete={handleDeleteItem}
                                    theme={theme}
                                />

                                {/* Shipping Information */}
                                <ShippingForm
                                    data={shippingData}
                                    onChange={setShippingData}
                                    theme={theme}
                                />

                                {/* Payment Method */}
                                <PaymentMethodSelector
                                    selected={paymentMethod}
                                    onChange={setPaymentMethod}
                                    theme={theme}
                                />

                                {/* Card Payment Form (conditional) */}
                                {paymentMethod === "CARD" && (
                                    <CardPaymentForm
                                        data={cardData}
                                        onChange={setCardData}
                                        theme={theme}
                                    />
                                )}
                            </div>

                            {/* Right Column - Order Summary */}
                            <div className="lg:col-span-1">
                                <OrderSummary
                                    subtotal={subtotal}
                                    shipping={shipping}
                                    tax={tax}
                                    total={total}
                                    promoCode={promoCode}
                                    onPromoChange={setPromoCode}
                                    paymentMethod={paymentMethod}
                                    theme={theme}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}