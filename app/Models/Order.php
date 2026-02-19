<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;
    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'confirmed',
        'tax',
        'currency',
        'payment_method',
        'paid',
        'paid_at',
        'shipping_cost',
        'discount_amount',
        'total_amount',
        'notes',
    ];
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


      public function items(){
        return $this->hasMany(OrderItem::class);
      }


      public function address(){
         return $this->hasOne(OrderAddress::class) ;
      }


      public function coupon(){
         return  $this->belongsTo::class(Coupon::class);
      }
      


    
}
