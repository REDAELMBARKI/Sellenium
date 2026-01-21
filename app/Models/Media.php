<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
     protected $fillable = [
            'url'  ,
            'collection',
            'media_type' ,
            'size' ,
            'width' ,
            'height' ,
            'order'

    ];

    public function mediaable(){
        return $this->morphTo();
    }
}
