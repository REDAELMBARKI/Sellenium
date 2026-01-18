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
    protected $fillable = [
        'name',
        'brand',
        'description',
        'price',
        'old_price',
        'is_featured',
        'is_free_shipping',
        'status',
        'rating_average',      // optional; include if users can set/update rating manually
        'rating_count',        // optional; include if users can set/update count
        'shipping',
        'aggregated_attributes',
        'inventory',
        'meta',
        'vendor',
        'made_country',
        'release_date',
        'category_nich_id',    // foreign key
     ];

    protected $hidden = ['created_at','updated_at'];
    protected $casts = [
        'vendor' => 'array',
        'inventory' => 'array',
        'shipping' => 'array',
        'meta' => 'array',
    ];

    public static function getColumsToselect(){
        return array_merge(
            ['id'],
            (new Static)->getFillable()
        );
    }

    public function thumbnail(){
       return $this->morphOne(Media::class , 'mediaable')->where('collection' , 'thumbnail');
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
 
    public function media(){
        return $this->morphMany(Media::class , 'mediaable');
    }
 
    // public function covers() // for example only 
    // {
    //     return $this->hasManyThrough(Cover::class, Inventory::class, 'product_id', 'inventory_id', 'id', 'id') ;
              
    // }

    public function promotion()
    {
        return $this->belongsTo(Promotion::class);
    }
   


   

    // protected function casts(){
    //     return [
    //         'timestamps'
    //     ];
    // }
}
