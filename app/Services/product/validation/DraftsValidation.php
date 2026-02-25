<?php
namespace App\Services\product\validation;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class DraftsValidation
{
    public static function rules()
    {
        // hey how can i only let one object to be sent to backedn like iseendn two types and only validate the type iframe oony to pass validation and other objects fiail 

        return array_merge(
           (new self)->draft_base_rules(),
            (new self)->draft_attributes_rules(),
            (new self)->draft_variants_rules(),
        );
       
    }

    
     private function draft_base_rules()
    {
        return [
        'draft_id' => ['nullable', 'numeric'] ,
        'category_niche_id' => ['nullable', 'numeric'] ,
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
        'video' => ['nullable', 'array'],
        'video.*.url' => ['nullable', 'string'],
        'video.*.media_type' => ['required' , 'string'] ,
        'covers' => ['nullable', 'array'],
        'covers.*' => ['nullable','numeric'],
        "price" => ['nullable', 'numeric', 'min:0'],
        "oldPrice" => ['nullable', 'numeric', 'min:0'],
        'subCategories' => ['array'] ,
        'subCategories.*' => ['numeric'] ,
        "isFeatured" => ['boolean'],
        "isFreeShipping" => ['boolean'],
        "tags" => ['nullable', 'array'],
        "tags.*" => ['nullable','string', 'min:2', 'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\[\]]+$/'],

        "description" => [
            'nullable',
            'string',
            'min:10',
            // 'regex:/^[\pL0-9\s\-+_.,:;()\'"@!#%&*\/\\\[\]]+$/u'
        ],
        "releaseDate" => ['nullable' , 'string'],
        "madeCountry" => ['nullable' , 'string'] ,

         // inventory json column
        'inventory' => ['nullable', 'array'],
        'inventory.quantity' => ['required_with:inventory', 'integer'],
        'inventory.sku' => ['required_with:inventory', 'string'],
        'inventory.backorderOptions' => ['required_with:inventory', 'in:notify,deny,allow'],
    
        // shipping json column 
        'shipping' => ['nullable', 'array'],
        'shipping.weight' => ['nullable', 'numeric'],
        'shipping.shippingClass' => ['nullable', 'string'],
        'shipping.dimensions' => ['nullable', 'array'],
        'shipping.dimensions.height' => ['nullable', 'numeric'],
        'shipping.dimensions.width' => ['nullable', 'numeric'],
        'shipping.dimensions.length' => ['nullable', 'numeric'],

        // validate meta
        'meta' => ['nullable', 'array'],
        'meta.metaTitle' => ['nullable', 'string', 'max:255'],
        'meta.metaDescription' => ['nullable', 'string', 'max:1000'],

        // ---------------------
        //  validate Vendor
        // ---------------------
        'vendor' => ['nullable', 'array'],
        'vendor.vendorName' => ['nullable', 'string', 'max:255'],
        'vendor.vendorSku' => ['nullable', 'string', 'max:255'],
        'vendor.vendorNotes' => ['nullable', 'string', 'max:1000'],


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
