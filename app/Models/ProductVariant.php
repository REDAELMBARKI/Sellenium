<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory ;
    
    public function product(){
        return $this->belongsTo(Product::class);
    }



    protected $fillable = ['product_id' , 'price','sku' ,  'compare_price', 'is_default',  'stock', 'attrs'];
    protected $casts = ['attrs' => 'array'] ;


    public function media(){
        return $this->morphOne(Media::class , 'mediaable');
    }

}
