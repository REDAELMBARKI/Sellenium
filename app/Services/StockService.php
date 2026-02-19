<?php

namespace App\Services;

use App\DTOs\OrderItemDTO;
use App\Exceptions\CheckoutException;
use App\Models\Product;
use App\Models\ProductVariant;

class StockService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function decrement(OrderItemDTO $item): void
    {
        if($item->product_variant_id !== null) {
            ProductVariant::find($item->product_variant_id)
                ->decrement('stock', $item->quantity);
        } else {
            Product::find($item->product_id)
                ->decrement('stock', $item->quantity);
        }
    }

    public function validate(OrderItemDTO $item): void
    {
        $stock = $item->product_variant_id !== null
            ? ProductVariant::find($item->product_variant_id)->stock
            : Product::find($item->product_id)->stock;

        if($stock < $item->quantity) {
            throw new CheckoutException("Product is out of stock");
        }
    }
}

