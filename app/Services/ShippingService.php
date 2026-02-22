<?php

namespace App\Services;

use App\DTOs\Order\CreateOrderDTO;
use App\Exceptions\ShippingException;
use App\Models\Promotion;
use App\Models\ShippingSetting;
use App\Models\ShippingZone;
use App\Models\ShippingZoneCity;
use Exception;

class ShippingService
{
    /**
     * Create a new class instance.
     */
    public function __construct(private CartService $cartService)
    {
    }


    
   public function getZoneShippingInfo(string $city): ?ShippingZone
     {
          $record = ShippingZoneCity::with('shipping_zone')->where('city', $city)->first();
          return $record?->shipping_zone;
     }


    private function getShippingSettings(){
         return ShippingSetting::first();
    }



     private function checkFreeThresholdItems(array $items ,ShippingSetting $shipping_settings) : bool {


          if(count($items) >= $shipping_settings->free_shipping_threshold_items){
                    return true;
          }

          // check by cart items sub quantity if(iitems no exceeded the free threshold count)

          if($this->cartService->calculateCartSubQuantity($items) >= $shipping_settings->free_shipping_threshold_items) {
               return true;
          }

          return false ;

            
     }


     private function checkFreeThresholdAmount(array $items , ShippingSetting $shipping_settings) : bool {
       $items_subtotal = $this->cartService->calculateCartItemsSubtotal($items);
        return $items_subtotal >= $shipping_settings->free_shipping_threshold_amount ;
     }

 
     private function checkFreeShippingByThreshold(array $items, ShippingSetting $settings): bool
     {
          $byAmount   = $this->checkFreeThresholdAmount($items , $settings);
          $byItems    = $this->checkFreeThresholdItems($items, $settings);

          return match($settings->free_shipping_type) {
               'amount' => $byAmount,
               'items'  => $byItems,
               'both'   => $byAmount && $byItems,
               'either' => $byAmount || $byItems,
               default  => false,
          };
     }
    
    
    public function calculateShipping(array $items ,string $city , ?int $promotion_id = null): float
    {
               

               $zoneShippingInfo = $this->getZoneShippingInfo($city);
               $settings = $this->getShippingSettings();

               $this->checkAvailableShippingInZone($zoneShippingInfo);
               // if shipping is free initialy
               if($zoneShippingInfo &&( $zoneShippingInfo->price == 0)) {
                    return 0 ;
               }

               // if has free shiipping promotion
               if ($promotion_id) {
                    $promotion = Promotion::find($promotion_id);
                    if ($promotion && $promotion->type === 'free_shipping') {
                         return 0;
                    }
               }

               // shipping free in case some thresholds (amount / items count)
               if($this->checkFreeShippingByThreshold($items , $settings)){
                    return 0 ;
               }

               // if has fixed price no matter quantity
               if($zoneShippingInfo->type === 'fixed'){
                    return $zoneShippingInfo->price ;
               }

               return $this->calculateWeightBased($items, $zoneShippingInfo , $settings);

    }



    private function calculateWeightBased(array $items, ShippingZone $zone, ShippingSetting $settings): float
     {
     $totalWeight = collect($items)->sum(function ($item) {
          $weight = $item->product_variant->product->shipping->weight ?? 0;
          return $weight * $item->quantity;
     });

     if ($totalWeight <= $settings->base_weight_kg) {
          return $zone->price;
     }

     $extraWeight = $totalWeight - $settings->base_weight_kg;
     $extraPrice  = $extraWeight * $settings->extra_kg_price;

     return $zone->price + $extraPrice;
     }

    private function checkAvailableShippingInZone(?ShippingZone $zone): void
     {
     if (!$zone) {
          throw new ShippingException('Shipping is not configured for this region.');
     }

     if (!$zone->is_active) {
          throw new ShippingException('Shipping is currently unavailable for this region.');
     }
     }
}
