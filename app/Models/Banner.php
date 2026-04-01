<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    public function mainMedia(){
       return $this->belongsTo(Media::class , 'main_media_id') ;
    }


    public function secondaryMedia(){
       return $this->belongsTo(Media::class , "secondary_media_id");
    }

}
