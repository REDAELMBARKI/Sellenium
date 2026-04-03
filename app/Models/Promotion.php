<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    /** @use HasFactory<\Database\Factories\PromotionFactory> */
    use HasFactory;
    protected $guarded = [];

     protected $casts = [
        'applicable_product_ids'  => 'array',
        'applicable_category_ids' => 'array',
        'applicable_sub_category_ids' => 'array'
    ];
    protected $hidden = [
        'times_used',
        'max_uses',
        'priority',
        'created_at',
        'updated_at',
        'applicable_category_ids',
        'applicable_product_ids',
        'applicable_sub_category_ids',
    ];

    public function products(){
         return $this->hasMany(Promotion::class);
    }


    public function homeLayoutOrcs()
    {
       return $this->morphMany(HomeLayoutOrc::class, 'sortable');
    }
}
