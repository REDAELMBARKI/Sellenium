<?php
namespace App\Http\Services\productValidation;

class DraftsValidation
{
    public static function rules()
    { 
        return array_merge(
           (new self)->draft_base_rules(),
                    (new self)->draft_attributes_rules(),
                    (new self)->draft_variants_rules(),
        );
       
    }


    
     private function draft_base_rules()
    {
        return [
        "name" => [
            'nullable',
            'min:3',
            'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\[\]]+$/'
        ],
        "brand" => [
            'nullable',
            'min:3',
            'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\[\]]+$/'
        ],

        'thumbnail' => ['nullable', 'numeric'],  // can be empty in draft
        'video' => ['nullable', 'numeric'],
        'covers' => ['nullable', 'array'],
        'covers.*' => ['nullable','numeric'],

        "price" => ['nullable', 'numeric', 'min:0'],
        "oldPrice" => ['nullable', 'numeric', 'min:0'],

        "isFeatured" => ['boolean'],
        "isFreeShipping" => ['boolean'],
        "tags" => ['nullable', 'array'],
        "tags.*" => ['nullable','string', 'min:2', 'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\[\]]+$/'],

        "description" => [
            'nullable',
            'string',
            'min:10',
            'regex:/^[\pL0-9\s\-+_.,:;()\'"@!#%&*\/\\\[\]]+$/u'
        ],
    ];
    }


    private function draft_variants_rules()
    {
        return [
        
        ];
    }


    private function draft_attributes_rules(){
        return [
            
        ];
    }

}