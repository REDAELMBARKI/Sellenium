<?php

namespace App\Models;

use Carbon\Cli\Invoker;
use Faker\Core\File;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
    protected $fillable = [
    'name',
    'slug',
    'brand',
    'description',
    'is_featured',
    'status',
    'ready_to_publish',
    'quality_score',
    'rating_average',
    'rating_count',
    'shipping',
    'aggregated_attributes',
    'inventory',
    'meta',
    'vendor',
    'madeCountry',
    'releaseDate',
    'category_niche_id',
    'badge_text',
    'allow_backorder',
    'show_countdown',
    'show_reviews',
    'is_visible' ,
    'show_related_products',
    'show_social_share',
    'faqs',
    'related_product_ids',
];
 
    protected $hidden = ['created_at','updated_at'];
    protected $casts = [
        'inventory' => 'array',
        'shipping' => 'array',
        'price' => 'float' ,
        'oldPrice' => 'float' ,
        'video' => 'array',
         'related_products'=> 'array',
        'isFeatured' => 'boolean',
        'ready_to_publish' => 'boolean',
        'meta'                  => 'array',
        'vendor'                => 'array',
        'faqs'                  => 'array',
        'related_product_ids'   => 'array',
        'aggregated_attributes' => 'array',
    ];
  


    public function attrs(){
         return $this->belongsToMany(ProductAttribute::class , 'attribute_product');
    }

    public function variants(){
      return   $this->hasMany(ProductVariant::class , 'product_id' , 'id') ;
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
                ->select('tags.id' , 'tags.name');
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
