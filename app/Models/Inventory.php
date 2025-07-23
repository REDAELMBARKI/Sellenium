<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryFactory> */
    use HasFactory;


     protected $fillable = ['quantity' , 'product_id' , 'color_id' , 'size_id' , 'fit_id' , 'material_id'];
    
     public function product()
     {
        return $this->belongsTo(Product::class);
     }
    
}
