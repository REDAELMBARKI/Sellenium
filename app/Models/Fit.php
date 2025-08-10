<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fit extends Model
{
    /** @use HasFactory<\Database\Factories\FitFactory> */
    use HasFactory;

    protected $fillable = ['name'];

    public function products(){
          return $this->hasMany(Product::class);
    }
}
