import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import CartPage from "./cartlisting/CartPage";
import { useState } from "react";
import CheckoutPage from "./review&checkout/CheckoutPage";
import ShippingPage from "./shipping/ShippingPage";
import { set } from "lodash";

// Pages/Cart/CartPage.tsx
interface ShoppingCartPageMasterProps {
    cartItems: any[];
    tax : number
}

export default function ShoppingCartCheckoutMaster({ cartItems = [] , tax = 0 }: ShoppingCartPageMasterProps) {
    const [step , setStep] = useState(1);
    const [shippingData, setShippingData] = useState({
        address: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            postal_code: "",
        },
        notes: "",
    });

    const onStepChange = (action : 'prev' | 'next') => {
         setStep(prev => action === 'next' ? prev + 1 : prev - 1);
    }

    const stepsCompos : Record<string , React.ReactElement> = {
        '1' : <CartPage {...{cartItems  , onStepChange}} /> , 
        '2' : <ShippingPage {...{cartItems ,tax , shippingData, setShippingData , onStepChange}} /> , 
        '3' : <CheckoutPage {...{ cartItems , shippingData , tax  , onStepChange}} /> , 
    };

    
    return (
        <StoreConfigProvider>
             {stepsCompos[step]}
        </StoreConfigProvider>
    );
}