<?php

namespace App\Http\Controllers;


use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Color;
use App\Models\Cover;
use App\Models\Fit;
use App\Models\Inventory;
use App\Models\Material;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class ProductController extends Controller
{
    public function create()
    {
        // return view("product.create");
    }


    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();    

        $products = collect($validated);

        $inventory_columns = [
            "quanity",
            'color_id',
            'size_id',
            'fit_id',
            'material_id'
        ];
        
        // collumns for each table
        $covers_columns = $products->only(['covers']);
        $products_data = $products->except([...$inventory_columns, ...$covers_columns]);


        // store to  products table  and return it 
        $product = Product::create($products_data);

        
        // store  the covers to covers table with foreign key product_id
    
        //check the directory if exist of create it 
        if(! Storage::exists('public/images/products')){
            Storage::makeDirectory('pulic/images/products');
        }

        // store covers in covers table 
        $thumbnail = null;
        foreach ($request->file('covers') as $index => $cover) {
            $fileName = uniqid() . '.' . $cover->getClientOriginalExtension();

            $path =  $cover->storeAs('products', $fileName, 'public');
            $relativ_path = 'storage/' . $path;

            if($index == 0 && ! $thumbnail){
            
                $thumbnail = $relativ_path;
                
            }
            Cover::create([
            'product_id' => $product->id,
            'path'=> $relativ_path
            ]);
        }
      
        // updatae the thumbnail with main cover 
        
        if($thumbnail){
            Product::update([
                'thumbnail' => $thumbnail
            ]);
        }
        // store  the inventry's data to covers table with foreign key product_id

        $inventory_data = $products->only($inventory_columns)->merge([
            'product_id' => $product->id
        ])->all();

        Inventory::create($inventory_data);
    }


    public function edit(){
        // return view('product.edit');
    }

    public function update(UpdateProductRequest $request, $id)
    {


    }
    
   
 
}
