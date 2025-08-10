<?php

namespace App\Http\Controllers;


use App\Http\Requests\StoreProductRequest;

use App\Http\Requests\UpdateProductRequest;
use App\Http\Services\InventoryServices;
use App\Http\Services\MaterialServices;
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
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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


    public function store(StoreProductRequest $request ,
                            InventoryServices $inventoryServices ,
                           )
                           {
        
       
        $validated = $request->validated();
        $product_input_data = collect($validated);
        
    
        // collumns for each table
        $availableCovers = [];
        foreach($request->all() as $key => $value) {
           if(str_starts_with($key,'cover_')) {
                $availableCovers[] = $key;
            }
        }

        $product_info = $product_input_data->except(['inventory', ...$availableCovers , 'tags'])->toArray();
        
        // Products basic Info =======================================================================================

        // store to  products table  and return it 

        $product = Product::create($product_info);

        // Covers =======================================================================================
        // store  the covers to covers table with foreign key product_id
        $this->storeCovers($request->allFiles() , $product->id);
        // Tags =======================================================================================
        // store product related tags and store the none existed tags to tags table 
        $this->storeTags($product_input_data , $product);

        // Inventory =======================================================================================
        // store  the inventry's data to covers table with foreign key product_id

        $this->storeToInventory($product_input_data,$product->id, $inventoryServices);
        

    }
     
    public function storeCovers($request_files , $product_id){
        
        //check the directory if exist of create it 
        if (! Storage::exists('public/images/products')) {
            Storage::makeDirectory('public/images/products');
        }

        // store covers in covers table 
        $covers = [];


        foreach ($request_files as $key => $file) {
            if (str_starts_with($key, 'cover_')) {
                $covers[] = $file;
            }
        }

        $coversDataCollection = collect();
        foreach ($covers as $cover) {
            $fileName = uniqid() . '.' . $cover->getClientOriginalExtension();
            $path = $cover->storeAs('products', $fileName, 'public');
            $relative_path = 'storage/' . $path;



            $coversDataCollection->push([
                'product_id' => $product_id,
                'path' => $relative_path,
            ]);
        }


       
        Cover::insert($coversDataCollection->toArray());
    }
    public function storeTags($product_input_data , $product){
        $tags = $product_input_data->get('tags');
        
        foreach ($tags as $tag) {


            $exist = Tag::where(function ($q) use ($tag) {
                if (! empty($tag['id'])) {
                    $q->orWhere('id', $tag['id']);
                }
                if (! empty($tag['name'])) {
                    $q->orWhere('name', 'like', '%' . $tag['name'] . '%');
                }
            })->first();


            if ($exist) {
                $product->tags()->attach($exist->id);
            } else {
                $newtagAdded = Tag::create([
                    'name' => $tag['name'],
                    'slug' => Str::slug($tag['name']),
                ]);
                $product->tags()->attach($newtagAdded->id);
            }
        }
    }


     public function storeToInventory($product_input_data ,$product_id , $inventoryServices){

        $inventory_data = $product_input_data->get('inventory');
        foreach ($inventory_data  as $variant) {
            $variant = collect($variant)->merge([
                'product_id' => $product_id,
            ])->toArray();

            // store new colors (none existing ones );
            $inventoryServices->storeNewColors($variant);

            // getVariant colorr idies 
            $quantity = $variant['quantity'];
            $size_id = $variant['size']['id'];
            $fit_id = $variant['fit']['id'];
            $colors_ids =  $inventoryServices->getVariantColorsIdies($variant);
            $materials_ids =  $inventoryServices->getVariantMaterialsIdies($variant);
            $variantDataCollection = collect();

            foreach ($colors_ids as $color_id) {
                foreach ($materials_ids as $material_id) {
                    $variantDataCollection->push(
                        [
                            'product_id' => $product_id,
                            'color_id' => $color_id,
                            'size_id' => $size_id,
                            'fit_id' => $fit_id,
                            'material_id' => $material_id,
                            'quantity' => $quantity,
                        ]
                    );
                }
            }

            // for each variant insert all combination 

            Inventory::insert($variantDataCollection->toArray());
        }
     }



    public function edit(){
        return inertia::render('products/edit');
    }

    public function update(UpdateProductRequest $request, $id)
    {


    }
    
   
 
}
