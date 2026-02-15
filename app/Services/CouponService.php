<?php

namespace App\Services;

use App\DTOs\CreateOrderDTO;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\User;

class CouponService
{
    /**
     * Create a new class instance.
     */

         protected $cartService ;

        public function __construct()
        {
            $this->cartService = new CartService() ;
        }


       public function getDbCouponCodeMatch(string $coupon_code){
              return Coupon::where('code' , $coupon_code)
                        ->where('is_active', true)
                        ->where(function ($query) {
                            $query->whereNull('valid_from')
                                ->orWhere('valid_from', '<=', now());
                        })
                        ->where(function ($query) {
                            $query->whereNull('valid_until')
                                ->orWhere('valid_until', '>=', now());
                        })
                        ->first();
        }

        private function checkActive(Coupon $coupon){
              return $coupon->is_active;
        }


        private function checkMinimumAmount(Coupon $coupon , $dto){
            // 'minimum_order_amount' // Min 200 MAD to use coupon
            $cartSubtotal = $this->cartService->calculateCartItemsSubtotal($dto->items);
            return   $cartSubtotal >= $coupon->minimum_amount ;
        }

        private function checkMinimumItems(Coupon $coupon , $dto){
            //   $table->integer('minimum_items')->nullable(); // Min 2 items required
            return $dto->items ;
        }

        private function checkUsageLimits(Coupon $coupon , User $user ){
          //     $table->integer('max_uses')->nullable(); // Total times coupon can be used (null = unlimited)
            //     $table->integer('max_uses_per_user')->default(1); // How many times ONE user can use it
            //     $table->integer('times_used')->default(0); // Track how many times it's been used

        }

        
        private function checkValidityPeriod(Coupon $coupon){
            //     $table->decimal('minimum_order_amount', 10, 2)->nullable(); // Min 200 MAD to use coupon

        }
       
        private function  checkProductCategory(Coupon $coupon, $dto){
            // Optional: Specific Products/Categories
            //     $table->json('applicable_product_ids')->nullable(); // [1, 2, 5] - only these products
            //     $table->json('applicable_category_ids')->nullable(); // [3, 7] - only these categories
        }

        
       
        public function checkIsValidCoupon(Coupon $coupon , CreateOrderDTO $dto , User  $user) : bool {
             return $this->checkActive($coupon)
                    && $this->checkValidityPeriod($coupon)
                    && $this->checkMinimumAmount($coupon, $dto)
                    && $this->checkMinimumItems($coupon, $dto)
                    && $this->checkUsageLimits($coupon, $user)
                    && $this->checkProductCategory($coupon, $dto);
        }

}
