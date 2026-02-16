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
    // protected $fillable = [
    //     'name',
    //     'brand',
    //     'description',
    //     'price',
    //     'oldPrice',
    //     'isFeatured',
    //     'isFreeShipping',
    //     'status',
    //     'rating_average',      // optional; include if users can set/update rating manually
    //     'shipping',
    //     'inventory',
    //     'meta',
    //     'vendor',
    //     'madeCountry',
    //     'releaseDate',
    //     'category_niche_id',    // foreign key
    //  ];
    protected $guarded = [];

    protected $hidden = ['created_at','updated_at'];
    protected $casts = [
        'vendor' => 'array',
        'inventory' => 'array',
        'shipping' => 'array',
        'meta' => 'array',
        'price' => 'float' ,
        'oldPrice' => 'float' , 
        'video' => 'array',

        'isFeatured' => 'boolean',
        'isFreeShipping' => 'boolean',
        'ready_to_publish' => 'boolean',

        'shipping' => 'array',
        'aggregated_attributes' => 'array',
        'inventory' => 'array',
        'meta' => 'array',
        'vendor' => 'array',
    ];
  


    public function variants(){
        $this->hasMany(ProductVariant::class , 'product_id' , 'id') ;
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
        return  $this->belongsTo(Category::class ,'category_niche_id');
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
