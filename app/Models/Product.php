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
        'oldPrice',
        'isFeatured',
        'isFreeShipping',
        'status',
        'rating_average',      // optional; include if users can set/update rating manually
        'shipping',
        'inventory',
        'meta',
        'vendor',
        'madeCountry',
        'releaseDate',
        'category_niche_id',    // foreign key
     ];

    protected $hidden = ['created_at','updated_at'];
    protected $casts = [
        'vendor' => 'array',
        'inventory' => 'array',
        'shipping' => 'array',
        'meta' => 'array',
        'price' => 'float' ,
        'oldPrice' => 'float' , 
        'video' => 'array'
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
    public function covers(){
        return $this->morphMany(Media::class , 'mediaable')->where('collection' , 'cover');
    }

    public function video(){
        return $this->morphMany(Media::class , 'mediaable')->whereIn('media_type' , ['video' , 'iframe']);
    }
    

    public function media(){
        return $this->morphMany(Media::class , 'mediaable');
    }
 

    public function subCategories(){
        return $this->belongsToMany(Category::class , 'product_subCategory' , 'product_id' , 'sub_category_id' )
                ->select(['categories.id' , 'categories.name']);
    
    }
   

    public function nichCategory(){
        return  Category::find($this->category_niche_id);
    }

    public function tags(){
          return $this->belongsToMany(Tag::class)
                ->select('tags.name');
    }

    public function orders(){
          return $this->belongsToMany(Order::class);
    }
  


  
    public function reviews(){
        return $this->hasMany(Review::class);
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
