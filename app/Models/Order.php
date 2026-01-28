<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;
     protected $guarded = [];
     protected $hidden = [
      'updated_at'
     ] ;
     protected $casts = [
       'confirmed' => 'boolean',
       'paid' => 'boolean'
       
      
     ];
    

     public function products(){
        return $this->belongsToMany(Product::class);
     }

      public function user(){
        return $this->belongsTo(User::class);
      }


      public function orderItems(){
        return $this->hasMany(OrderItem::class);
      }


      public function address(){
         return $this->hasOne(OrderAddress::class) ;
      }

      


    
}
