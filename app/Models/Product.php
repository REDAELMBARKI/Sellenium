<?php

namespace App\Models;

use Faker\Core\File;
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

     public function tags(){
          return $this->belongsToMany(Tag::class);
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
   
    // attrivutes 

    public function color(){
        return $this->hasMany(Color::class);
    }


    public function size(){
        return $this->hasOne(Size::class);
    }

    public function materials(){
        return $this->hasMany(Material::class);
    }

    public function fit(){
        return $this->hasOne(Fit::class);
    }
     
}
