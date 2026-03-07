<?php

namespace App\Http\Resources;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
        $variantsImages = $this->variantsImages();
        $colors = collect($this->whenLoaded("variants") ?? [])
                ->filter()
                ->unique()
                ->map(function ($variant){
                    return collect([
                        "variant_id"=> $variant->id ?? null  ,
                        "color_hex" => $variant->attrs['color']['hex'] ?? null ,
                        "color_name" => $variant->attrs['color']['name'] ?? null ,
                    ]) ;
                })
                ->values()
                ->toArray()
                ;
        return [
            ...parent::toArray($request),
           "covers" => [
             $this->whenLoaded("thumbnail") ,
             ...$this->whenLoaded("covers") ,
             ...$variantsImages->map(fn(Media $i) =>  ([
                ...$i->toArray() ,
                "variant_id" => $i->mediaable_id
                ]))->toArray(),
           ] ,
           "colors" => $colors
        ];
    }
}
