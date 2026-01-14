<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublishProductRequest;
use App\Http\Requests\StoreDraftProductRequest;
use App\Http\Requests\StoreProductRequest;

use App\Http\Requests\UpdateProductRequest;
use App\Http\Services\InventoryServices;
use App\Http\Services\MaterialServices;
use App\Models\Color;
use App\Models\Cover;
use App\Models\Fit;
use App\Models\Inventory;
use App\Models\Material;
use App\Models\Media;
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
        $drafts = Product::where('status' , 'draft')->get() ;
        return Inertia::render("admin/pages/products/Drafts" , ['drafts' => $drafts] ) ;
    }


    public function create()
    {
        return inertia::render("admin/pages/products/Create" ,[
                'options' => [
                
                    'fits' => collect([
                        ['id' => 1, 'name' => 'Slim'],
                        ['id' => 2, 'name' => 'Regular'],
                        ['id' => 3, 'name' => 'Oversized'],
                    ]),

                    'materials' => collect([
                        ['id' => 1, 'name' => 'Cotton'],
                        ['id' => 2, 'name' => 'Polyester'],
                        ['id' => 3, 'name' => 'Wool'],
                        ['id' => 4, 'name' => 'Denim'],
                    ]),
                    // Static (enum-like)
                    'styles' => collect([
                        ['id' => 1, 'name' => 'Casual'],
                        ['id' => 2, 'name' => 'Formal'],
                        ['id' => 3, 'name' => 'Streetwear'],
                        ['id' => 4, 'name' => 'Sport'],
                        ['id' => 5, 'name' => 'Luxury'],
                    ]),

                    'genders' => collect([
                        ['id' => 1, 'name' => 'Men'],
                        ['id' => 2, 'name' => 'Women'],
                        ['id' => 3, 'name' => 'Unisex'],
                    ]),

                    'seasons' => collect([
                        ['id' => 1, 'name' => 'Spring'],
                        ['id' => 2, 'name' => 'Summer'],
                        ['id' => 3, 'name' => 'Autumn'],
                        ['id' => 4, 'name' => 'Winter'],
                        ['id' => 5, 'name' => 'All Seasons'],
                    ]),
                ],
            ]);
    }


    public function createDraft(StoreDraftProductRequest $request)
    {   
        $product = Product::create([
            'name' => $request->name ?? null,
            'brand' => $request->brand ?? null,
            'description' => $request->description ?? null,
            'price' => $request->price ?? null,
        ]);

        // store product data 
        return response()->json(
               [
                "id" => $product->id ,
               ]
        ) ;

    }


    public function updateDraftOnSave(StoreDraftProductRequest $request)
    {    
        // $baseInfo
        //tags
        $tags = $request->validated('tags');
        
        $product = Product::create([
            'name' => $request->name ?? null,
            'brand' => $request->brand ?? null,
            'description' => $request->description ?? null,
            'price' => $request->price ?? null,
        ]);

        // store product data 
        return response()->json(
               [
                "id" => $product->id ,
               ]
        ) ;

    }
    
    public function publish(PublishProductRequest $request , Product $product)
    {
        // ...$request->validated(), // should b splited
        $product->update([
            'status' => 'published'
        ]);

        Media::where('model_id' , $product->id)
                         ->each(function($media){
                             $media->update([
                                 'is_temporary' => false
                             ]) ;
                         });
        
        // store product data
        return response()->json(
               [
                "message" => "the product is created " ,
               ]
        ) ;

    }

    public function edit(){ 
    }

    public function update(UpdateProductRequest $request, $id)
    {
    }

    public function destroy($id){
         
         Product::findOrFail($id)->delete() ;
         return response()->json([
            'message' => 'Product deleted successfully'
         ]);
    }


    public function show(){

       
       return inertia::render('admin/pages/products/Show');
    }
}
