<?php

namespace App\Actions;

use App\DTOs\CreateOrderDTO;
use App\Services\OrderService;
use Illuminate\Support\Facades\DB;

class OrderAction
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private OrderService $orderService ,
    )
    {
    }

    public function execute(CreateOrderDTO $orderDTO) 
    {
        if ($this->orderService->getCartItems()->isEmpty()) 
        {
            return response()->json([
                'message' => 'Your cart is empty.'
            ], 400);
        }
        
        if($orderDTO->paymentMethod == 'CARD'){
            $this->orderService->checkoutCOD();
        }else{
            $this->orderService->checkoutPayment();
        }



    }

    

  
}
