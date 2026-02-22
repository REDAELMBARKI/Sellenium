<?php

namespace App\Services;

use App\DTOs\Order\OrderItemDTO;
use App\Exceptions\CheckoutException;
use App\Exceptions\StockException;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Collection;

class StockService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    // public function decrement(OrderItemDTO $item): void
    // {
    //     if($item->product_variant_id !== null) {
    //         ProductVariant::find($item->product_variant_id)
    //             ->decrement('stock', $item->quantity);
    //     } else {
    //         Product::find($item->product_id)
    //             ->decrement('stock', $item->quantity);
    //     }
    // }
 
    public function getSingleOrderItems(array $itemsIds){
        return ProductVariant::whereIn('id', $itemsIds)
               ->with('product')
               ->get()
               ->keyBy('id');
    }

    public function validateFromCheckout(Collection $cartItems){

        foreach ($cartItems as $item) {
            $stock = $item->productVariant->stock;
            $name  = $item->productVariant->product->name;

            if ($stock < $item->quantity) {
                if ($stock > 0) {
                    $message = "Only {$stock} items available for {$name} — please update your quantity.";
                } else {
                    $message = "{$name} is out of stock — please remove it from your cart.";
                }

                throw new StockException($message);
            }
          }
        
    }
    public function validateFromStore(Collection $items , Collection $params): void
     {
         foreach($params as $param){
            $item = $items->get($param->variant_id);
            $variantLabel = $item->attributeValues->pluck('value')->join(', ');
            if($item->stock < $param->quantity){
                 $message = '' ;
                 if($item->stock > 0) {
                    $message = "Only {$item->stock} items available for {$item->product->name} ({$variantLabel})" ;
                 }else{
                     $message =  "{$item->product->name} ({$variantLabel}) is out of stock.";
                 }
                 throw new StockException($message);
            }
         }
    
    }
}

