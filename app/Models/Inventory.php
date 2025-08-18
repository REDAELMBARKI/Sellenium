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


    public function color(){
           return $this->belongsTo(Color::class);
    }

    public function covers(){
        return $this->belongsToMany(Cover::class);
    }


    public function fit(){
        return $this->belongsTo(Fit::class);
    }

    public function size()
    {
        return $this->belongsTo(Fit::class);
    }
   
}
