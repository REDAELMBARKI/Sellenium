<?php


namespace App\Http\Requests;

use App\Models\Color;
use App\Models\Size;
use App\Models\Fit;
use App\Models\Material;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest{


    public function rules(){

    
        return array_merge(
            $this->product_images(),
                    $this->product_infos(), 
                    $this->product_inventory(), 
                    $this->product_tags()
                );
    }


    private function product_infos()
    {
        return [
            "name" => [
                'bail',
                'required',
                'min:3',
                'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\[\]]+$/'
            ],

            "price" => ['bail', 'required', 'numeric', 'min:1'],

            "brand" => ['bail', 'required', 'string', 'min:3'],
            "is_featured" => ['bail', 'boolean'],
            "free_shipping" => ['required', 'boolean'],

            "description" => [
                'bail',
                'string',
                'min:10',
                'regex:/^[\pL0-9\s\-+_.,:;()\'"@!#%&*\/\\\[\]]+$/u'
            ],
        ];
    }
    private function product_images()
    {
        $product_images = collect();


        $i = 1;

        while (request()->hasFile("cover_$i")) {
            $product_images->push("cover_$i");
            $i++;
        }

        $product_images->push("thumbnail");

        $validated_images = [];

        foreach ($product_images as $image_name) {
            $validated_images[$image_name] = ['required', 'bail', 'image', 'mimes:png,jpg,jpeg', 'max:4096'];
        
        }
        return $validated_images;
    }

 

    private function product_inventory(){
        return [
            "inventory" => ['array', 'bail', 'required'],

            "inventory.*.quantity" => ['integer', 'min:0',  'required_with:inventory.*.color,
                                                              inventory.*.size_id,
                                                              inventory.*.material_id,
                                                              inventory.*.fit_id'],

            "inventory.*.colors" => [                        
                                                             'bail',
                                                             'required_with:inventory.*.quantity,
                                                              inventory.*.size_id,
                                                              inventory.*.material_id,
                                                              inventory.*.fit_id',
             
                                                               Rule::exists((new Color)->getTable(), 'id')
            ],

            "inventory.*.size_id" => [
                'bail',
                'required_with:inventory.*.quantity,
                                                              inventory.*.color_id,
                                                              inventory.*.material_id,
                                                              inventory.*.fit_id',
                'integer',
                Rule::exists((new Size)->getTable(), 'id')
            ],

            "inventory.*.material_id" => [
                'bail',
                'required_with:inventory.*.quantity,
                                                              inventory.*.color_id,
                                                              inventory.*.size_id,
                                                              inventory.*.fit_id',
                'integer',
                Rule::exists((new Material)->getTable(), 'id')
            ],

            "inventory.*.fit_id" => [
                'bail',
                'required_with:inventory.*.quantity,
                                                              inventory.*.size_id,
                                                              inventory.*.material_id,
                                                              inventory.*.color_id',
                'integer',
                Rule::exists((new Fit)->getTable(), 'id')
            ]
        ];
    }


 


    private function product_tags(){
        return [
            'tags' => ['bail', 'required', 'array'],
            'tags.*' => ['regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\\[\]]+$/']
        ];
    }
}

