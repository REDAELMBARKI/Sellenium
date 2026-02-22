<?php

namespace App\Actions;

use App\Context\Order\CheckoutContext;
use App\Context\Order\SinglerOrderContext;
use App\DTOs\CreateOrderDTO;
use App\Services\OrderService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

    public function execute(CheckoutContext|SinglerOrderContext $context )
    {
        $order = null ;
        $dto = $context->dto;
        if($dto->payment_method == 'COD'){
           $order =  $this->orderService->placeOrder($context);
        }else{
           $order =   $this->orderService->checkoutPayment($context);
        }
        return $order ;
    }

    

  
}
