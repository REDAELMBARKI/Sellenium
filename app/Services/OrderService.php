<?php

namespace App\Services;

use App\Http\Resources\OrderResource;
use App\Models\Order;

class OrderService
{
    

        public function getOrders(){
           return OrderResource::collection(Order::with('user:id,name,email' , 'orderItems.product.thumbnail' , 'address')->paginate(10));
        }

        public function getStats(){
            return [
            'total' => [
                'count' => 12,
                'change_percent' => 12.5
            ],
            'pending' => [
                'count' => 3,
                'change_percent' => 5.1
            ],
            'out_for_delivery' => [
                'count' => 0,
                'change_percent' => 0
            ],
            'delivered' => [
                'count' => 0,
                'change_percent' => 0
            ],
            'delivery_failed' => [
                'count' => 0,
                'change_percent' => 0
            ],
            'returned' => [
                'count' => 1,
                'change_percent' => 2.3
            ],
            'confirmed' => [
                'count' => 0,
                'change_percent' => 0
            ],
            'canceled' => [
                'count' => 1,
                'change_percent' => 8.2
            ],
        ];
        }

}
