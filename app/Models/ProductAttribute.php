<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAttribute extends Model
{
    public function products(){
        return $this->belongsToMany(Product::class , 'attribute_product');
    }
}
