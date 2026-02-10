import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState, useCallback } from 'react';

type PaymentMethodType = 'CARD' | 'COD';

interface UseStripeCallerProps {
  cardData: any;
  payment_method: PaymentMethodType;
  userInfo : {
     email : string , 
     name : string , 
     phone : string  ,
     address : any
  }
}

export default function useStripeCaller({ cardData, payment_method , userInfo }: UseStripeCallerProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [stripeErrors, setStripeErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [payment_method_id, setPayment_method_id] = useState<string | null>(null);

  // Function to call when creating a payment method
  const createPaymentMethod = useCallback(async () => {
    if (payment_method === 'COD') return;

    if (!stripe || !elements) {
      setStripeErrors(prev => [...prev, 'Stripe not loaded']);
      return;
    }

    setProcessing(true);
    setStripeErrors([]);

    try {

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardData!,
        billing_details: {
          name: userInfo.name, // replace with actual shippingData
          email: userInfo.email,
          phone : userInfo.phone
        },
      });

      if (error) {
        setStripeErrors(prev => [...prev, error.message || 'Unknown error']);
      } else {
        setPayment_method_id(paymentMethod?.id || null);
      }
    } catch (err: any) {
      setStripeErrors(prev => [...prev, err.message || 'Unknown error']);
    } finally {
      setProcessing(false);
    }
  }, [stripe, elements, cardData, payment_method]);

  return { stripeErrors, processing, payment_method_id, createPaymentMethod };
}
