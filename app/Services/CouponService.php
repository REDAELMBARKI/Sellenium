<?php

namespace App\Services;

use App\DTOs\CreateOrderDTO;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use function PHPUnit\Framework\isNull;

class CouponService
{
    /**
     * Create a new class instance.
     */

         protected $cartService ;

        public function __construct(CartService $cartService)
        {
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

        private function checkMinimumItems(Coupon $coupon ,CreateOrderDTO $dto){
            //  'minimum_items' // Min 2 items required
            if(count($dto->items) >=  $coupon->minimum_items){
                  return true ;
            }else {
                  $sub_quantity = (int) $this->cartService->calculateCartSubQuantity($dto->items);
                  return $sub_quantity >= $coupon->minimum_items;
            }
        }
    
        private function checkUsagePerUser(Coupon $coupon , User $user) :bool{
            //     'max_uses_per_user' // How many times ONE user can use it
            $countUsage = Order::where('user_id', $user->id)
                          ->where('coupon_id' , $coupon->id)
                          ->where('status' , 'delivered')
                          ->count();

            return $coupon->max_uses_per_user > $countUsage ;
        }
        private function checkUsageLimits(Coupon $coupon){
            //     'max_uses' // Total times coupon can be used (null = unlimited)
            //     'times_used' // Track how many times it's been used
            return is_null($coupon->max_uses) || $coupon->times_used < $coupon->max_uses;

        }

        
        private function checkValidityPeriod(Coupon $coupon) : bool {
           return (is_null($coupon->valid_from) || $coupon->valid_from <= now()) &&
                   (is_null($coupon->valid_until) || $coupon->valid_until >= now());

        }
       
        private function  checkIsValidForProduct(Coupon $coupon, CreateOrderDTO $dto){
            //  $table->json('applicable_product_ids' // [1, 2, 5] - only these products
            if(is_null($coupon->applicable_product_ids) || 
               empty($coupon->applicable_product_ids)
             ){
                return true ;
            }

            return collect($dto->items)->every(function ($item) use ($coupon) {
                return isset($item['product']['id']) &&
                    in_array($item['product']['id'], $coupon->applicable_product_ids ?? []);
            });


        }

        private function  checkIsValidForCategory(Coupon $coupon, $dto){
            //     $table->json('applicable_category_ids' // [3, 7] - only these categories
            if(
                (is_null($coupon->applicable_category_ids) ||
                empty($coupon->applicable_category_ids) )
                
                &&

                (is_null($coupon->applicable_sub_category_ids) ||
                empty($coupon->applicable_sub_category_ids) )

             ){
                return true ;
            }


             return collect($dto->items)->every(function($item) use ($coupon) {
                    return $this->checkCouponForItem($coupon, $item['product']);
             });

        }


        private function checkCouponForItem(Coupon $coupon,Product $product): bool
        {
            // Get product category IDs
            $productCategoryIds = $product->categories->pluck('id')->toArray();

            // Merge allowed categories
            $allowedCategories = array_merge(
                $coupon->applicable_category_ids ?? [],
                $coupon->applicable_sub_category_ids ?? []
            );

            // Check intersection
            return count(array_intersect($productCategoryIds, $allowedCategories)) > 0;
        }
                

        
       
        public function checkIsValidCoupon(
        Coupon $coupon,
        CreateOrderDTO $dto,
        ?User $user
        ): bool {

            if ($coupon->max_uses_per_user && !$user) {
                return false;
            }

            if ($coupon->max_uses_per_user &&
                !$this->checkUsagePerUser($coupon, $user)) {
                return false;
            }

            return $this->checkActive($coupon)
                && $this->checkValidityPeriod($coupon)
                && $this->checkMinimumAmount($coupon, $dto)
                && $this->checkMinimumItems($coupon, $dto)
                && $this->checkUsageLimits($coupon, $user)
                && ($this->checkIsValidForProduct($coupon, $dto) || $this->checkIsValidForCategory($coupon, $dto) ) ;
        }


}
