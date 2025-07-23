<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
     protected $fillable = ['name' , 'brand' , 'price' , 'slug' , 'thumbnail' , 'rating_count', 'rating_average' ,'free_shipping' , 'description'];

    public function categories(){
          return $this->belongsToMany(Category::class);
    }


    public function orders(){
          return $this->belongsToMany(Order::class);
    }


    public function covers(){
         return $this->hasMany(Cover::class);
    }

    public function reviews(){
        return $this->hasMany(Review::class);
    }
 
    public function inventory(){
         return $this->hasMany(Inventory::class);
    }


    public function promotion(){
        return $this->belongsTo(Promotion::class);
    }
   
    
    
}
