<?php


namespace App\Services\Discount;

use App\Exceptions\PromotionException;
use App\Models\Promotion;
use Exception;
use Illuminate\Support\Facades\DB;

class PromotionService  extends DiscountService {
      
        public function getDbPromotions(){
              return Promotion::where('is_active', true)
                ->where(fn($q) => $q->whereNull('valid_from')->orWhere('valid_from', '<=', now()))
                ->where(fn($q) => $q->whereNull('valid_until')->orWhere('valid_until', '>=', now()))
                ->where(fn($q) => $q->whereNull('max_uses')->orWhereColumn('times_used', '<', 'max_uses'))
                ->get();
        }

        public function getBestPromotion(array $items) : array|null {
                $qualified = [] ;
                $total = $this->cartService->calculateCartItemsSubtotal($items);
                $promotions = $this->getDbPromotions()  ;
                foreach ($promotions as $promotion) {
                try{
                        $this->checkIsValidPromotion($promotion , $items);
                         $discount = $this->calculateDiscount($total, $promotion);
                         $qualified[] = [
                               'promotion'=> $promotion?->id ,
                               'discount'=> $discount
                         ];
                        }catch(Exception $e){
                            continue ;
                        }
                };

                if (empty($qualified)) return null;

                return collect($qualified)->sortByDesc('discount')->first();

        }

        public function checkIsValidPromotion(
            Promotion $promotion,
            array $items
        ): void {

            if (!$promotion) {
                throw new PromotionException('This promotion does not exist or is inactive.');
            }

            if (!$this->checkUsageLimits($promotion)) {
                throw new PromotionException('This promotion has reached its maximum number of uses.');
            }

            if (!$this->checkValidityPeriod($promotion)) {
                throw new PromotionException('This promotion is not valid at this time.');
            }

            if (!$this->checkMinimumAmount($promotion, $items)) {
                throw new PromotionException('Your order does not meet the minimum amount required for this promotion.');
            }

            if (!$this->checkMinimumItems($promotion, $items)) {
                throw new PromotionException('Your order does not have enough items to apply this promotion.');
            }

            if (!$this->checkIsValidForProduct($promotion, $items) &&
                !$this->checkIsValidForCategory($promotion, $items)) {
                throw new PromotionException('This promotion does not apply to the products or categories in your cart.');
            }
        }

       public function updateOnOrderSuccess(string $promotion_id): void
        {
            $updated = Promotion::where('id', $promotion_id)
                ->where(fn($q) => $q->whereNull('max_uses')
                                    ->orWhereColumn('times_used', '<', 'max_uses'))
                ->update([
                    'times_used' => DB::raw('times_used + 1'),
                    'is_active'  => DB::raw('CASE WHEN max_uses IS NOT NULL AND times_used + 1 >= max_uses THEN 0 ELSE 1 END'),
                ]);

            if (!$updated) {
                throw new PromotionException('Unable to update promotion usage.');
            }
        }
}