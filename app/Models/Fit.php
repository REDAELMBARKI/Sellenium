<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fit extends Model
{
    /** @use HasFactory<\Database\Factories\FitFactory> */
    use HasFactory;

    protected $fillable = ['name'];

    public  function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    public function products()
    {
        return $this->hasManyThrough(Product::class, Inventory::class, 'fit_id', 'id', 'id', 'product_id');
    }
}
