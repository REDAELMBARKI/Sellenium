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
            return ["cover_$i" => ['required', 'bail', 'image', 'mimes:png,jpg,jpeg', 'max:4096']];
        })->toArray();

        $other_fields =  [
            "name" => [
                'bail',
                'required',
                'min:3',
                'regex:/^[a-zA-Z0-9\s\-+_.,:;()@!#%&*\/\\\\[\]]+$/'
            ],

            "price" => ['bail', 'required', 'numeric', 'min:1'],

            "brand" => ['bail', 'required', 'string', 'min:3'],

            "cover_thumbnail" => ['required', 'bail', 'image', 'mimes:png,jpg,jpeg', 'max:4096'],
            
            "is_featured" => ['bail', 'boolean'],
            "free_shipping" => ['required', 'boolean'],

            "description" => [
                'bail',
                'string',
                'min:10',
                'regex:/^[\pL0-9\s\-+_.,:;()\'"@!#%&*\/\\\\[\]]+$/u'
            ],

            "quantity" => ['integer', 'min:0'],

            "color_id" => ['bail', 'required', 'integer', Rule::exists((new Color)->getTable(), 'id')],
            "size_id" => ['bail', 'required', 'integer', Rule::exists((new Size)->getTable(), 'id')],
            "material_id" => ['bail', 'required', 'integer', Rule::exists((new Material)->getTable(), 'id')],
            "fit_id" => ['bail', 'required', 'integer', Rule::exists((new Fit)->getTable(), 'id') ]
          ];    
    }
}

