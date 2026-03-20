<?php

namespace App\Models;

use Carbon\Cli\Invoker;
use Faker\Core\File;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

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
    'attrs',
    'inventory',
    'meta',
    'vendor',
    'madeCountry',
    'releaseDate',
    'category_niche_id',
    'badge_id',
    'allow_backorder',
    'show_countdown',
    'show_reviews',
    'is_visible' ,
    'show_related_products',
    'show_social_share',
    'faqs',
    'related_product_ids',
];
 
    protected $hidden = ['created_at','updated_at' , 'status' , 'quality_score ', 'allow_backorder' , 'deleted_at' , 'inventory' , 'is_visible' , 'is_featured'];
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
        'attrs' => 'array',
    ];

    public function variants(){
      return   $this->hasMany(ProductVariant::class , 'product_id' , 'id') ;
    }

    public function thumbnail(){
        return $this->morphOne(Media::class , 'mediaable')->where('collection' , 'thumbnail');
    }
    public function covers(){
        return $this->morphMany(Media::class , 'mediaable')
              ->where('collection' , 'gallery')
              ->where("media_type" , "image");
    }

    public function videos(){
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
  


    public function promotions(){
        $categories  = collect($this->nichCategory())->merge($this->subCategories());

        return Promotion::where("is_active" , true)
                          ->where(function($q) use($categories){
                            $q->whereJsonContains("applicable_product_ids" , $this->id) ;
                            $q->when($categories->count() > 0 , function($q)
                                    {
                                            $q->orWhereJsonContains("applicable_category_ids" , $this->nichCategory()->value("id")) ;
                                            foreach($this->subCategories()->pluck("id") as $catId){
                                                    $q->orWhereJsonContains("applicable_sub_category_ids" , $catId) ;
                                            }
                                    }
                                );
                          })->get()
                          ;
    }

  
    public function reviews(){
        return $this->hasMany(Review::class);
            
    }

    public function  ratingBreakdown(){
        return  Review::selectRaw(
            'rating , count(*) as count'
        )
        ->groupBy('rating')
        ->pluck('count', 'rating')
        ->toArray() ;
    }




    public function badge(){
        return $this->belongsTo(Badge::class);
    }

   

    // protected function casts(){
    //     return [
    //         'timestamps'
    //     ];
    // }
}
