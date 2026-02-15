<?php

namespace App\Services;

use App\DTOs\CreateOrderDTO;
use App\Exceptions\OrderException;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OrderService
{
        private $couponService ;
        private $cartService ;
        public function __construct(){
            $this->couponService = new CouponService() ;
            $this->cartService = new CartService();
        }
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

        
        public function checkoutCOD(CreateOrderDTO $dto){
            $calculations = $this->calculateOrderTotalWithDependencies($dto);
            $dto = CreateOrderDTO::fromCheckout($dto->toArray() , $calculations);
            try{
              $order = $this->createOrderMaster($dto);
              return $order;
            }catch(Exception $e){
               throw new OrderException($e);
            }
        }
        
        public function checkoutPayment($dto){
            $cod_calculations = $this->calculateOrderTotalWithDependencies($dto);
            $dto = CreateOrderDTO::fromCheckout($dto, $cod_calculations);
            try{
                // $order =  $this->perceedToPaymentAndOrder_transaction($dto);
                //  return $order;
            }catch(Exception $e){
                throw new OrderException($e);
            }
        }

        
        public function createOrderMaster(CreateOrderDTO $dto){
                $order = DB::transaction(function() use($dto){
                
                $orderAttributes = Arr::except($dto->toArray() , []) ;
                $order =  $this->storeOrder($orderAttributes);
                $this->storeOrderItems($dto->items , $order);
                
                $this->storeOrderAddress($dto->address->toArray() , $order);

                $this->updateCouponInOrderSuccess($dto->coupon_code , $order);
                return $order;
            });
            return $order;
        }

   
        private function updateCouponInOrderSuccess(string $coupon_code){
            // if(user per user and !auth->user() ) skip the coupon did not get applied
            // incriment times_use
            // check of (max == times used ) set to inactive
            // check for usage peruser if this has usage peruser and auth (if )
           
        }

        public function storeOrder(array $dto){
                try {
                    $order = Order::create($dto);
                    return $order;
                } catch (\Exception $e) {
                    throw $e; // rethrow so the app still handles it properly
                }
        }

        public function storeOrderItems(array $items ,Order $order){
            return array_map(function($item) use($order){
                try{
                   Log::error('item type ' . gettype($item));
                   $orderItem = $order->items()->create($item->toArray());
                   return $orderItem ;

                }catch (\Exception $e) {
                    Log::error('from create order items '. $e->getMessage());
                }
            } , $items);
        }

        public function storeOrderAddress($address , Order $order){
            try{

                return $order->address()->create($address);
            }
            catch (\Exception $e) {
                Log::error(''. $e->getMessage());
            }
        }
     
        private function calculateOrderTotalWithDependencies($dto){
            $subtotal = $this->cartService->calculateCartItemsSubtotal($dto->items);
            $discount = $this->calculateDiscount($dto->coupon_code, $subtotal);
            $shipping = $this->calculateShipping();
            $tax = $this->calculateTax($subtotal - $discount + $shipping);
            $total = $subtotal - $discount + $shipping + $tax;
            $order_number = $this->generateOrderNumber();

            return [
                'total_amount'=> $total,
                'discount_amount'=> $discount,
                'shipping_cost'=> $shipping ,
                'tax'=> $tax ,
                'order_number' => $order_number,
            ] ;
 
        }
     
        private function calculateShipping()
        {
           return 0 ;
        }

        private function calculateTax()
        {
           return 0 ;
        }
     

        private function calculateDiscount(?string $coupon_code , string $total)
        {
            if(!$coupon_code){
                return 0; // discount is zero if no coupon code provided
            }
          
            $coupon = $this->couponService->getDbCouponCodeMatch($coupon_code);
             
            $discount = 0;

            if(!$this->couponService->checkIsValidCoupon($coupon )){
               return 0;
            }
            
            if ($coupon->type === 'fixed') {
                $discount = $coupon->value;
            } elseif ($coupon->type === 'percentage') {
                // Assuming value is stored as decimal (0.1 = 10%)
                $discount = $coupon->value * $total;
            }

            return $discount;

        }

         

        private function generateOrderNumber() : string {
                // e.g. ORD-20260214-00001
                $date   = now()->format('Ymd');
                $last   = Order::whereDate('created_at', today())->count() + 1;
                $seq    = str_pad($last, 5, '0', STR_PAD_LEFT);
                return "ORD-{$date}-{$seq}";
            }
        
        // stripe payment
    // private function perceedToPaymentAndOrder_transaction(CreateOrderDTO $dto) : void
    // {
    //     $paymentIntent = $this->authorizePayment($dto->total_amount , $dto->payment_method_id);

    //     DB::transaction(function() use ($dto, $paymentIntent) {
    //         // 2. Create order
    //         $payment_calculations = [
    //              'confirmed' => true,
    //              'paid'=> true,
    //              'paid_at'=> now()
    //         ] ;

    //         $final_dto = CreateOrderDTO::fromPayment($dto->toArray() , $payment_calculations) ;
    //         $order = $this->createOrderMaster($final_dto);
            
    //         if (!$order) {
    //             // Cancel/refund the payment intent if it exists
    //             if ($paymentIntent) {
    //                 // Cancel the payment intent in Stripe
    //                 $this->cancelPayment($paymentIntent);
    //             }
                
    //             throw new \Exception('Failed to create order');
    //         }

    //         // 3. Capture the authorized payment
    //         $this->capturePayment($paymentIntent, $order->id);

    //         return $order ;
    //     });
    // }

    // private function authorizePayment(float $amount, $payment_method_id)
    // {
    //     // Initialize Stripe with your secret key
    //     \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
    //      $currency = env('STORE_CURRENCY');
    //     // Create a PaymentIntent - this HOLDS the money but doesn't charge yet
    //     $paymentIntent = \Stripe\PaymentIntent::create([
    //         'amount' => $amount * 100, // Stripe uses cents, so $50.00 = 5000
    //         'currency' => $currency,
    //         'capture_method' => 'manual', // CRITICAL: Don't auto-capture, we'll do it manually
    //         'payment_method' => $payment_method_id, // From frontend Stripe.js
    //         'confirmation_method' => 'manual', // We'll confirm it ourselves
    //         'confirm' => true, // Confirm immediately to authorize
    //     ]);
        
    //     // Check if authorization succeeded
    //     if ($paymentIntent->status !== 'requires_capture') {
    //         throw new \Exception('Payment authorization failed: ' . $paymentIntent->status);
    //     }
        
    //     return $paymentIntent; // Return the intent object to use later
    // }


    private function cancelPayment(){
        
    }

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
