<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PAttr extends Model
{
    
    protected $table = 'product_attributes' ;
    protected $fillable = [
        'name',
        'slug',
        'type',
        'is_core',
        'sort_order',
    ];

    protected $hidden = [
       "slug" ,
        "type" ,
        "is_core" ,
        "created_at",
        "updated_at"
    ];
    public function values(){
        return $this->hasMany(AttributesValues::class , 'attribute_id' , 'id') ;
    }
}
