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

    public function withValidator($validator){
        $validator->after(function ($validator) {

            //tags
            foreach ($this->input("tags" , []) as $index => $tag){
                if(empty($tag["id"])){

                    if(empty($tag["name"])){

                        $validator->errors()->add('tags', 'the tag name is required for new added tags');   
                    }
                }
            }
           
       
            /// inventory 'inv'
            $fields = ['colors' , 'materials' , 'sizes' , 'fits'];
            foreach($this->input('inventory') as $index => $variant){
                // validate the images for variant 

                // here we scipe the variant that doesnot have covers 
                if(is_array($this->file('inventory')) &&  (count($this->file('inventory')) >= $index + 1)){
                    
                    
                        $variantFiles = $this->file('inventory')[$index];
                        $this->product_images($variantFiles);

                    
                }
                
                
                $filledFields = array_filter($fields , function($field)  use($variant) {
                           return ! empty($variant[$field]);
                });
         

                if(count($filledFields) > 0){
                      foreach($fields as $field){
                            if(empty($variant[$field])){
                            $strEnd = str_ends_with('s',$field) ? 'are' : 'is'; 
                                $validator->errors()->add("inventory.$index.$field", "$field $strEnd  required in variant " . $index + 1);
                            
                            }
                      }
                }
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

           'thumbnail' => ['required', 'bail', 'image', 'mimes:png,jpg,jpeg', 'max:4096'],


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
 
            //cover array
            "inventory.*.covers" => [
                'array',
            ],
            "inventory.*.covers.*" => [
                'array',
            ],


            // size
            "inventory.*.sizes" => ['array'],
            "inventory.*.sizes.*.id" => [
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
            "inventory.*.fits" => ['array'],

            "inventory.*.fits.*.id" => [
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
            ]
        ];
    }
}

