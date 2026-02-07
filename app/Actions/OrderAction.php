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

    public function execute(CreateOrderDTO $dto) 
    {
        $order = null ;
        if($dto->payment_method == 'CARD'){
           $order =  $this->orderService->checkoutCOD($dto);
        }else{
           $order =   $this->orderService->checkoutPayment($dto);
        }
      
        return $order ;

    }

    

  
}
