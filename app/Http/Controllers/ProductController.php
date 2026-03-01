<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublishProductRequest;
use App\Http\Requests\StoreDraftProductRequest;
use App\Http\Resources\ProductResources;
use App\Services\product\ProductService;
use App\Models\Category;
use App\Models\Media;
use App\Models\Product;
use App\Models\ShippingSetting;
use App\Services\CategoryService;
use Illuminate\Auth\Access\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductController extends Controller
{
  
     public function __construct(private CategoryService $categoryService , private ProductService $productService)
     {
    
     }
     
    public function index(){
        // $products = Product::with('tags')->paginate(10) ;
        return Inertia::render("admin/pages/products/ProductsList" ) ;
    }
   


    public function drafts() {
        $drafts = Product::with(['thumbnail'])
        ->where('status' , 'draft')
        ->select(['id' , 'name' , 'brand' , 'price'  , 'compare_price', 'quality_score' , 'ready_to_publish' , 'updated_at'])->get() ;
        return Inertia::render("admin/pages/products/Drafts" , ['drafts' => $drafts] ) ;
    }


    public function create()
    {
        
        return inertia::render("admin/pages/products/Create" ,[
                "data" => [
                    'options' => [
                    'nich_cats' =>  $this->categoryService->get_niche_cats(),
                    'badges' => DB::table("badges")->get(['id' , 'name' , 'color' , 'icon']),
                    'shipping_class' => ShippingSetting::value('shipping_class') ,
                 ],
                ]
               
            ]);
    }




    /*
        creates the draft initialy 
    */
    public function storeDraft()
    {
        $product = Product::create([
            'name'     => null,
            'status' => "draft",
        ]);
        return response()->json(['id' => $product->id] , 201);

    }


    /*
        publiches the draft afeter validation
    */
    public function publish(PublishProductRequest $publishProductRequest , Product $product)
    {
        if(!$this->productService->isPublishable($product)){
            return response()->json(['message' =>  'some fileds are missing ']) ;
        }
        $this-> productService->publish($product);
        // store product data
        return redirect()->back()->with('success', 'Product published successfully');

    }


    /*
        saves the product (update) with validation (on submit click)
    */

    public function  updateOnSubmit(PublishProductRequest $publishProductRequest , Product $product){
            $payload = $publishProductRequest->validated();
            $this->productService->saveDraft($payload , $product);
            return redirect()->route('drafts.index')->with('success','product saved ');
    }


    /*
        saves the draft with no required fields in the page leave 

    */

    public function updateOnPageLeave(StoreDraftProductRequest $draftRequest , Product $product){
            $payload = $draftRequest->validated();
            $this->productService->saveDraft($payload , $product );
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


    public function destroy(Product $product){
        //  Gate::authorize('manage_products') ;
          $product->delete() ;
         return response()->json([
            'message' => 'Product deleted successfully'
         ],200);
    }


    public function show(){
       return inertia::render('products/Show');
    }
}
