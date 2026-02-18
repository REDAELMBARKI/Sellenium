<?php

namespace App\Services;

use App\Context\CheckoutContext;
use App\DTOs\CreateOrderDTO;
use App\Exceptions\CouponException;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Error;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CouponService
{
    /**
     * Create a new class instance.
     */
        public function __construct(private CartService $cartService)
        {
        }


        public function getDbCouponCodeMatch(string $coupon_code){
               try{
                 return Coupon::where('code' , $coupon_code)
                     ->where('is_active' , true)
                     ->first();
               }catch(Exception $e){
                   return null;
               }
        }

        private function checkMinimumAmount(Coupon $coupon , array $items) : bool {
            // 'minimum_order_amount' // Min 200 MAD to use coupon
            $cartSubtotal = $this->cartService->calculateCartItemsSubtotal($items);
            return   $cartSubtotal >= $coupon->minimum_amount ;
        }

        private function checkMinimumItems(Coupon $coupon , array $items) : bool{
            //  'minimum_items' // Min 2 items required
            if(count($items) >=  $coupon->minimum_items){
                  return true ;
            }else {
                  
                  $sub_quantity = (int) $this->cartService->calculateCartSubQuantity($items);

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
        private function checkUsageLimits(Coupon $coupon) : bool {
            //     'max_uses' // Total times coupon can be used (null = unlimited)
            //     'times_used' // Track how many times it's been used
            return is_null($coupon->max_uses) || $coupon->times_used < $coupon->max_uses;

        }

        
        private function checkValidityPeriod(Coupon $coupon) : bool {
           return (is_null($coupon->valid_from) || $coupon->valid_from <= now()) &&
                   (is_null($coupon->valid_until) || $coupon->valid_until >= now());

        }
       
        private function  checkIsValidForProduct(Coupon $coupon, array $items){

            if(is_null($coupon->applicable_product_ids) || 
               empty($coupon->applicable_product_ids)
             ){
                return true ;
            }

            return collect($items)->every(function ($item) use ($coupon) {
                return isset($item->product->id) &&
                    in_array($item->product->id, $coupon->applicable_product_ids ?? []);
            });

        }

        private function  checkIsValidForCategory(Coupon $coupon,array $items) :bool {
            //     $table->json('applicable_category_ids' // [3, 7] - only these categories
                Log::info('etap 9.2');

            if(
                (is_null($coupon->applicable_category_ids) ||
                empty($coupon->applicable_category_ids) )
                
                &&

                (is_null($coupon->applicable_sub_category_ids) ||
                empty($coupon->applicable_sub_category_ids) )

             ){
                return true ;
            }


             return collect($items)->every(function($item) use ($coupon) {
                    return isset($item->product) && $this->checkCouponForItem($coupon, $item->product);
             });

        }


        private function checkCouponForItem(Coupon $coupon,Product $product): bool
        {
           
            $productCategoriesIds = collect($product['sub_categories'])->merge($product['nich_category']) ->pluck('id')->toArray();
            
            // Merge allowed categories
            $allowedCategories = array_merge(
                $coupon->applicable_category_ids ?? [],
                $coupon->applicable_sub_category_ids ?? []
            );

            // Check intersection
            return count(array_intersect($productCategoriesIds, $allowedCategories)) > 0;
        }
                

     
        
        public function checkIsValidCoupon(
        Coupon $coupon,
        array $items ,
        ?User $user
        ): void {

                Log::info('etap 1');

                if (!$coupon) {
                    throw new CouponException('Coupon code does not exist. or Inactive ');
                }
              
                Log::info('etap 2');

               
                if ($coupon->max_uses_per_user && !$user) {
                    throw new CouponException('This coupon requires an account. Please login or register to use it.');
                }

                Log::info('etap 3');


                if ($coupon->max_uses_per_user &&
                    !$this->checkUsagePerUser($coupon, $user)) {
                    throw new CouponException('You have already reached the maximum number of uses for this coupon.');
                }

                Log::info('etap 4');


                if (!$this->checkUsageLimits($coupon)) {
                    throw new CouponException('This coupon has reached its maximum of use ');
                }

                Log::info('etap 5');

                if (!$this->checkValidityPeriod($coupon)) {
                    throw new CouponException('This coupon is not valid at this time.');
                }

                Log::info('etap 6');


                if (!$this->checkMinimumAmount($coupon, $items)) {
                    throw new CouponException(
                        'Your order does not meet the minimum amount required to use this coupon.'
                    );
                }

                Log::info('etap 7');


                if (!$this->checkMinimumItems($coupon, $items)) {
                    throw new CouponException(
                        'Your order does not have enough items to use this coupon.'
                    );
                }

                Log::info('etap 8');

                
                if (!$this->checkIsValidForProduct($coupon, $items) &&
                    !$this->checkIsValidForCategory($coupon, $items)) {
                    throw new CouponException(
                        'This coupon does not apply to the products or categories in your cart.'
                    );
                }

            


         }



        public  function getValidCoupon(CheckoutContext $context): Coupon | null {
            $dto = $context->dto;

            if (!$dto->coupon_code) {
                Log::alert('No coupon code provided in DTO.');
                return null;
            }

            $coupon = $this->getDbCouponCodeMatch($dto->coupon_code);
            
            if (!$coupon) {
                Log::alert('coupon not found ' . $dto->coupon_code);
                return null ;
            }

            try {
                $this->checkIsValidCoupon($coupon, $context->dto->items , $context->user);
                return $coupon;
            } catch (CouponException $e) {
                Log::info('Coupon invalid: ' . $e->getMessage());
                return null;
            }
        }

}
