<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
     protected $fillable = ['name' , 'brand' , 'price' , 'slug' , 'thumbnail' , 'rating_count', 'rating_average' ,'free_shipping' , 'description'];

    public function products(){
          return $this->hasMany(Product::class);
    }
}
