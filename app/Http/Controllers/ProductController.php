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
        
       
        $product_input_data = collect($request->validated());
        // Products basic Info =======================================================================================
        // store to  products table  and return it 
        $product = $this->storeProductData($product_input_data , $request->allFiles());

       
        // Tags =======================================================================================
        // store product related tags and store the none existed tags to tags table 
        $this->storeTags($product_input_data , $product);

        // Inventory =======================================================================================
        // store  the inventry's data to covers table with foreign key product_id

        $this->storeToInventory($product_input_data,$product->id, $inventoryServices);
        

    }
    public function storeProductData($product_input_data , $request_files){
        // store thumbnail
        if (! Storage::exists('public/images/products/thumbnails')) {
            Storage::makeDirectory('public/images/products/thumbnails');
        }
        $thum_fileName = uniqid() . '-thumbnail' . '.' . $request_files['thumbnail']->getClientOriginalExtension();
        $thum_path = $request_files['thumbnail']->storeAs('/products/thumbnails', $thum_fileName, 'public');
        $thum_relative_path = 'storage/' . $thum_path;


        $product_info = $product_input_data->only(['name' , 'brand' , 'description' , 'price' , 'is_featured' , 'free_shipping'])->toArray();
        $product_info['thumbnail'] = $thum_relative_path;

    
        return  Product::create($product_info);
    }
     
    public function storeCovers($covers , $variant_id){
        
        
        //check the directory if exist of create it 
        if (! Storage::exists('public/images/products')) {
            Storage::makeDirectory('public/images/products');
        }

    
        $coversDataCollection = collect();
        foreach ($covers as $cover) {

            $fileName = uniqid() . '.' . $cover->getClientOriginalExtension();
            $path = $cover->storeAs('products', $fileName, 'public');
            $relative_path = 'storage/' . $path;



            $coversDataCollection->push([
                'variant_id' => $variant_id,
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
            // store covers in covers table 
            $variant_covers = [];
            dd($variant);

            foreach ($variant as $key => $file) {
                if (str_starts_with($key, 'cover_')) {
                    $variant_covers[] = $file;
                }
            }



            // store new colors (none existing ones );
            $inventoryServices->storeNewColors($variant);

            // getVariant  idies 
            $quantity = $variant['quantity'];
            $size_id = $variant['size']['id'];
            $fit_id = $variant['fit']['id'];
            $colors_ids =  $inventoryServices->getVariantColorsIdies($variant);
            $materials_ids =  $inventoryServices->getVariantMaterialsIdies($variant);
            

            // get variant covers

            foreach ($colors_ids as $color_id) {
                foreach ($materials_ids as $material_id) {
                    $db_Variant =  Inventory::create(
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

            // store varaint's images
            // Covers =======================================================================================
            // store  the covers to covers table with foreign key product_id
            $this->storeCovers($variant_covers, $db_Variant->id);
            
        }

    }



    public function edit(){
        return inertia::render('products/edit');
    }

    public function update(UpdateProductRequest $request, $id)
    {


    }


    public function destroy(UpdateProductRequest $request, $id){

    }


    public function show($id){
       
       $product = Product::findOrFail($id);
       $covers = $product->covers->pluck('path');
        
       $covers[] = $product->thumbnail;

        
        
    //    $variants = $product->variants;
       return inertia::render('products/show', ['productData' => $product]);
    }
    
   
 
}
