<?php 
namespace App\Http\Services;


use App\Models\Color;

class ColorServices {
    public  function storeNewColors($variant)
    {
        // store none existed colors 
        $newColors = [];
        foreach ($variant['colors'] as  $color) {
            $colorExists = Color::where(function ($query) use ($color) {
                if (!empty($color['id'])) {
                    $query->orWhere(
                        'id',
                        $color['id']
                    );
                }
                if (!empty($color['hex'])) {
                    $query->orWhere(
                        'hex',
                        $color['hex']
                    );
                }
            })->exists();




            if (! $colorExists) {
                $newColors[] = [
                    'hex' => $color['hex'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        Color::insert($newColors);
    }


    public function getVariantColorsIdies($variant){
        $color_idies = [];
        $color_hexes = [];
        foreach ($variant['colors'] as $color) {
            if(! empty($color['id'])){
               $color_idies[] = $color['id'];
            }
            else{
                if(! empty($color['hex'])){
                    $color_hexes[] = $color['hex'];
                }
            }
    
        }

        if(! empty($color_idies) && ! empty($color_hexes)){
            $ids = Color::where(function ($query) use ($color_idies , $color_hexes) {
                  $query->whereIn('id', $color_idies)
                  ->orWhereIn('hex', $color_hexes);
            })->pluck('id');


        }elseif(! empty($color_idies)){
            $ids = Color::whereIn('id', $color_idies)->pluck('id');

        }elseif(! empty($color_hexes)){
            $ids = Color::whereIn('hex', $color_hexes)->pluck('id');
        }else{
            $ids = collect();
        }

        
        return $ids;
    }
}