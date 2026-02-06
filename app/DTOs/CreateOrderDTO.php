<?php

namespace App\DTOs;

use App\Http\Requests\StoreOrderRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CreateOrderDTO
{
    public function __construct(
        public readonly int $user_id,
        public readonly string $notes , 
        public readonly string $payment_method,
        public readonly array $items,              // Array of OrderItemDTO
        public readonly OrderAddressDTO $address,  // Nested DTO
        public readonly ?string $coupon_code = null,
        public readonly float $tax   ,       
        public readonly float $shipping_cost  ,    
        public readonly float $discount_amount   ,  
        public readonly float $total_amount     ,   
        public readonly bool $paid     ,   
        public readonly string $paid_at     ,   
        public readonly string $confirmed     ,   
    ) {}
    
    public static function fromCheckout(array $data , array $calculations): self
    {
        $user_id = null ;
        if(Auth::user()){
            $user_id = Auth::user()->id;
        }

        return new self(
            user_id: $user_id,
            payment_method: $data['payment_method'],
            items: array_map(
                fn($item) => OrderItemDTO::fromArray($item),
                $data['items']
            ),
            address: OrderAddressDTO::fromArray($data['address']),
            coupon_code: $data['coupon_code'] ,
            notes : $data['notes']  ,
            tax : $calculations['tax']  ,
            discount_amount : $calculations['discount_amount'] ,
            shipping_cost : $calculations['shipping_cost']  ,
            paid : $calculations['paid'] ,
            paid_at : $calculations['paid_at'] ,
            confirmed : $calculations['confirmed'] ,
        );
    }
}


class OrderItemDTO
{
    public function __construct(
        public int $product_variant_Id,
        public int $quantity,
        public float $price,
    ) {}



    public static function fromArray(array $data): self
    {
        return new self(
             product_variant_Id: $data["product_variant_Id"],
             quantity: $data["quantity"],
             price: $data["price"],
            
        );
    }
}

// Nested DTO for address
class OrderAddressDTO
{
    public function __construct(
        public readonly string $full_name ,
        public string $address_line1,
        public string $address_line2,
        public string $city,
        public string $state,
        public string $postal_code,
        public string $country,
        public ?string $phone = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
             full_name: $data["full_name"],
             address_line1: $data["address_line1"],
            address_line2: $data["address_line2"],
            city: $data["city"],
            state: $data["state"],
            postal_code: $data[""],
            country: $data["country"],
            phone: $data["phone"],
        );
    }
}
