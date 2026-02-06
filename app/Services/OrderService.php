<?php

namespace App\Services;

use App\DTOs\CreateOrderDTO;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;

class OrderService
{
    

        public function getOrders(){
           return OrderResource::collection(Order::with('user:id,name,email' , 'orderItems.product.thumbnail' , 'address')->paginate(10));
        }

        public function getStats(){
            return [
            'total' => [
                'count' => 12,
                'change_percent' => 12.5
            ],
            'pending' => [
                'count' => 3,
                'change_percent' => 5.1
            ],
            'out_for_delivery' => [
                'count' => 0,
                'change_percent' => 0
            ],
            'delivered' => [
                'count' => 0,
                'change_percent' => 0
            ],
            'delivery_failed' => [
                'count' => 0,
                'change_percent' => 0
            ],
            'returned' => [
                'count' => 1,
                'change_percent' => 2.3
            ],
            'confirmed' => [
                'count' => 0,
                'change_percent' => 0
            ],
            'canceled' => [
                'count' => 1,
                'change_percent' => 8.2
            ],
        ];
        }

        
        public function checkoutCOD($dto){
            $subtotal = $this->calculateSubtotal($dto->items);
            $discount = $this->calculateDiscount($dto->couponCode, $subtotal);
            $shipping = $this->calculateShipping();
            $tax = $this->calculateTax($subtotal - $discount + $shipping);
            $total = $subtotal - $discount + $shipping + $tax;
            $calculated = [] ;
            
            $calculated['total_amount'] = $total;
            $this->createOrderMaster($dto);
        }
        
        public function checkoutPayment($dto){
            $total = $this->getCartItemsTotalPrice();
        }

        
        public function createOrderMaster($dto){
            DB::transaction(function() use($dto){
                $order =  $this->storeOrder(Arr::except($dto , ['items' , 'address']));
                $this->storeOrderItems($dto , $order['items']);
                $this->storeOrderAddress($dto['address'] , $order);
                return $order;
            });
        }

        public function storeOrder($dto){
            return Order::create($dto);
        }

        public function storeOrderItems(array $dtos ,Order $order){
            return $order->items()->create($dtos);
        }

        public function storeOrderAddress($dto , Order $order){
            return $order->address()->create($dto);
        }

     
        private function calculateShipping()
        {
           return 0 ;
        }

        private function calculateTax()
        {
           return 0 ;
        }

        private function calculateDiscount(string $coupon_code , string $total)
        {
              $coupon = Coupon::where('code', $coupon_code)
                ->where('active', true)
                ->whereNull('expires_at')
                ->orWhere('expires_at', '>', now())
                ->select('code', 'type', 'value')
                ->first();

            

            $discount = 0;
            
            if ($coupon->type === 'fixed') {
                $discount = $coupon->value;
            } elseif ($coupon->type === 'percentage') {
                // Assuming value is stored as decimal (0.1 = 10%)
                $discount = $coupon->value * $total;
            }

            return $discount;

        }

        public  function getCartItems(){
            $user = Auth::user();
            $cartItems = null;
            if ($user) {
                $cartItems = Cart::where('user_id', $user->id)->get();
            } elseif (Cookie::has('cart_token')) {
                $cartItems = Cart::where('cart_token', Cookie::get('cart_token'))->get();
            } 
            return $cartItems;
        }

        private function calculateSubtotal($items){
            return  $items->sum(function ($item) {
                         return $item->price_snapshot * $item->quantity;
                     });
        }

        // stripe payment
    // private function perceedToPaymentAndOrder_transaction(array $data) : void
    // {
    //     $paymentIntent = $this->authorizePayment($data['total_ttc']);

    //     DB::transaction(function() use ($data, $paymentIntent) {
    //         // 2. Create order
    //         $order = $this->storeOrder($data);
            
    //         // 3. Capture the authorized payment
    //         $this->capturePayment($paymentIntent, $order->id);
    //     });
    // }

    // private function authorizePayment(float $amount, string $currency = 'usd')
    // {
    //     // Initialize Stripe with your secret key
    //     \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
        
    //     // Create a PaymentIntent - this HOLDS the money but doesn't charge yet
    //     $paymentIntent = \Stripe\PaymentIntent::create([
    //         'amount' => $amount * 100, // Stripe uses cents, so $50.00 = 5000
    //         'currency' => $currency,
    //         'capture_method' => 'manual', // CRITICAL: Don't auto-capture, we'll do it manually
    //         'payment_method' => request()->payment_method_id, // From frontend Stripe.js
    //         'confirmation_method' => 'manual', // We'll confirm it ourselves
    //         'confirm' => true, // Confirm immediately to authorize
    //     ]);
        
    //     // Check if authorization succeeded
    //     if ($paymentIntent->status !== 'requires_capture') {
    //         throw new \Exception('Payment authorization failed: ' . $paymentIntent->status);
    //     }
        
    //     return $paymentIntent; // Return the intent object to use later
    // }

    // private function capturePayment($paymentIntent, int $orderId)
    // {
    //     // Initialize Stripe again (in case different request)
    //     \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
        
    //     // Capture the authorized payment - NOW the money actually moves
    //     $captured = \Stripe\PaymentIntent::retrieve($paymentIntent->id);
    //     $captured->capture([
    //         'metadata' => ['order_id' => $orderId] // Link payment to order for records
    //     ]);
        
    //     // Verify capture succeeded
    //     if ($captured->status !== 'succeeded') {
    //         throw new \Exception('Payment capture failed');
    //     }
        
    //     return $captured;
    // }

}
