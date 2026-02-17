<?php

namespace App\DTOs;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Product;
use App\Models\User;
use DateTime;
use Illuminate\Support\Facades\Auth;

class CreateOrderDTO
{
    public function __construct(
        public readonly ?string $order_number = null, 
        public readonly ?string $payment_method_id = null, 
        public readonly ?int $user_id = null,
        public readonly ?string $notes , 
        public readonly string $payment_method,
        public readonly array $items,              // Array of OrderItemDTO
        public readonly OrderAddressDTO $address,  // Nested DTO
        public readonly ?string $coupon_code = null,
        public readonly ?DateTime $paid_at,
        public readonly ?bool $paid ,
        public readonly ?float $tax = 0.0,
        public readonly ?bool $confirmed = false,
        public readonly ?int $total_amount = 0 ,
        public readonly ?int $discount_amount = 0 ,
        public readonly ?int $shipping_cost = 0,
        public readonly ?int $coupon_id = null,
        
    ) {}
    
    public static function fromRequest(array $data , ?User $user, ?array $calulations = []): self
    {


        return new self(
            user_id: $user?->id,
            payment_method: $data['payment_method'],
            payment_method_id: $data['payment_method_id'] ?? null,
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
            discount_amount: $calulations['discount_amount'] ??  0 ,
            order_number: $calulations['order_number'] ?? null,
            coupon_id : $data['coupon_id'] ?? null,
            
        );
    }

    public static function fromPayment(array $data  ,?User $user , array $calculations ) : self
    {
        return self::fromRequest($data , $user , $calculations);
    }

    public static function fromCheckout(array $data ,?User $user , array $calculations ): self
    { 

        return self::fromRequest($data , $user , $calculations);
    }
    

    public function toArray(): array
    {
        return [
            'user_id'           => $this->user_id,
            'coupon_id' =>$this->coupon_id ,
            'order_number'      => $this->order_number,
            'payment_method_id' => $this->payment_method_id,
            'payment_method'    => $this->payment_method,
            'coupon_code'       => $this->coupon_code,
            'notes'             => $this->notes,
            'confirmed'         => $this->confirmed,
            'paid'              => $this->paid,
            'paid_at'           => $this->paid_at,
            'tax'               => $this->tax,
            'total_amount'      => $this->total_amount,
            'discount_amount'   => $this->discount_amount,
            'shipping_cost'     => $this->shipping_cost,
            'items'             => array_map(fn($item) => $item->toArray(), $this->items),
            'address'           => $this->address->toArray(),
        ];
    }
}


class OrderItemDTO
{
    public function __construct(
        public int $product_variant_id,
        public int $quantity,
        public float $price_snapshot,
        public float $subtotal,
        public string $product_name,
        public array  $product_variant ,
        public array  $product
    ) { }



    public static function fromArray(array $data): self
    {
        return new self(
            product_variant_id: $data["product_variant_id"],
            quantity: $data["quantity"],
            price_snapshot: $data["price_snapshot"],
            subtotal: $data["subtotal"],
            product_name : $data["product_variant"]['product']['name'] ?? 'Unknown Product',
            product : $data['product_variant']['product'] ,
            product_variant : $data['product_variant']
        );
    }

     public function toArray(): array
    {
        return [
            "product_variant_id"=> $this->product_variant_id,
            "product_name"=> $this->product_name,
            "quantity"=> $this->quantity,
            "product" => $this->product ,
            "product_variant" => $this->product_variant ,
            "price_snapshot"=> $this->price_snapshot,
            "subtotal"=> $this->subtotal,

        ];
    }
}

// Nested DTO for address
class OrderAddressDTO
{
    public function __construct(
        public readonly string $first_name ,
        public readonly string $last_name ,
        public string $address_line1,
        public ?string $address_line2,
        public string $city,
        public ?string $state,
        public ?string $postal_code,
        public ?string $country ,
        public string $phone ,
        public ?string $email = null,
        public ?string $company = null,
    ) {
           $this->country = $country ?? env('APP_COUNTRY', 'US');
    }
    
    public function toArray(): array
    {
        return [
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'address_line1'=> $this->address_line1,
            'address_line2'=> $this->address_line2,
            'city'=> $this->city,
            'state'=> $this->state,
            'postal_code'=> $this->postal_code,
            'country'=> $this->country ,
            'phone' => $this->phone ,
            'email' => $this->email ,
            'company' => $this->company
        
        ];
    }
    public static function fromArray(array $data): self
    {
        return new self(
            first_name: $data["first_name"],
            last_name: $data["last_name"],
            address_line1: $data["address_line1"],
            address_line2: $data["address_line2"],
            city: $data["city"],
            state: $data["state"],
            postal_code: $data["postal_code"],
            country: $data["country"] ?? env('APP_COUNTRY'),
            phone: $data["phone"],
            email: $data["email"],
            company: $data["company"]
        );
    }
}
