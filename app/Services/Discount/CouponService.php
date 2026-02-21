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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CouponService extends DiscountService
{

 
        public function getDbCouponCodeMatch(string $coupon_code){
               try{
                 return Coupon::where('code' , $coupon_code)
                     ->where('is_active' , true)
                     ->first();
               }catch(Exception $e){
                   return null;
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

        public function checkIsValidCoupon(
        Coupon $coupon,
        array $items ,
        ?User $user
        ): void {


               if (!$user) {
                    throw new CouponException('This coupon requires an account. Please login or register to use it.');
                }


                Log::info('etap 1');

                if (!$coupon) {
                    throw new CouponException('Coupon code does not exist. or Inactive ');
                }
              
                Log::info('etap 2');

               
                
                Log::info('etap 3');


                if (!$this->checkUsagePerUser($coupon, $user)) {
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

        public function updateCouponInOrderUsage(int|string $coupon_id)
        {
            $coupon = Coupon::find($coupon_id);

            if (!$coupon) {
                    throw new \Exception("Coupon {$coupon_id} not found.");
                }

            $updated = Coupon::where('id', $coupon_id)
                ->where(function ($q) {
                    $q->whereNull('max_uses')       // unlimited
                    ->orWhereColumn('times_used', '<', 'max_uses'); // still has uses
                })
                ->update([
                    'times_used' => DB::raw('times_used + 1'),
                    'is_active' => DB::raw('CASE WHEN max_uses IS NOT NULL AND times_used + 1 >= max_uses THEN 0 ELSE 1 END')
                ]);

            if ($updated === 0) {
                throw new \Exception("Coupon no longer valid or has reached its usage limit.");
            }
            return $updated;
        }

}
