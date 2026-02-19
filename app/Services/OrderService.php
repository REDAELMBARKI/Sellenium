<?php

namespace App\Services;

use App\Context\CheckoutContext;
use App\DTOs\CreateOrderDTO;
use App\Exceptions\CheckoutException;
use App\Exceptions\CouponException;
use App\Exceptions\OrderException;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\User;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OrderService
{
        public function __construct(private CartService $cartService , 
                                  private CouponService $couponService , 
                                  private ShippingService $shippingService ,
                                  private TaxService $taxService
                                  
                                  ){
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

        
        public function checkoutCOD(CheckoutContext $context){
            Log::error('claculate dependencies');
            $calculations = $this->calculateOrderTotalWithDependencies($context);
            Log::error(' dependencies calculated');

            try {
                $dto = CreateOrderDTO::fromCheckout(
                    $context->dto->toArray(),
                    $context->user,
                    $calculations
                );
                 
                
            } catch (\Throwable $e) {
                Log::error('❌ DTO creation failed', [
                    'error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]);
                
                // re-throw if you want it to bubble up
                throw $e;
            }

            $contextUpdate = new CheckoutContext($dto , $context->user);

            try{
              $order =  $this->createOrderMaster($contextUpdate->dto);
              $this->cartService->clearCart($context->user);
              return $order ; 
            }catch(Exception $e){
               Log::error('Outer Create Order master - exception'. $e->getMessage());
               throw new CheckoutException($e->getMessage());
            }
        }
        
        public function checkoutPayment(CheckoutContext $context){
            $cod_calculations = $this->calculateOrderTotalWithDependencies($context);

            $dto =  CreateOrderDTO::fromCheckout(
                $context->dto->toArray(),
                        $context->user ,
            $cod_calculations
                    );
            $contextUpdate = new CheckoutContext($dto , $context->user);
            
            try{
                //  return $this->perceedToPaymentAndOrder_transaction($dto);
            }catch(Exception $e){
                throw new CheckoutException($e);
            }
        }

        
        public function createOrderMaster(CreateOrderDTO $dto){

               return  DB::transaction(function() use($dto){
                    $orderAttributes = Arr::except($dto->toArray() , []) ;
                    $order =  $this->storeOrder($orderAttributes);
                    $this->storeOrderItems($dto->items , $order);
                    // $this->decrementStock($dto->items);
                    $this->storeOrderAddress($dto->address->toArray() , $order);
                    Log::error("stored address successful") ; 
                    $this->updateCouponInOrderSuccess($dto->coupon_id );
                    

                    return $order;
                 });

        }

   
        private function updateCouponInOrderSuccess(int|string|null  $coupon_id ){
           if($coupon_id === null){
             return;
           }
           Coupon::find($coupon_id)->increment('times_used');
        }

        public function storeOrder(array $dto){
                try {
                    $order = Order::create($dto);
                    return $order;
                } catch (\Exception $e) {
                    Log::error('create order exc:' . $e->getMessage());
                    throw $e; // rethrow so the app still handles it properly
                }
        }

        public function storeOrderItems(array $items ,Order $order){
            return array_map(function($item) use($order){
                try{

                   $orderItem = $order->items()->create(Arr::except($item->toArray() , ['product' , 'product_variant']));
                   Log::error("stored order items sucessfull") ;
                   return $orderItem ;

                }catch (\Exception $e) {
                    Log::error('store order items error :'. $e->getMessage());
                }
            } , $items);
        }

        public function storeOrderAddress($address , Order $order){
            try{
                Log::error("stored address") ;

                return $order->address()->create($address);
            }
            catch (\Exception $e) {
                Log::error('sotre order address error :'. $e->getMessage());
            }
        }
     

       

        private function calculateOrderTotalWithDependencies(CheckoutContext $context) {
            $subtotal = $this->cartService->calculateCartItemsSubtotal($context->dto->items);

            // ======== discount secton ========================
            Log::error('get valid coupon run');
            $coupon = $this->couponService->getValidCoupon($context);
            Log::error('coupon valid' , ['coupon'=> $coupon]);
            $discount = 0;
            if ($coupon) {
                $discount = $this->calculateDiscount((float)$subtotal, $coupon);
                $discount = min($discount, (float)$subtotal); // never more than subtotal
            }
            // ======== shipping section ========================

            $shipping = $this->shippingService->calculateShipping($context->dto->items , $context->dto->address->city);

            // ======== tax secton ========================

            $tax = $this->taxService->calculate($subtotal - $discount);


            // ======== total secton ========================
 
            $total = $subtotal - $discount + $shipping + $tax;
            
            // ======== genrate a number unique for this order  secton ========================
            
            $order_number = $this->generateOrderNumber();

            return [
                'total_amount' => $total,
                'discount_amount' => $discount,
                'shipping_cost' => $shipping,
                'tax' => $tax,
                'order_number' => $order_number,
                'coupon_id' => $coupon?->id
            ];
        }
            
      
        
        private function calculateDiscount(float $total, Coupon $coupon): float {
            if ($coupon->type === 'fixed') {
                return (float)$coupon->value;
            } elseif ($coupon->type === 'percentage') {
                return $coupon->value * $total;
            }
            return 0;
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
