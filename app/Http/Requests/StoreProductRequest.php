<?php


namespace App\Http\Requests;

use App\Models\Color;
use App\Models\Size;
use App\Models\Fit;
use App\Models\Material;
use App\Models\Tag;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

use function PHPUnit\Framework\isArray;

class StoreProductRequest extends FormRequest{

    public function authorize()
    {
        // return true; 
        dd($this->all());
    }
    public function rules(){
         
        return array_merge(
                    $this->product_infos(), 
                 
                    $this->product_tags(),
                    $this->product_inventory()
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
             "brand" => [
                'bail',
                'required',
                'min:3',
                'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\[\]]+$/'
            ],

           'thumbnail' => ['required', 'bail', 'image', 'mimes:png,jpg,jpeg', 'max:4096'],
           'video' => [ 'bail', 'image', 'mimes:png,jpg,jpeg', 'max:4096'],
           'covers.*' => ['bail', 'image', 'mimes:png,jpg,jpeg', 'max:4096'],


            "price" => ['bail', 'required', 'numeric', 'min:1'],
            "oldPrice" => ['bail', 'numeric', 'min:1'],

            "brand" => ['bail', 'required', 'string', 'min:3'],
            "isFeatured" => ['bail', 'boolean'],
            "isFreeShipping" => [ 'boolean'],
            "tags" => ['array'] , 
            "tags.*.label" => [''] , 
            "description" => [
                'bail',
                'string',
                'min:10',
                'regex:/^[\pL0-9\s\-+_.,:;()\'"@!#%&*\/\\\[\]]+$/u'
            ],
        ];
    }

    private function product_images($variant)
    {

        
        $product_images = collect();
        $validated_images = [];
    
                foreach($variant['covers'] as $cover){
                        $product_images->push(...array_keys($cover));
                }

                foreach ($product_images as $image_name) {
                    $validated_images[$image_name] = ['bail', 'image', 'mimes:png,jpg,jpeg', 'max:4096'];
                }
        
        return $validated_images;
    }


    private function product_inventory()
    {
        return [
            "variant" => ['array', 'bail', 'required'],

            // quantity
            "variant.*.quantity" => ['integer', 'min:0'],

            // colors array
            "variant.*.colors" => ['array'],

            // each color item must be an array
            "variant.*.colors.*" => ['array'],

            // color ID
            "variant.*.colors.*.id" => [
                'bail',
                'nullable',
                'integer',
                Rule::exists((new Color)->getTable(), 'id')
            ],

            // color HEX
            "variant.*.colors.*.hex" => [
                'bail',
                'regex:/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'
            ],
 
            //cover array
            "variant.*.covers" => [
                'array',
            ],
            "variant.*.covers.*" => [
                'array',
            ],


            // size
            "variant.*.sizes" => ['array'],
            "variant.*.sizes.*.id" => [
                'bail',
                'integer',
                Rule::exists((new Size)->getTable(), 'id')
            ],

        ];
    }




    


    private function product_tags(){
        return [
            'tags' => ['bail', 'array'],
           
            'tags.*' => ['array'],
            'tags.*.id' => ['nullable' , Rule::exists((new Tag)->getTable() , 'id')],
            'tags.*.name' => [
                'nullable' , 'string','min:1' , 'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\\[\]]+$/' ,'string',
            ]
        ];
    }
}

