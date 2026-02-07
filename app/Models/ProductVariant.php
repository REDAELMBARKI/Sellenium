<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    
    public function product(){
        $this->belongsTo(Product::class);
    }
}
