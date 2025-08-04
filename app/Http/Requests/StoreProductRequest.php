<?php


namespace App\Http\Requests;

use App\Models\Color;
use App\Models\Size;
use App\Models\Fit;
use App\Models\Material;
use App\Models\Tag;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest{

    public function authorize()
    {
        return true; 
    }
    public function rules(){
       
        return array_merge(
            $this->product_infos(), 
                    $this->product_images(),
                    $this->product_tags(),
                    $this->product_inventory()
                );
    }

    public function withValidator($validator){
        $validator->after(function ($validator) {

    
            foreach ($this->input("tags" , []) as $tag){
                
            }

        });
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


    private function product_inventory()
    {
        return [
            "inventory" => ['array', 'bail', 'required'],

            // quantity
            "inventory.*.quantity" => ['integer', 'min:0'],

            // colors array
            "inventory.*.colors" => ['array'],

            // each color item must be an array
            "inventory.*.colors.*" => ['array'],

            // color ID
            "inventory.*.colors.*.id" => [
                'bail',
                'nullable',
                'integer',
                Rule::exists((new Color)->getTable(), 'id')
            ],

            // color HEX
            "inventory.*.colors.*.hex" => [
                'bail',
                'regex:/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'
            ],

            // size
            "inventory.*.size" => ['array'],
            "inventory.*.size.id" => [
                'bail',
                'integer',
                Rule::exists((new Size)->getTable(), 'id')
            ],

            // materials
            "inventory.*.materials" => ['array'],
            "inventory.*.materials.*.id" => [
                'nullable',
                'bail',
                'integer',
                Rule::exists((new Material)->getTable(), 'id')
            ],

            // fit
            "inventory.*.fit" => ['array'],
            "inventory.*.fit.id" => [
                'bail',
                Rule::exists((new Fit)->getTable(), 'id')
            ],
        ];
    }






    private function product_tags(){
        return [
            'tags' => ['bail', 'required', 'array'],
           
            'tags.*' => ['array'],
            'tags.*.id' => ['nullable' , Rule::exists((new Tag)->getTable() , 'id')],
            'tags.*.name' => [
                'nullable' , 'string','min:1' , 'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\\[\]]+$/' ,'string',
             Rule::unique((new Tag)->getTable() , 'name')]
        ];
    }
}

