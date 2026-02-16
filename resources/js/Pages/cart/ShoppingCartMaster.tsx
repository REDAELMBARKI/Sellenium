import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import CartPage from "./cartlisting/CartPage";
import { useEffect, useState } from "react";
import CheckoutPage from "./review&checkout/CheckoutPage";
import ShippingPage from "./shipping/ShippingPage";
import { isEmpty, set } from "lodash";
import { router, useForm, usePage } from "@inertiajs/react";
import StepIndicator from "./shared/StepIndicator";
import Layout from "@/Layouts/Layout";
import { ArrowLeft } from "lucide-react";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

// Pages/Cart/CartPage.tsx
interface ShoppingCartPageMasterProps {
    cartItems: any[];
    tax : number
}

export  default function ShoppingCartMaster({ cartItems = [] , tax = 0 }: ShoppingCartPageMasterProps){

    return (
        <StoreConfigProvider>
            <ShoppingCartCheckout {...{cartItems , tax}} />
        </StoreConfigProvider>
    )
}

function ShoppingCartCheckout({ cartItems = [] , tax = 0 }: ShoppingCartPageMasterProps) {
    const [step , setStep] = useState(0);
    const [backendErrors , setBackendErrors] = useState<any>({}) ;


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
            company : ""
        },
        notes: "",
    });

    
    const onChangeBackendErrors = (errors : any) => {
        setBackendErrors(errors) ;
    }


    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();
    

    const onStepChange = (action : 'prev' | 'next') => {
         setStep(prev => action === 'next' ? prev + 1 : prev - 1);
    }

    const stepsCompos : Record<string , React.ReactElement> = {
        '0' : <CartPage {...{cartItems  , onStepChange}} /> , 
        '1' : <ShippingPage {...{cartItems ,tax , shippingData, setShippingData , onStepChange , backendErrors  , onChangeBackendErrors }} /> , 
        '2' : <CheckoutPage {...{ cartItems , shippingData , tax  , onStepChange , onChangeBackendErrors }} /> , 
    };


   
   const stepName = step === 0 ? "cart" : step === 1 ? "shipping" : "checkout" ;
    
    return (
         <Layout currentPage={stepName} >

            <div>
                                   
                                        


                                            {/* Free Shipping Banner */}
                                        <div
                                            style={{
                                                backgroundColor: theme.success,
                                                color: theme.textInverse,
                                                borderRadius: theme.borderRadius,
                                            }}
                                            className="py-3 text-center font-semibold"
                                        >
                                            FREE SHIPPING UNLOCKED!
                                        </div>
                                  {   
                                            step > 0 && <StepIndicator currentStep={step} errors={backendErrors} />
                                        }

            </div> 
                {stepsCompos[step]}
        </Layout>
       
    );
}