<?php


namespace App\Http\Requests;

use App\Models\Color;
use App\Models\Size;
use App\Models\Fit;
use App\Models\Material;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest{
    
    public function rule(){
        $covers = collect(range(1, 4))->mapWithKeys(function ($i) {
            return ["cover_$i" => ['bail', 'image', 'mimes:png,jpg,jpeg', 'max:4096']];
        })->toArray();

        $product_fields =  [
            "name" => [
                'bail',
                'required',
                'min:3',
                'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\\[\]]+$/'
            ],

            "price" => ['bail', 'required', 'numeric', 'min:1'],

            "brand" => ['bail', 'required', 'string', 'min:3'],

            "thumbnail" => ['required', 'bail', 'image', 'mimes:png,jpg,jpeg', 'max:4096'],
            
            "is_featured" => ['bail', 'boolean'],
            "free_shipping" => ['required', 'boolean'],

            "description" => [
                'bail',
                'string',
                'min:10',
                'regex:/^[\pL0-9\s\-+_.,:;()\'"@!#%&*\/\\\\[\]]+$/u'
            ],
          ];
        // any field is required but only if one of other input is present  
        $inventory_fields = [
            "inventory" => ['array' ,'bail' , 'required'],
            "inventory.*.quantity" => ['integer', 'min:0' ,  'required_with:inventory.*.color,
                                                              inventory.*.size_id,
                                                              inventory.*.material_id,
                                                              inventory.*.fit_id'],
           
            "inventory.*.color_id" => ['bail', 'required_with:inventory.*.quantity,
                                                              inventory.*.size_id,
                                                              inventory.*.material_id,
                                                              inventory.*.fit_id',
                                                               'integer', Rule::exists((new Color)->getTable(), 'id')],
            
            "inventory.*.size_id" => ['bail', 'required_with:inventory.*.quantity,
                                                              inventory.*.color_id,
                                                              inventory.*.material_id,
                                                              inventory.*.fit_id', 
                                                              'integer', Rule::exists((new Size)->getTable(), 'id')],
           
            "inventory.*.material_id" => ['bail', 'required_with:inventory.*.quantity,
                                                              inventory.*.color_id,
                                                              inventory.*.size_id,
                                                              inventory.*.fit_id', 
                                                              'integer', Rule::exists((new Material)->getTable(), 'id')],
            
            "inventory.*.fit_id" => ['bail', 'required_with:inventory.*.quantity,
                                                              inventory.*.size_id,
                                                              inventory.*.material_id,
                                                              inventory.*.color_id', 
                                                              'integer', Rule::exists((new Fit)->getTable(), 'id')]
        ];
 

        return array_merge($covers, $product_fields , $inventory_fields);
    }
}

