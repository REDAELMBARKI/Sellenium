<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Models\Fit;
use App\Models\Material;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function create()
    {
        return view("");
    }


    public function store(Request $request)
    {
        $validated = request()->validate([
            "name" => ['bail' ,'required', 'min:3' ,'regex:^[a-zA-Z\d\-+_.,/\:;)_(*&\^%#@\\!\[\]\$'],
            "price" => ['bail' ,'required' , 'numeric' ,'min:1'],
            "brand" =>  ['bail', 'required', 'string', 'min:3'],

            "thumbnail"=>  ['array','required'],
            "thumbnail.*" => ['bail' ,  'image', 'mimes:png,jpg,jpeg' , 'max:4096'],

            "is_featured"=> ['bail' , 'boolean'],
            "free_shipping"=> ['boolean' , ''],
            "description"=> "",
            'quantity' => "",
            "color_id" => [ 'bail' ,'required' , 'integer' , Rule::exists((new Color)->getTable() , 'id') ],
            "size_id"=> ['bail' ,'required'  , 'integer', Rule::exists((new Size)->getTable() , 'id')],
            "material_id"=> [ 'bail' ,'required' , 'integer', Rule::exists((new Material)->getTable(), 'id')],
            "fit_id"=> [ 'bail' ,'required' , 'integer', Rule::exists((new Fit)->getTable(), 'id')]
        ],[
            "thumbnail.image" => "the file should be an image" ,
            "thumbnail.mimes" => "allowed formats for an image: jpg , png , jpeg , svg "
        ]);
    }
}
