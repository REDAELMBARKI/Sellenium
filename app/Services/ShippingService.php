<?php

namespace App\Services;

use App\DTOs\CreateOrderDTO;

class ShippingService
{
    /**
     * Create a new class instance.
     */
    public function __construct(private CartService $cartService)
    {
    }


    public function calculateShipping(array $items): float
    {
           // check if (has item > throsold_shipping) return 0 ;
           // check the city zone price ;
           // check the product weight ;
           return 0 ;
    }
}
