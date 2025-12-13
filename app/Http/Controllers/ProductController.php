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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PHPUnit\Framework\MockObject\Stub\ReturnReference;
use PHPUnit\TextUI\Configuration\Merger;

class ProductController extends Controller
{ 
  

    public function index(){
        // $products = Product::with('tags')->paginate(10) ;
        return Inertia::render("admin/pages/products/ProductsList" ) ;
    }



    public function draft() {
        return Inertia::render("admin/pages/products/Drafts") ;
    }


    public function create()
    {
    
        $colors = Color::select('id', 'hex')->distinct()->get();

        $sizes = Size::select('id', 'name')->distinct()->get();
        $fits = Fit::select('id', 'name')->distinct()->get();
        $materials = Material::select('id', 'name')->distinct()->get();;
    
        $nicheOptions = [
            'colors' => [
                [ 'id' => 1, 'hex' => '#e5ff00ff', 'name' => 'Red' ],
                [ 'id' => 2, 'hex' => '#ff00fbff', 'name' => 'Blue' ],
                [ 'id' => 3, 'hex' => '#00FF00', 'name' => 'Green' ],
            ],

            'sizes' => [
                [ 'id' => 1, 'name' => 'S' ],
                [ 'id' => 2, 'name' => 'M' ],
                [ 'id' => 3, 'name' => 'Llll' ],
                [ 'id' => 4, 'name' => 'XL' ],
            ],

            'fits' => [
                [ 'id' => 1, 'name' => 'regular' ],
                [ 'id' => 2, 'name' => 'slim' ],
                [ 'id' => 3, 'name' => 'oversized' ],
            ],

            'materials' => [
                [ 'id' => 1, 'name' => 'Cotton' ],
                [ 'id' => 2, 'name' => 'Polyester' ],
            ],
        ];



        


        return inertia::render("admin/pages/products/Create" , ['nicheOptions' => $nicheOptions , 'tagSuggestions' => []]);
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
     
    public function storeAttachCover($variant_covers , $variant_ids){
        //check the directory if exist of create it 
        if (! Storage::exists('public/images/products')) {
            Storage::makeDirectory('public/images/products');
        }

        $covers_ids = [];
        $i = 1;
        foreach ($variant_covers as $cover) {
            $cover = $cover["cover_$i"];
            $fileName = uniqid() . '.' . $cover->getClientOriginalExtension();
            $path = $cover->storeAs('products', $fileName, 'public');
            $relative_path = 'storage/' . $path;

            $cover = Cover::create([
                'path' => $relative_path
            ]);

            $covers_ids[] = $cover->id;
             
            
            $i++;
        }
 


        foreach($variant_ids as $inventory_id){
              foreach($covers_ids  as $cover_id){
                DB::table('cover_inventory')->insert([
                    'cover_id' => $cover_id ,
                    'inventory_id' => $inventory_id
                ]);
              }
        }
    
        
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
           

            // store new colors (none existing ones );
            $inventoryServices->storeNewColors($variant);

            // getVariant  idies 
            $quantity = $variant['quantity'];
          
            $sizes_ids =  $inventoryServices->getVariantSizesIdies($variant);
            $fits_ids =  $inventoryServices->getVariantFitsIdies($variant);

            $colors_ids =  $inventoryServices->getVariantColorsIdies($variant);
            $materials_ids =  $inventoryServices->getVariantMaterialsIdies($variant);
 
            // get variant covers
            $variant_ids = [];
            $variantRows = []; 
            foreach ($colors_ids as $color_id) {
                foreach ($materials_ids as $material_id) {
                     foreach($sizes_ids as $size_id){
                          foreach($fits_ids as $fit_id){
                            $inventory = Inventory::create(
                                [
                                    'product_id' => $product_id,
                                    'color_id' => $color_id,
                                    'size_id' => $size_id,
                                    'fit_id' => $fit_id,
                                    'material_id' => $material_id,
                                    'quantity' => $quantity,
                                ]);

                            $variant_ids[] = $inventory->id;
                          }
                     }
                }
            }


          
            // store varaint's images
            // Covers =======================================================================================
            // store  the covers to covers table with foreign key product_id
            $variant_covers_data = collect();
            
            if(isset($variant['covers'])){
                foreach ($variant['covers'] as $cover) {
                    $variant_covers_data->push($cover);
                }
            }
            
            

            $this->storeAttachCover($variant_covers_data, $variant_ids);
            
        }

    }



    


    public function edit(){ 
        $product =  Product::with('tags')-> find(1) ;
        
        $product['category'] = ['pants', 'jeans'];
        $product['gender']   = ['man', 'female'];

        $colors = Color::select('id', 'hex')->distinct()->get();

        $sizes = Size::select('id', 'name')->distinct()->get();
        $fits = Fit::select('id', 'name')->distinct()->get();
        $materials = Material::select('id', 'name')->distinct()->get();;
    
       $nicheOptions = [
            'colors' => [
                [ 'id' => 1, 'hex' => '#e5ff00ff', 'name' => 'Red' ],
                [ 'id' => 2, 'hex' => '#ff00fbff', 'name' => 'Blue' ],
                [ 'id' => 3, 'hex' => '#00FF00', 'name' => 'Green' ],
            ],

            'sizes' => [
                [ 'id' => 1, 'name' => 'S' ],
                [ 'id' => 2, 'name' => 'M' ],
                [ 'id' => 3, 'name' => 'Llll' ],
                [ 'id' => 4, 'name' => 'XL' ],
            ],

            'fits' => [
                [ 'id' => 1, 'name' => 'regular' ],
                [ 'id' => 2, 'name' => 'slim' ],
                [ 'id' => 3, 'name' => 'oversized' ],
            ],

            'materials' => [
                [ 'id' => 1, 'name' => 'Cotton' ],
                [ 'id' => 2, 'name' => 'Polyester' ],
            ],
        ];



        $tagSuggestions = Tag::select('id' , 'slug')->get();
        
        return inertia::render('admin/pages/products/Edit' , compact('product' , 'nicheOptions' , 'tagSuggestions'));
    }

    public function update(UpdateProductRequest $request, $id)
    {


    }


    public function destroy(UpdateProductRequest $request, $id){

    }


    public function show($id){

        $product = Product::findOrFail($id);
        $product_covers = [];

        // this one works with a loop 
        // foreach ($product->inventories as $inventory) {
        //     $product_covers[] = $inventory->covers()->distinct('id', 'path')->get()->toArray();
        // };
        $product_covers[] = $product->covers()->with('inventories')->get()->toArray();
        $product_colors = $product->colors()->select( 'color_id' ,'hex' )->get()->toArray();
        
        $product_materials = $product->materials()->select('materials.id', 'materials.name')->get()->toArray();
        $product_fits = $product->fits()->select('fits.id', 'fits.name')->get()->toArray();
        $product_sizes = $product->sizes()->select('sizes.id', 'sizes.name')->get()->toArray();

        dd($product_covers);
        $product['covers'] = $product_covers;
        
        $product['colors'] = $product_colors; 
        $product['materials'] = $product_materials;
        $product['sizes'] = $product_sizes;
        $product['fits'] = $product_fits;
        

        
    //    $variants = $product->variants;
       return inertia::render('products/show', ['product' => $product]);
    }
}
