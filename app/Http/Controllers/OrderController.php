<?php

namespace App\Http\Controllers;

use App\Actions\OrderAction;
use App\DTOs\CreateOrderDTO;
use App\DTOs\OrderAddressDTO;
use App\DTOs\OrderDTO;
use App\DTOs\OrderItemDTO;
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

   
    public function checkout2(StoreOrderRequest $request , OrderAction $action){
         $orderDTO = CreateOrderDTO::fromRequest($request->validated());
         $order = $action->execute($orderDTO);
         
         return response()->json($order, 201);
    }
    public function destroy(Order $order)
    {
        Order::destroy($order->id);
    }


   

   

    
}
