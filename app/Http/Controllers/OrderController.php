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
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
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

    public function prepareOrderInfo(StoreOrderRequest $request){
        $user = Auth::user() ; // null if QuestCOD Order
        

        return [
            'order_number' => random_int(1000000 , 9999999),
            'user_id' => $user,
            'confirmed' => $user ? true : false , // is au means payed with card here no need for cod call serivce confirrmation 
            'tax' => ''  , // no idea how to make the tax ,
            'currency' => 'MAD',
            'payment_method' =>  $request->payment_method,
            'paid' => $user ? true : false ,
            'paid_at' => '' , // should make date empty if cod
            'shipping_cost' => '', // this is from sheeing table comes
            'discount_amount' => '', // no idea where to get this hsould i get htis frm a tabl e
            'notes' =>  Arr::only($request->validate()  , 'notes'),
        ];
        
    }

    public function store(StoreOrderRequest $request){

        if($request->has('coupon_code')){
           $totalPrice =  $this->calcTotalPrice($request->coupon_code) ; 
        }
        $order = Order::create();
    }

    public function checkout(StoreOrderRequest $request){
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
           $totalPrice =  $this->calcTotalPrice($request->coupon_code) ;
        }
    }


    public function update(Order $order){
        
    }


    public function destroy(Order $order){
        
    }


    private function calcTotalPrice($coupon_code){

         $discount = 0 ;
        
            $coupon = Coupon::where('code', $coupon_code)
            ->select('code', 'type', 'value')
            ->first();

            // if($coupon->type == 'fixed'){

            // }else if($coupon->type == 'percentage'){
            //     $discount = $coupon->value
            // }
        
    }

}
