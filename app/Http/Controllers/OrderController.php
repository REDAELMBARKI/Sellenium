<?php

namespace App\Http\Controllers;

use App\Actions\OrderAction;
use App\Context\CheckoutContext;
use App\DTOs\CreateOrderDTO;
use App\DTOs\OrderAddressDTO;
use App\DTOs\OrderDTO;
use App\DTOs\OrderItemDTO;
use App\Exceptions\CheckoutException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\OrderException;
use App\Http\Resources\OrderResource;
use App\Http\Controllers\Controller;
use App\Http\Requests\CODOrderRequest;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderTrackResource;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\GoogleSheet;
use App\Models\Order;
use App\Services\CartService;
use App\Services\OrderService;
use App\Services\ShippingService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Testing\Fakes\Fake;
use Illuminate\Validation\Rules\In;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    
    public function __construct(
        private OrderService $orderService , 
        private ShippingService $shippingService
    ) {}
    
    public function index() {
        $sheet = GoogleSheet::where('key', 'orders')->first();
        return Inertia::render('admin/pages/orders/OrderManager' ,
        [

            'statistics' => $this->orderService->getStats() ,
            'orders' => $this->orderService->getOrders() ,
            'sheetUrl' => $sheet?->spreadsheet_url,
        ]
        ) ;

    }

   
    public function store(StoreOrderRequest $request):void
    {
        throw new Exception();
    }

    public function trackOrder(Order $order){
        $order->load(['items','address' , 'coupon']);
        $shipping =  $this->shippingService->getZoneShippingInfo($order->address->city);

        $data = new OrderTrackResource($order);

        return Inertia::render('orders/TrackOrder' , $data);
    }

    public function checkout(StoreOrderRequest $request , OrderAction $action , CartService $cartService){

        try{
            $this->validateCheckout($request, $cartService);

            $user = Auth::user();

            $cartItems = $cartService->getCartItems(true);
        
        
             // dto object
            $dto = CreateOrderDTO::fromRequest(
                array_merge($request->validated() , ['items' => $cartItems->toArray()]) ,
                $user
            );

            $context = new CheckoutContext($dto , $user) ;


            $order = $action->execute($context);
            if( $order ){

                return redirect()
                        ->route('track' , $order->id)
                        ->with('success', 'Order placed successfully!');
            }
            else{
                 throw new CheckoutException("failed to create the order plaise , refresh the page and  try again");
            }

        }catch(ValidationException $e){
             return back()->withErrors( $e->errors())->withInput();
            
        }
        catch(Exception $e){
             return back()->withErrors(['submit' => $e->getMessage()]);
        }
    }

    private function validateCheckout(StoreOrderRequest $request, CartService $cartService): void
    {
        // Validate payment method
        if (!$request->has('payment_method') || !in_array($request->payment_method, ['COD', 'CARD'])) {
            throw new CheckoutException('Payment method is required');
        }
        
        $cartItems = $cartService->getCartItems();
        
        // Validate cart not empty
        if (is_null($cartItems) || $cartItems->isEmpty()) {

            throw new CheckoutException('Your cart is empty');

        }
        
        // Validate stock availability
        foreach ($cartItems as $item) {
            $stock = $item->productVariant->stock;
            $name  = $item->productVariant->product->name;

            if ($stock < $item->quantity) {
                if ($stock > 0) {
                    $message = "Only {$stock} items available for {$name} — please update your quantity.";
                } else {
                    $message = "{$name} is out of stock — please remove it from your cart.";
                }

                throw new CheckoutException($message);
            }
          }
        
    }

    public function destroy(Order $order)
    {
        Order::destroy($order->id);
    }


   

   

    
}
