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
     protected $hidden = ['created_at','updated_at'];   

    public static function getColumsToselect(){
        return array_merge(
            ['id'],
            (new Static)->getFillable()
        );
    }
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


    public function covers()
    {
        return $this->hasManyThrough(Cover::class, Inventory::class, 'product_id', 'inventory_id', 'id', 'id')
              ;
              
    }

    public function promotion()
    {
        return $this->belongsTo(Promotion::class);
    }
    public function colors()
    {
        return $this->hasManyThrough(Color::class, Inventory::class ,'product_id' , 'id' , 'id' , 'id' )
                    ->select('colors.id as color_id' , 'colors.hex');
    }


    public function sizes()
    {
        return $this->hasManyThrough(Size::class , Inventory::class , 'product_id' , 'id' , 'id' , 'id');
    }

    public function materials()
    {
        return $this->hasManyThrough(Material::class, Inventory::class, 'product_id', 'id', 'id', 'id')
        ->select('materials.id as material_iid' , 'name');
    }

    public function fits()
    {
        return $this->hasManyThrough(Fit::class, Inventory::class, 'product_id', 'id', 'id', 'id');
    }


    // protected function casts(){
    //     return [
    //         'timestamps'
    //     ];
    // }
}
