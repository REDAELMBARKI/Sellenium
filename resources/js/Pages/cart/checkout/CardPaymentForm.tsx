// PaymentForm.jsx
import { router } from '@inertiajs/react';
import { PaymentElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { route } from 'ziggy-js';
interface PaymentFormProps {
    orderCreatedRespose : any
}
export default function PaymentForm({orderCreatedRespose}:PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // stripe and elements not loaded yet
        if (!stripe || !elements) return;

        setLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // you already have orderId from Inertia onSuccess props
                return_url: route('auth.track', { order: orderCreatedRespose.order_id }), // ✅ 3DS redirects here with order id
            },
            redirect: 'if_required'
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else if (paymentIntent) {
            router.visit(route('auth.track', { order: orderCreatedRespose.order_id  }));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Stripe renders their payment form here */}
            <PaymentElement />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button disabled={!stripe || loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
}

