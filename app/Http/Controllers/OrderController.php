<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Http\Controllers\Controller;
use App\Http\Requests\CODOrderRequest;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\GoogleSheet;
use App\Models\Order;
use App\Services\OrderService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Testing\Fakes\Fake;
use Inertia\Inertia;

class OrderController extends Controller
{
  
    
    public function index() {
        $orderService = new OrderService() ;
        $sheet = GoogleSheet::where('key', 'orders')->first();
        return Inertia::render('admin/pages/orders/OrderManager' ,
        [

            'statistics' => $orderService->getStats() ,
            'orders' => $orderService->getOrders() ,
            'sheetUrl' => $sheet?->spreadsheet_url,
        ]
        ) ;

    }

    public function prepareOrderInfo(StoreOrderRequest $request , $isPaid = false , $paid_at = ''){
        $user = Auth::user() ; // null if QuestCOD Order
        return [
                'order_number' => random_int(1000000 , 9999999),
                'user_id' => $user,
                'confirmed' => $user ? true : false , // is au means payed with card here no need for cod call serivce confirrmation 
                'tax' => ''  , // no idea how to make the tax ,
                'currency' => 'MAD',
                'payment_method' =>  $request->payment_method,
                'paid' => $isPaid ,
                'paid_at' => $paid_at , // should make date empty if cod
                'shipping_cost' => '', // this is from sheeing table comes
                'discount_amount' => '', // no idea where to get this hsould i get htis frm a tabl e
                'notes' =>  Arr::only($request->validate()  , 'notes'),
            ];

    }
    private function prepareOrderItemData(StoreOrderRequest $request , Order $order , $user = null){
        return [

        ];
    }

    private function prepareOrderAddressData(StoreOrderRequest $request, Order $order){
        return [

        ];
    }

    public function store(StoreOrderRequest $request):void
    {
        throw new Exception();
    }

    public function checkout(StoreOrderRequest $request){
        $method = null ;
        if(!$request->has('payment_method') || ($request->payment_method !== 'CARD' && $request->payment_method !== 'COD')){
            return response()->json([
                'message' => 'payment method is required'
            ]); 
        }
        else{
            $method = $request->payment_method ; 
        }
        $user = Auth::user() ;
        $cartItems = null;
        if ($user) {
            $cartItems = Cart::where('user_id', $user->id)->get();
        } elseif (Cookie::has('cart_token')) {
            $cartItems = Cart::where('cart_token', Cookie::get('cart_token'))->get();
        } else {
            return response()->json([
                'message' => 'Cart is empty or expired. Please login or add items to cart.'
            ], 400);
        }
        
        // Check if cart is empty
        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Your cart is empty.'
            ], 400);
        }

        $total = $cartItems->sum(function ($item) {
            return $item->price_snapshot * $item->quantity;
        });

        if($request->has('coupon_code')){
           $total_discounted =  $this->applyDiscount($request->coupon_code , $total) ;
           $total = $total_discounted ;
        }

        $totalTTC =  $this->applyTaxes($request->coupon_code  , $total) ;
        $data = [...$this->prepareOrderInfo($request) , 'total_ttc' => $totalTTC] ;

        if($method === 'CARD'){
            $this->perceedToPaymentAndOrder_transaction($data);
        }else{
            $this->storeOrder($data);
        }
    }


    public function destroy(Order $order)
    {
        Order::destroy($order->id);
    }


    private function applyDiscount(string $coupon_code, float $total): float
    {
        $coupon = Coupon::where('code', $coupon_code)
            ->where('active', true)
            ->whereNull('expires_at')
            ->orWhere('expires_at', '>', now())
            ->select('code', 'type', 'value')
            ->first();

        if (!$coupon) {
            return $total;
        }

        $discount = 0;
        
        if ($coupon->type === 'fixed') {
            $discount = $coupon->value;
        } elseif ($coupon->type === 'percentage') {
            // Assuming value is stored as decimal (0.1 = 10%)
            $discount = $coupon->value * $total;
        }

        return max(0, $total - $discount);
    }

    private function applyTaxes($total)
    {
       return $total ;
    }

    private function storeOrder(array $data){
         return  Order::create($data);
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
