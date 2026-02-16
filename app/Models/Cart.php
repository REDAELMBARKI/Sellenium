<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    /** @use HasFactory<\Database\Factories\CartFactory> */
    use HasFactory;

    protected $table = "products_cart";
    protected $fillable = ['user_id' , 'product_variant_id' , 'quantity' , 'price_snapshot' , 'cart_token' ];

    public function productVariant(){
          return $this->belongsTo(ProductVariant::class);
    }
    
    public function user(){
        return $this->belongsTo(User::class);
    }
}
