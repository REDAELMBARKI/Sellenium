<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cover extends Model
{
    /** @use HasFactory<\Database\Factories\CoverFactory> */
    use HasFactory;


     protected $fillable = ['path'];
    protected $hidden = ['created_at', 'updated_at'];
    public function product(){
          return $this->belongsTo(Product::class)
                 ;
    }

    public function inventory(){
        return $this->belongsToMany(Inventory::class , 'cover_inventory' , 'cover_id' , 'inventory_id');
    }
 

}
