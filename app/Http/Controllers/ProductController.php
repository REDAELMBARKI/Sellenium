<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDraftProductRequest;
use App\Http\Resources\ProductResources;
use App\Services\product\ProductService;
use App\Models\Category;
use App\Models\Media;
use App\Models\Product;
use App\Services\CategoryService;
use Illuminate\Auth\Access\Gate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
  
     public function __construct(private CategoryService $categoryService)
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
                ],
                ]
               
            ]);
    }
   
    public function storeDraft()
    {
        $product = Product::create([
            'name'     => null,
            'status' => "draft",
        ]);

        return response()->json(['id' => $product->id]);

    }

    public function publish(ProductService $service , Product $product)
    {
        if(!$service->isPublishable($product)){
            return response()->json(['message' =>  'some fileds are missing ']) ;
        }
        $service->publish($product);
        // store product data
        return redirect()->back()->with('success', 'Product published successfully');

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

    public function update(Request $request , ProductService $service, Product $product)
    {
        $validated = $request->validated() ;
        $service->updateDraft($validated , $product );
        return redirect()->route('drafts.index');
    }

    public function destroy($id){
        //  Gate::authorize('manage_products') ;
         Product::findOrFail($id)->delete() ;
         return response()->json([
            'message' => 'Product deleted successfully'
         ]);
    }


    public function show(){
       return inertia::render('products/Show');
    }
}
