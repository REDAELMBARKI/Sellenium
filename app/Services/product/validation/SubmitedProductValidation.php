<?php
namespace App\Services\product\validation;


class SubmitedProductValidation
{
    public static function rules()
    {
        return  array_merge(
            (new self)->product_base_rules(), 
            (new self)->product_attributes_rules(), 
            (new self)->product_variants_rules(), 
        );
    }



     private function product_base_rules()
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

           'thumbnail' => ['required', 'numeric'],
           'video' => ['nullable', 'numeric'],
           'covers' => ['nullable', 'array'],
           'covers.*' => ['bail','numeric'],
            "price" => ['bail', 'required', 'numeric', 'min:1'],
            "oldPrice" => ['bail', 'numeric', 'min:1'],

            "isFeatured" => ['bail', 'boolean'],
            "isFreeShipping" => [ 'boolean'],
            "tags" => ['array'],
            "tags.*" => ['bail', 'string', 'min:2', 'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\[\]]+$/'] ,
            "description" => [
                'bail',
                'string',
                'min:10',
                'regex:/^[\pL0-9\s\-+_.,:;()\'"@!#%&*\/\\\[\]]+$/u'
            ],
        ];
    }


    private function product_variants_rules()
    {
        return [
            'variants' => ['required', 'array', 'max:100'],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            'variants.*.stock' => ['required', 'integer', 'min:0'],
            'variants.*.media_id' => ['nullable', 'exists:media,id'],
            'variants.*.*' => ['sometimes' , 'string', 'min:0'],

        ];
    }


    private function product_attributes_rules(){
        return [
            
        ];
    }
}
