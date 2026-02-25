<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDraftProductRequest;
use App\Http\Resources\ProductResources;
use App\Services\product\ProductService;
use App\Models\Category;
use App\Models\Media;
use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
  

    public function index(){
        // $products = Product::with('tags')->paginate(10) ;
        return Inertia::render("admin/pages/products/ProductsList" ) ;
    }



    public function draft() {
        $drafts = Product::with(['thumbnail'])
        ->where('status' , 'draft')
        ->select(['id' , 'name' , 'brand' , 'price'  , 'oldPrice', 'quality_score' , 'ready_to_publish' , 'updated_at'])->get() ;
        return Inertia::render("admin/pages/products/Drafts" , ['drafts' => $drafts] ) ;
    }


    public function create()
    {
        
        return inertia::render("admin/pages/products/Create" ,[
                "data" => [
                    'options' => [
                    'categories' => Category::whereNull('parent_id')->select(['id' , 'name'])->get() ,
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
                ]
               
            ]);
    }
   
    public function createDraft(StoreDraftProductRequest $request , ProductService $service)
    {
        
        $validated = $request->validated() ;
        $draft = $service->saveDraft($validated  , null);
        // store product data
        return response()->json(
               [
                "id" => $draft->id ,
               ]
        ) ;

    }

    public function updateDraftOnSave(StoreDraftProductRequest $request , ProductService $service)
    {
        $draft_id = $request->validated('draft_id') ;
        $draft = Product::find($draft_id) ;
        $validated = $request->validated() ;
        $service->saveDraft($validated , $draft );
        // return redirect()->route('drafts.index');
    }
    
    public function publish(ProductService $service , Product $product)
    {
        
        if(!$service->isPublishable($product)){
            return response()->json(['message' =>  'some fileds are missing ']) ;
        }

        $product->update([
            'status' => 'published'
        ]);

        Media::where('mediaable_id' , $product->id)
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

    public function edit(Product $product){
        $product  = $product->load(['thumbnail' , 'covers'  , 'video' , 'tags' ,  'subCategories']) ;
        return inertia::render("admin/pages/products/Create" ,[
                "data" => [
                    'categoryObject' => $product->nichCategory(),
                    'product' => (new ProductResources($product)),
                    'options' => [
                        'categories' => Category::whereNull('parent_id')->select(['id' , 'name'])->get() ,
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
                ]
            ]);
        
    }

    public function update(StoreDraftProductRequest $request , ProductService $service, Product $product)
    {
        $validated = $request->validated() ;
        $service->updateDraft($validated , $product );
        return redirect()->route('drafts.index');
    }

    public function destroy($id){
         
         Product::findOrFail($id)->delete() ;
         return response()->json([
            'message' => 'Product deleted successfully'
         ]);
    }


    public function show(){
       return inertia::render('products/Show');
    }
}
