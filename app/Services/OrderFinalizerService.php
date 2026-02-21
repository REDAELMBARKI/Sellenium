<?php

namespace App\Services;

use App\Models\Order;
use App\Services\Discount\CouponService;
use App\Services\Discount\PromotionService;
use Database\Seeders\PromotionSeeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderFinalizerService
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private CouponService $couponService,
        private PromotionService $promotionService
    )
    {
        //
    }

   

    public function finalize(Order $order){
          
        // coupon finalizer
        if ($order->coupon_id && !$order->coupon_counted) {
            DB::transaction(function () use ($order) {
    
                    $this->couponService
                        ->updateCouponInOrderUsage($order->coupon_id);

                    $order->coupon_counted = true;
                    $order->save();
                });
         }
         
        // promotion finalizer
        if ($order->promotion_id && !$order->promotion_counted) {
            DB::transaction(function () use ($order) {

                $this->promotionService
                    ->updateOnOrderSuccess($order->promotion_id);

                $order->promotion_counted = true;
                $order->save();
            });
        }

    }
}
