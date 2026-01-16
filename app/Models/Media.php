<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
     protected $fillable = [
            'url'  ,
            'collection',
            'mime_type' ,
            'size' ,
            'model_type' ,
            'model_id' ,
            'width' , 
            'height' , 
            'order'

    ];

    public function mediaable(){
        return $this->morphTo();
    }
}
