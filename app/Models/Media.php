<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory ;
     protected $fillable = [
            'url'  ,
            'collection',
            'media_type' ,
            'size' ,
            'width' ,
            'height' ,
            'order'

    ];

    protected $hidden = [
    'collection' ,
    'created_at' ,
    'disk' ,
    'is_temporary' ,
    'mediaable_id' ,
    'mediaable_type' ,
    'updated_at' ,
    ];



    public function mediaable(){
        return $this->morphTo();
    }
}
