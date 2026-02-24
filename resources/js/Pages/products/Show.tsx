import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import { useEffect, useState } from "react";
import { isEmpty, set } from "lodash";
import { router, useForm, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { ArrowLeft } from "lucide-react";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { route } from "ziggy-js";
import CheckoutPage from "../cart/checkout/CheckoutPage";
import ShippingPage from "../cart/shipping/ShippingPage";
import ProductDetails from "./ProductDetails";
import StepIndicator from "../cart/shared/StepIndicator";

// Pages/Cart/CartPage.tsx
interface ShowPageMasterProps {
   tax : number
}

export default function Show({tax =  2}: ShowPageMasterProps) {
    const [step , setStep] = useState(0);
    const [backendErrors , setBackendErrors] = useState<any>({}) ;
    const [items , setItems]= useState([]) ; 
    // const [zone , setZone] 

    const [shippingData, setShippingData] = useState({
        address: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            address_line1: "",
            address_line2: "",
            city: "",
        },
        notes: "",
    });
    const [productUrl] = useState(() => window.location.pathname);
    
    const onChangeBackendErrors = (errors : any) => {
        setBackendErrors(errors) ;
    }


    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();
    

    const stepUrls: Record<number, string> = {
             0: `${productUrl}`,
             1: `/checkout?step=shipping`,
             2: `/checkout?step=payment`,
        };

        const urlSteps: Record<string, number> = {
            '':          0,
            'shipping': 1,
            'payment':  2,
        };

        // step → update URL
 

    useEffect(() => {
        const syncStepFromUrl = () => {
                const params = new URLSearchParams(window.location.search);
                const step = params.get('step') ?? '';
                setStep(urlSteps[step] ?? 0);
        };

        // sync on mount
        syncStepFromUrl();

        // sync on browser back/forward
        window.addEventListener('popstate', syncStepFromUrl);
        return () => window.removeEventListener('popstate', syncStepFromUrl);
    }, []);


       const onStepChange = (action: 'prev' | 'next') => {
            const newStep = action === 'next' ? step + 1 : step - 1;
            setStep(newStep);
            //  ineed to empty this history in each decrement bro when iplay iwht increment decrement it gets accumulated
            window.history.pushState({}, '', stepUrls[newStep]);
        };
    const onResetShippingData = () => {
      setShippingData({
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
    })
    } 

    const stepsCompos : Record<string , React.ReactElement> = {
        '0' : <ProductDetails  {...{ onStepChange }} /> , 
        '1' : <ShippingPage {...{items ,tax , shippingData, setShippingData , onStepChange , backendErrors  , onChangeBackendErrors }} /> , 
        '2' : <CheckoutPage {...{ postUrl : "order.buynow" , items , shippingData , tax , onStepChange , onChangeBackendErrors ,onResetShippingData}} /> , 
    };


   
   const stepName = step === 0 ? "cart" : step === 1 ? "shipping" : "checkout" ;
    
    return (
         <Layout 
            seo={{ 
             title : '' , 
             description : ''
          }}
          currentPage={stepName} >

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

Show.layout = (page : any) => <StoreConfigProvider >{page}</StoreConfigProvider>