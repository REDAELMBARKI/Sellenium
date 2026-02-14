<?php

namespace App\Actions;

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

    public function execute(CreateOrderDTO $dto) 
    {
        $order = null ;

        if($dto->payment_method == 'COD'){
           Log::error('Processing COD order with DTO: ' . json_encode($dto->toArray()));
           $order =  $this->orderService->checkoutCOD($dto);
           Log::error('Finished processing COD order with ID: ' . $order->id);
        }else{
           $order =   $this->orderService->checkoutPayment($dto);
        }
      
        return $order ;

    }

    

  
}
