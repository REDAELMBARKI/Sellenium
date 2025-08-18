<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cover extends Model
{
    /** @use HasFactory<\Database\Factories\CoverFactory> */
    use HasFactory;


     protected $fillable = ['path'];

    public function product(){
          return $this->belongsTo(Product::class);
    }

    public function inventory(){
        return $this->belongsToMany(Inventory::class);
    }
 

}
