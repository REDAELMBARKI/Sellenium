<?php

namespace App\Http\Controllers;

use App\Services\Payment\StripePaymentGateway;
use App\Models\Order;
use Illuminate\Http\Request;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class StripeWebhookController extends Controller
{
    public function __construct(private StripePaymentGateway $gateway) {}

    public function handle(Request $request)
    {
        // Step 1 — verify request actually came from Stripe
        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature'),
                config('services.stripe.webhook_secret')
            );
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Step 2 — handle the event
        match ($event->type) {
            'payment_intent.amount_capturable_updated' => $this->onReadyToCapture($event),
            'payment_intent.payment_failed'            => $this->onPaymentFailed($event),
            'charge.refund.updated'                    => $this->onRefundUpdated($event),
            default                                    => null
        };

        return response()->json(['received' => true]);
    }

    // payment authorized — ready to capture
    private function onReadyToCapture($event): void
    {
        $intent = $event->data->object;
        $orderId = $intent->metadata->order_id;

        $order = Order::find($orderId);
        if (!$order) return;

        // capture the payment — money moves now
        $this->gateway->capturePayment($intent->id);

        // finalize the order
        // $order->update(['status' => 'paid']);
        // FinalizeOrder::dispatch($order);
    }

    // payment failed
    private function onPaymentFailed($event): void
    {
        $intent = $event->data->object;
        $orderId = $intent->metadata->order_id;

        // Order::where('id', $orderId)
        //     ->update(['status' => 'payment_failed']);
    }

    // refund status updated
    private function onRefundUpdated($event): void
    {
        $refund = $event->data->object;
        // update your payment record status
    }
}