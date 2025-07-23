<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    /** @use HasFactory<\Database\Factories\PromotionFactory> */
    use HasFactory;
    protected $fillable = ['product_id' , 'promo_percentage' , 'dead_line'];


    public function products(){
         return $this->hasMany(Promotion::class);
    }
}
