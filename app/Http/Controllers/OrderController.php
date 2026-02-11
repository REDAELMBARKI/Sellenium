<?php

namespace App\Http\Controllers;

use App\Actions\OrderAction;
use App\DTOs\CreateOrderDTO;
use App\DTOs\OrderAddressDTO;
use App\DTOs\OrderDTO;
use App\DTOs\OrderItemDTO;
use App\Exceptions\OrderException;
use App\Http\Resources\OrderResource;
use App\Http\Controllers\Controller;
use App\Http\Requests\CODOrderRequest;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\GoogleSheet;
use App\Models\Order;
use App\Services\CartService;
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

   
    public function store(StoreOrderRequest $request):void
    {
        throw new Exception();
    }

    // public function checkout(StoreOrderRequest $request){
    //     $method = null ;
        
    //     else{
    //         $method = $request->payment_method ; 
    //     }
   

        

    //     if($request->has('coupon_code')){
    //        $total_discounted =  $this->applyDiscount($request->coupon_code , $total) ;
    //        $total = $total_discounted ;
    //     } // how can i use this has function sice i dont call the logic here any more i can this in the sevice or action how can i check if the coupin is there shoul duse request methoods in side service class 

    // }

     // constroller

    public function checkoutSuccess(){
        return Inertia::render('checkout/OrderConfirmation');
    }
    public function checkout(StoreOrderRequest $request , OrderAction $action , CartService $cartService){
        $validationError = $this->validateCheckout($request, $cartService);
        if ($validationError) {
            return back()->withErrors([''=> $validationError]);
        }

        $cartItems = $cartService->getCartItems();
        $dto = CreateOrderDTO::fromRequest(array_merge($request->validated() , ['items' => $cartItems->toArray()]));
        
        try{
            $order = $action->execute($dto);
            if( $order ){
                return redirect()
                        ->route('checkout.success')
                        ->with('success', 'Order placed successfully!');
            }
            else{
                 return back()->withErrors([
                    'error'=> 'failed to create order'
                 ]);
            }
        }catch(Exception $e){
              return back()->withErrors([
                    'error' => 'failed to create order (execute) '
                 ]);
        }
    }

    private function validateCheckout(StoreOrderRequest $request, CartService $cartService): ?string
    {
        // Validate payment method
        if (!$request->has('payment_method') || !in_array($request->payment_method, ['COD', 'CARD'])) {
            return 'Payment method is required';
        }
        
        $cartItems = $cartService->getCartItems();
        
        // Validate cart not empty
        if ($cartItems->isEmpty()) {
            return 'Your cart is empty.';
        }
        
        // Validate stock availability
        foreach ($cartItems as $item) {
            if ($item->productVariant->stock < $item->quantity) {
                return "Insufficient stock for {$item->productVariant->product->name}";
            }
        }
        
        return null;
    }

    public function destroy(Order $order)
    {
        Order::destroy($order->id);
    }


   

   

    
}
