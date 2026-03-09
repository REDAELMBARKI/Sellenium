<?php

namespace App\Http\Resources;

use App\Models\Media;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;

class ProductDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public static $wrap = null ;
    public function toArray(Request $request): array
    {
        $variants = collect($this->whenLoaded("variants")) ?? collect([])  ;
        $variantsImages = Media::whereIn('mediaable_id' , $variants->pluck("id"))
                             ->where("mediaable_type" , ProductVariant::class)
                             ->where("collection" , "gallery")
                             ->where("media_type" , "image")
                             ->get() ;

        // dd($variantsImages);
        $colors = $variants
                ->filter()
                ->unique()
                ->map(function ($variant){
                    return collect([
                        "variant_id"=> $variant->id ?? null  ,
                        "hex" => $variant->attrs['color']['hex'] ?? null ,
                        "name" => $variant->attrs['color']['name'] ?? null ,
                    ]) ;
                })
                ->values()
                ->toArray()
                ;
        return [
            ...Arr::except(parent::toArray($request) , ['thumbnail']),
           "covers" => [
             $this->whenLoaded("thumbnail") ,
             ...$this->whenLoaded("covers") ,
             ...$variantsImages->map(fn(Media $i) =>  ([
                ...$i->toArray() ,
                "variant_id" => $i->mediaable_id
                ]))->toArray(),
           ] ,
           "colors" => $colors ,
           
        ];
    }
}
