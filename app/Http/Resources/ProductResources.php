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

      $variants = collect($this->whenLoaded("variants") ?? collect([]) )->map(function($v){
        $v->variant_id = $v->id ;
        unset($v->id) ;
        return $v ;
      });

    
      $single = $variants->first(fn($v) => $v->is_single) ?? null ;
      $res =  [
            ...parent::toArray($request) ,
            'tags' => $this->tags->pluck('name'),
            "price" => $single ?  $single->price :  0  ,
            "compare_price" =>  $single ?  $single->compare_price :  0 ,
            "stock" =>   $single ? $single->stock :  0 ,
            "sku" =>   $single ? $single->sku : "",
            "variants" => $single ? [] : $variants
        ];

    //   dd($res);
     return $res ;
    }
}
