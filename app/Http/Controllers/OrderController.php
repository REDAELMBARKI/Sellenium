<?php

namespace App\Http\Controllers;

use App\Actions\OrderAction;
use App\Context\CheckoutContext;
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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Testing\Fakes\Fake;
use Inertia\Inertia;

class OrderController extends Controller
{
    
    public function __construct(
        private OrderService $orderService
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

    public function checkoutSuccess(){
        return Inertia::render('checkout/OrderConfirmation');
    }

    public function checkout(StoreOrderRequest $request , OrderAction $action , CartService $cartService){
        $validationError = $this->validateCheckout($request, $cartService);
        if ($validationError) {
            return back()->withErrors([''=> $validationError]);
        }
        $user = Auth::user();

        $cartItems = $cartService->getCartItems(true);
        Log::error('cart items goten' . $cartItems);
     
        
        // dto object
        $dto = CreateOrderDTO::fromRequest(
            array_merge($request->validated() , ['items' => $cartItems->toArray()]) ,
            $user
        );

        Log::error('dto created');
        $context = new CheckoutContext($dto , $user) ;
        Log::error('checkout contxt creatd ');

        try{
            $order = $action->execute($context);
            if( $order ){
                Log::error('order created succesfully x controller ');
                return redirect()
                        ->route('checkout.success')
                        ->with('success', 'Order placed successfully!');
            }
            else{
                Log::error('order created x controller ');

                 return back()->withErrors([
                    'submit'=> 'no order created ,  try again later'
                 ]);
            }
        }catch(Exception $e){
             Log::error('failed to cleare the eror x exception x controller ');

              return back()->withErrors([
                    'submit' => 'failed to create order (execute) '
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
        if (is_null($cartItems) || $cartItems->isEmpty()) {
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
