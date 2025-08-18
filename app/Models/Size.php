<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    /** @use HasFactory<\Database\Factories\SizeFactory> */
    use HasFactory;

    protected $fillable = ['name' , 'abbr'];

    public  function inventories(){
        return $this->hasMany(Inventory::class);
    }

    public function products(){
        return $this->hasManyThrough(Product::class ,Inventory::class , 'size_id' , 'id' , 'id' , 'product_id');
    }
}
