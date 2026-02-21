<?php

namespace App\Services\Discount;

use App\Context\Order\CheckoutContext;
use App\Exceptions\PromotionException;
use App\Models\Promotion;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PromotionService extends DiscountService
{
    public function getDbPromotions()
    {
        return Promotion::where('is_active', true)
            ->where(fn($q) => $q->whereNull('valid_from')->orWhere('valid_from', '<=', now()))
            ->where(fn($q) => $q->whereNull('valid_until')->orWhere('valid_until', '>=', now()))
            ->where(fn($q) => $q->whereNull('max_uses')->orWhereColumn('times_used', '<', 'max_uses'))
            ->get();
    }

    // mirrors checkIsValidCoupon — only global validity, no cart context needed
    public function checkIsValidPromotion(Promotion $promotion): void
    {
        if (!$this->checkUsageLimits($promotion)) {
            throw new PromotionException('This promotion has reached its maximum number of uses.');
        }

        if (!$this->checkValidityPeriod($promotion)) {
            throw new PromotionException('This promotion is not valid at this time.');
        }
    }

    // mirrors assertCouponApplicable — cart-level checks on eligible items only
    public function assertPromotionApplicable(Promotion $promotion, array $eligibleItems): void
    {
        if (empty($eligibleItems)) {
            throw new PromotionException('No eligible items found for this promotion.');
        }

        if (!$this->checkMinimumAmount($promotion, $eligibleItems)) {
            throw new PromotionException('Your order does not meet the minimum amount required for this promotion.');
        }

        if (!$this->checkMinimumItems($promotion, $eligibleItems)) {
            throw new PromotionException('Your order does not have enough items to apply this promotion.');
        }
    }

    public function getBestPromotion(array $items): array|null
    {
        $promotions = $this->getDbPromotions();
        $qualified = [];

        foreach ($promotions as $promotion) {
            try {
                // check global validity first
                $this->checkIsValidPromotion($promotion);

                //  filter eligible items — same as coupon flow
                $eligibility = $this->cartService->getCartEligibility($promotion, $items) ?? [];
                $eligibleItems = $eligibility['eligibleItems'] ?? [];

                //  check cart-level conditions on eligible items only
                $this->assertPromotionApplicable($promotion, $eligibleItems);

                // calculate discount on eligible subtotal only
                $eligibleSubtotal = $this->cartService->calculateCartItemsSubtotal($eligibleItems);
                $discount = $this->calculateDiscount($promotion , $eligibleSubtotal);

                $qualified[] = [
                    'promotion_id' => $promotion->id,
                    'discount'  => $discount,
                ];
            } catch (Exception $e) {
                continue;
            }
        }

        if (empty($qualified)) return null;

        return collect($qualified)->sortByDesc('discount')->first();
    }

    // same safe conditional update pattern as updateCouponInOrderUsage
    public function updateOnOrderSuccess(string $promotion_id): void
    {
        $promotion = Promotion::find($promotion_id);

        if (!$promotion) {
            throw new PromotionException("Promotion {$promotion_id} not found.");
        }

        $updated = Promotion::where('id', $promotion_id)
            ->where(fn($q) => $q->whereNull('max_uses')
                                ->orWhereColumn('times_used', '<', 'max_uses'))
            ->update([
                'times_used' => DB::raw('times_used + 1'),
                'is_active'  => DB::raw('CASE WHEN max_uses IS NOT NULL AND times_used + 1 >= max_uses THEN 0 ELSE 1 END'),
            ]);

        if ($updated === 0) {
            throw new PromotionException('Promotion no longer valid or has reached its usage limit.');
        }
    }
}