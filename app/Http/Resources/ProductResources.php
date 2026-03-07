<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResources extends JsonResource
{
    /**
     * Create a new class instance.
     */
    public static $wrap = null;
    public function toArray(Request $request) 
    {
      // this calles resolve() and retuns the array or this->ressource == (the instance)
      $productArray = parent::toArray($request) ;
    
      return array_merge($productArray, [
            'tags' => $this->tags->pluck('name'),
        ]);
    }
}
