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
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;


class ProductController extends Controller
{
    public function create()
    {
    
        $colors = Color::select('id', 'hex')->distinct()->get();

        $sizes = Size::select('id', 'name')->distinct()->get();
        $fits = Fit::select('id', 'name')->distinct()->get();
        $materials = Material::select('id', 'name')->distinct()->get();;

        

    $inventoryOptions = [
        'colors' => $colors,
        'sizes' => $sizes,
        'fits' =>  $fits,
        'materials' => $materials,
    ];


        return inertia::render("products/create" , ['inventoryOptions' => $inventoryOptions]);
    }


    public function store(StoreProductRequest $request)
    {
        dd($request);    
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
        $availableCovers = [];
        foreach($request->all() as $key => $value) {
           if(str_starts_with($key,'cover_')) {
                $availableCovers[] = $key;
            }
        }


        $covers_columns = $products->only($availableCovers);
        $products_data = $products->except([...$inventory_columns, ...$covers_columns , 'tags']);
        $tags = $products->only('tags');


        dd($products_data);
        // store to  products table  and return it 
        $product = Product::create([]);

        
        // store  the covers to covers table with foreign key product_id
    
        //check the directory if exist of create it 
        if(! Storage::exists('public/images/products')){
            Storage::makeDirectory('pulic/images/products');
        }

        // store covers in covers table 
        $covers = [];


        foreach ($request->allFiles() as $key => $file) {
            if (str_starts_with($key, 'cover_')) {
                $covers[] = $file;
            }
        }

        foreach ($covers as $cover) {
            $fileName = uniqid() . '.' . $cover->getClientOriginalExtension();
            $path = $cover->storeAs('products', $fileName, 'public');
            $relative_path = 'storage/' . $path;

            Cover::create([
                'product_id' => $product->id,
                'path' => $relative_path,
            ]);
        }

        // store product related tags and store the none existed tags to tags table 
        foreach($tags as $tag) { 
            $exist = Tag::where ('name' ,$tag)->first();
            if ($exist) {
                 $product->tags()->attach($exist->id);
            }
            else{
                $newtagAdded = Tag::create([
                    'name' => $tag,
                ]);
                $product->tags()->attach($newtagAdded->id);
            }
        }



        // store  the inventry's data to covers table with foreign key product_id
        // [
        //     [color_id , size_id , fit_id , material_id],
        //     []
        // ]
        $inventory_data = $products->only($inventory_columns)->merge([
            'product_id' => $product->id
        ])->all();
        dd($inventory_data);
        // Inventory::insert($inventory_data);
    }


    public function edit(){
        return inertia::render('products/edit');
    }

    public function update(UpdateProductRequest $request, $id)
    {


    }
    
   
 
}
