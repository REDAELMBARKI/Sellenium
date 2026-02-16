<?php

namespace App\Context;

use App\DTOs\CreateOrderDTO;
use App\Models\User;

class CheckoutContext
{
    /**
     * Create a new class instance.
     */
    public function __construct(public CreateOrderDTO $dto ,
                               public ?User $user
    )
    {
    }
}
