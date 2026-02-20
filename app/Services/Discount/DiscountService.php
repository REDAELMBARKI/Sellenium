<?php

namespace App\Services\Discount;

use App\Context\CheckoutContext;
use App\DTOs\CreateOrderDTO;
use App\Exceptions\CouponException;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use Error;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

abstract class DiscountService
{
    /**
     * Create a new class instance.
     */
        public function __construct(protected CartService $cartService)
        {
        }


        protected function checkMinimumAmount(mixed $discount , array $items) : bool {
            // 'minimum_order_amount' // Min 200 MAD to use coupon
            $cartSubtotal = $this->cartService->calculateCartItemsSubtotal($items);
            return   $cartSubtotal >= $discount->minimum_order_amount ;
        }

        protected function checkMinimumItems(mixed $discount , array $items) : bool{
            //  'minimum_items' // Min 2 items required
            if(count($items) >=  $discount->minimum_items){
                  return true ;
            }else {
                  
                  $sub_quantity = (int) $this->cartService->calculateCartSubQuantity($items);

                  return $sub_quantity >= $discount->minimum_items;
            }
        }
    
    

        protected function checkUsageLimits(mixed $discount) : bool {
            //     'max_uses' // Total times coupon can be used (null = unlimited)
            //     'times_used' // Track how many times it's been used
            return is_null($discount->max_uses) || $discount->times_used < $discount->max_uses;

        }

        
        protected function checkValidityPeriod(mixed $discount) : bool {
           return (is_null($discount->valid_from) || $discount->valid_from <= now()) &&
                   (is_null($discount->valid_until) || $discount->valid_until >= now());

        }
       
        protected function  checkIsValidForProduct(mixed $discount, array $items){

            if(is_null($discount->applicable_product_ids) ||
               empty($discount->applicable_product_ids)
             ){
                return true ;
            }

            return collect($items)->every(function ($item) use ($discount) {
           
                
                return isset($item->product['id']) &&
                       in_array($item->product['id'], $discount->applicable_product_ids ?? []);
            });

        }

        protected function  checkIsValidForCategory(mixed $discount,array $items) :bool {
            //     $table->json('applicable_category_ids' // [3, 7] - only these categories

            if(
                (is_null($discount->applicable_category_ids) ||
                empty($discount->applicable_category_ids) )
                
                &&

                (is_null($discount->applicable_sub_category_ids) ||
                empty($discount->applicable_sub_category_ids) )

             ){
                return true ;
            }


             return collect($items)->every(function($item) use ($discount) {
                    return isset($item->product) && $this->checkDiscountForItem($discount, $item->product);
             });

        }


        protected function checkDiscountForItem(mixed $discount, array  $product): bool
        {
           
            $productCategoriesIds = collect($product['sub_categories'])->merge($product['nich_category']) ->pluck('id')->toArray();
            
            // Merge allowed categories
            $allowedCategories = array_merge(
                $discount->applicable_category_ids ?? [],
                $discount->applicable_sub_category_ids ?? []
            );

            // Check intersection
            return count(array_intersect($productCategoriesIds, $allowedCategories)) > 0;
        }
                



         public function calculateDiscount(float $total, mixed $discounted): float {
            if ($discounted->type === 'fixed') {
                return (float)$discounted->value;
            } elseif ($discounted->type === 'percentage') {
                return $discounted->value * $total;
            }
            return 0;
        }

     
    

        

}
