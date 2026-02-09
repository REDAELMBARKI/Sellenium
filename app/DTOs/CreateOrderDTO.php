<?php

namespace App\DTOs;

use App\Http\Requests\StoreOrderRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CreateOrderDTO
{
    public function __construct(
        public readonly string $order_number , 
        public readonly string $payment_method_id , 
        public readonly int $user_id,
        public readonly string $notes , 
        public readonly string $payment_method,
        public readonly array $items,              // Array of OrderItemDTO
        public readonly OrderAddressDTO $address,  // Nested DTO
        public readonly ?string $coupon_code = null,
        public readonly int $paid_at,
        public readonly int $paid ,
        public readonly string $tax = 0,
        public readonly string $confirmed = false,
        public readonly string $total_amount = 0 ,
        public readonly string $discount_amount = 0 ,
        public readonly string $shipping_cost = 0,
        
    ) {}
    
    public static function fromRequest(array $data , ?array $calulations = []): self
    {
        $user_id = null ;
        if(Auth::user()){
            $user_id = Auth::user()->id;
        }

        return new self(
            user_id: $user_id,
            payment_method: $data['payment_method'],
            payment_method_id: $data['payment_method_id'],
            items: array_map(
                fn($item) => OrderItemDTO::fromArray($item),
                $data['items']
            ),
            address: OrderAddressDTO::fromArray($data['address']),
            coupon_code: $data['coupon_code'] ,
            notes : $data['notes']  ,

            shipping_cost: $calulations['shipping_cost'] ?? 0 ,
            total_amount: $calulations['total_amount'] ?? 0,
            tax : $calulations['tax'] ?? 0,
            confirmed: $calulations['confirmed'] ?? false,
            paid : $calulations['paid'] ?? false ,
            paid_at : $calulations['paid_at'] ?? null,
            discount_amount: $calulations['discount_amount'] ??  0,
            order_number: $calulations['order_number'] ?? null,
            
        );
    }

    public static function fromPayment(array $data  , $calculations = []) : self
    {
        return self::fromRequest($data , $calculations);
    }

    public static function fromCheckout(array $data , $calculations = []): self
    {
        return self::fromRequest($data , $calculations);
    }
    

    public function toArray(): array
    {
        return [
               'user_id'=> $this->user_id,
               'coupon_code' => $this->coupon_code,
               'notes'=> $this->notes ,
               'payment_method' => $this->payment_method,
               'items' => array_map(fn($item) => $item->toArray(), $this->items),
               'address' => $this->address->toArray(),

        ];
    }
}


class OrderItemDTO
{
    public function __construct(
        public int $product_variant_Id,
        public int $quantity,
        public float $price,
        public string  $product_name
    ) {}



    public static function fromArray(array $data): self
    {
        return new self(
            product_variant_Id: $data["product_variant_Id"],
            quantity: $data["quantity"],
            price: $data["price"],
            product_name : $data["product_name"],
            
        );
    }

     public function toArray(): array
    {
        return [
            "product_variant_id"=> $this->product_variant_Id,
            "product_name"=> $this->product_name,
            "quantity"=> $this->quantity,
            "price"=> $this->price,
        ];
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
    
    public function toArray(): array
    {
        return [
            'full_name' => $this->full_name,
            'address_line1'=> $this->address_line1,
            'address_line2'=> $this->address_line2,
            'city'=> $this->city,
            'state'=> $this->state,
            'postal_code'=> $this->postal_code,
            'country'=> $this->country , 
            'phone' => $this->phone

        
        ];
    }
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
