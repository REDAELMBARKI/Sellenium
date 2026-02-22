<?php

namespace App\Http\Controllers;

use App\Actions\OrderAction;
use App\Context\Order\CheckoutContext;
use App\Context\Order\SingleOrderContext;
use App\DTOs\Order\CreateOrderDTO;
use App\DTOs\Order\OrderAddressDTO;
use App\DTOs\Order\OrderDTO;
use App\DTOs\Order\OrderItemDTO;
use App\Exceptions\CheckoutException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\OrderException;
use App\Exceptions\StockException;
use App\Http\Resources\OrderResource;
use App\Http\Controllers\Controller;
use App\Http\Requests\CODOrderRequest;
use App\Http\Requests\Order\CheckoutOrderRequest;
use App\Http\Requests\Order\SingleOrderRequest;
use App\Http\Resources\OrderTrackResource;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\GoogleSheet;
use App\Models\Order;
use App\Services\CartService;
use App\Services\DTOService;
use App\Services\OrderService;
use App\Services\ShippingService;
use App\Services\StockService;
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
        private ShippingService $shippingService , 
        private StockService $stockService ,
        private DTOService $dtoService ,
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

   
    public function store(SingleOrderRequest $request , OrderAction $action)
    {
         try {
         $user = Auth::user();
         $clientItemsParams = collect($request->validated('items')) ;
         $items = $this->stockService->getSingleOrderItems($clientItemsParams->pluck('variant_id')->toArray());
         $this->stockService->validateFromStore( $items ,$clientItemsParams);
         $itemsMatchToCheckoutDto = $this->dtoService->prepareItemsToMatchCheckoutItemDTO($items ,$clientItemsParams);
         $dto = CreateOrderDTO::fromRequest(array_merge($request->validated() , ['items' => $itemsMatchToCheckoutDto]) , $user);
         $context = new SingleOrderContext($dto , $user);
         $order = $action->execute($context);
         if( $order ){
                if(Auth::check()){
                    return redirect()
                    ->route('track.auth' , $order->id)
                    ->with('success', 'Order placed successfully!');
                }
                else{
                     return redirect()
                    ->route('track.guest' , $order->tracking_token)
                    ->with('success', 'Order placed successfully!');
                }
            }
            else{
                 throw new CheckoutException("failed to create the order plaise , refresh the page and  try again");
            }
         }
         catch (ValidationException $e) {
                         return back()->withErrors( $e->errors())->withInput();
         }
         catch (StockException $e) {
                         return back()->withErrors(['submit' => $e->getMessage()]);
         }
         catch (Exception $e) {
                         return back()->withErrors(['submit' => $e->getMessage()]);
         }

    }



    
    public function checkout(CheckoutOrderRequest $request , OrderAction $action , CartService $cartService)
    
    {

        try{
            $user = Auth::user();
            $this->validateCheckout($request, $cartService);
            $cartItems = $cartService->getCartItems(true);
            // Validate cart not empty
            if (is_null($cartItems) || $cartItems->isEmpty()) {
                throw new CheckoutException('Your cart is empty');
            }
            // validate stock
            $this->stockService->validateFromCheckout($cartItems) ;
             // dto object
            $dto = CreateOrderDTO::fromRequest(
                array_merge($request->validated() , ['items' => $cartItems->toArray()]) ,
                $user
            );
            $context = new CheckoutContext($dto , $user) ;
            $order = $action->execute($context);
            if( $order ){
                if(Auth::check()){
                    return redirect()
                    ->route('track.auth' , $order->id)
                    ->with('success', 'Order placed successfully!');
                }
                else{
                     return redirect()
                    ->route('track.guest' , $order->tracking_token)
                    ->with('success', 'Order placed successfully!');
                }
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

    public function authTrack(Order $order){

          if(Auth::id() !== $order->user_id){
               abort(403);
          }
 
       return  $this->renderTrackOrder($order);
    }

    
    public function guestTrack(string $token){
          if(Auth::check()){
               return redirect()->route('track.auth' , 'what can i send here sind here if noorder here should i just back him to wehre he was  ') ;
          }
        $order = Order::whereNull('user_id')
            ->where('tracking_token', $token)
            ->with(['items', 'address'])
            ->firstOrFail();

         return  $this->renderTrackOrder($order);

    }

    private function renderTrackOrder(Order $order){

        $order->load(['items','address' , 'coupon:id,code']);
        $order->address->makeHidden(['created_at', 'updated_at', 'order_id']);
        $order->items->makeHidden(['created_at' , 'updated_at']);
        $shipping = $this->shippingService->getZoneShippingInfo($order->address->city);

        return Inertia::render('orders/OrderTrack' , [
            'order' => $order->makeHidden(['paid_at' , 'paid']) ,
            'shipping' => $shipping
        ]);
    }
    private function validateCheckout(CheckoutOrderRequest $request, CartService $cartService): void
    {
        // Validate payment method
        if (!$request->has('payment_method') || !in_array($request->payment_method, ['COD', 'CARD'])) {
            throw new CheckoutException('Payment method is required');
        }
        
    }

    public function destroy(Order $order)
    {
        Order::destroy($order->id);
    }


   

   

    
}
