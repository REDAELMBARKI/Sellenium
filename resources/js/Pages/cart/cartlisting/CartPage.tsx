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
import { useToast } from "@/contextHooks/useToasts";
import axios from "axios";

interface CartPageProps {
    items: any[];
    onStepChange : (action : 'prev' | 'next' ) => void
}


export default function CartPage({ items = [], onStepChange }: CartPageProps) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();

    const [coupon_code, setCoupon_code] = useState("");
    const {addToast} = useToast() ; 
    // Calculate totals
    const subtotal = items.reduce(
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

    const handleRemoveItem = async (id: number) => {
         try{
            const res = await axios({
            method: "DELETE",
            url: route("cart.destroy" ,{ id }),
         
            });

            if(res){
                 if (res.data.success) {
                        addToast({
                        type: "success",
                        title: "item deleted successfully plaise refresh the page ",
                        });
                    }
            }

        }catch(err : any){
               const errorMessage = err.response?.data?.error || 'Failed to Delete Item ';
                if(errorMessage){
                    addToast({
                            type: "error",
                            title: "Error",
                            description: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
                            });
                }
        }
    };

    const handleProceedToCheckout = () => {
        onStepChange('next');
    };

    return (
            <div  className="min-h-screen py-6">
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
                                    Shopping Cart ({items.length} Item
                                    {items.length !== 1 ? "s" : ""}): $
                                    {(subtotal + shipping).toFixed(2)}
                                </h1>
                            </div>

                            {/* Cart Items List */}
                            <CartItemsList
                                items={items}
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
                                itemCount={items.length}
                                theme={theme}
                                onProceedToCheckout={handleProceedToCheckout}
                            />
                        </div>
                    </div>
                </div>
            </div>
    );
}