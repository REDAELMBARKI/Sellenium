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
    public function checkout(StoreOrderRequest $request , OrderAction $action){
        if(!$request->has('payment_method') || !in_array( $request->payment_method  , ['COD' , 'CARD']) ){
            return response()->json([
                'message' => 'payment method is required'
            ]);
        }

        $cartItems = Cart::where('user_id', Auth::user()->id )
        ->orWhere('cart_token' , Cookie::get('cart_token'))
        ->with('product')
        ->get();
    

        // Validate stock
        foreach ($cartItems as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json([
                    'error' => "Insufficient stock for {$item->product->name}"
                ], 400);
            }
        }
    

        $dto = CreateOrderDTO::fromRequest($request->validated());
        if (empty($dto->items))
        {
            return response()->json([
                'message' => 'Your cart is empty.'
            ], 400);
        }
        
        try{
            $order = $action->execute($dto);
            return response()->json($order, 201);
        }catch(Exception $e){
             throw new OrderException($e);
        }
    }
    public function destroy(Order $order)
    {
        Order::destroy($order->id);
    }


   

   

    
}
