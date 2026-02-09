
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';


const useStripeCaller = ({payment_method}:{payment_method : 'CARD' | 'COD'}) => {
    if(payment_method === 'COD') return ;

    const stripe = useStripe();
    const elements = useElements();
    const [stripeErrors , setStripeErrors ] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);

    if (!stripe || !elements) {
                setStripeErrors(prev => [...prev , "Stripe not loaded"]);
                return {stripeErrors} ;
    }

    setProcessing(true);
    setStripeErrors([]);

    
 
}