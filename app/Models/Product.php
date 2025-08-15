<?php

namespace App\Models;

use Carbon\Cli\Invoker;
use Faker\Core\File;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
     protected $fillable = ['name' , 'brand' , 'price' , 'slug' , 'thumbnail' ,'free_shipping' , 'description'];

    public function categories(){
          return $this->belongsToMany(Category::class);
    }

    public function tags(){
          return $this->belongsToMany(Tag::class);
    }


    public function orders(){
          return $this->belongsToMany(Order::class);
    }
  


  
    public function reviews(){
        return $this->hasMany(Review::class);
    }
 
    public function inventories(){
         return $this->hasMany(Inventory::class);
    }


    public function promotion(){
        return $this->belongsTo(Promotion::class);
    }

    // attrivutes 

    public function covers()
    {
        return $this->hasManyThrough(Cover::class, Inventory::class,'variant_id');
    }

    public function colors()
    {
        return $this->hasManyThrough(Color::class, Inventory::class ,'product_id' , 'id' , 'id' , 'id' );
    }


    public function size()
    {
        return $this->hasOne(Size::class);
    }

    public function materials()
    {
        return $this->hasManyThrough(Material::class, Inventory::class);
    }

    public function fit()
    {
        return $this->hasOne(Fit::class);
    }
}
