<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublishProductRequest;
use App\Http\Requests\StoreDraftProductRequest;
use App\Http\Resources\ProductResources;
use App\Http\Resources\ProductTest;
use App\Services\product\ProductService;
use App\Models\Category;
use App\Models\Media;
use App\Models\Product;
use App\Models\ShippingSetting;
use App\Models\Tag;
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
        return inertia::render("admin/pages/products/Create");
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
            $product  = $product->load(['thumbnail' , 'covers'  , 'video' , 'tags' , 'variants',   'subCategories']);
            $parents = DB::table('variants_options_settings')->whereNull('parent_id')->get(['key']) ;
            $options =[] ;
            foreach($parents as $parent){
                $options[$parent->key] =  DB::table('variants_options_settings')->where('key' , $parent->key)
                             ->whereNotNull('parent_id')
                             ->get(['value']) ;
            }
            return inertia::render("admin/pages/products/Create" ,
                [
                    'product' => (new ProductTest($product)),
                    'nich_cats' =>  $this->categoryService->get_niche_cats(),
                    'shipping_class' => ShippingSetting::value('shipping_class') ,
                    'badges' => DB::table("badges")->get(['id' , 'name' , 'color' , 'icon']),
                    'variants_options' => $options,
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



      public function suggest(Request $request){
        //   $request->validate(['q' => ['string' , 'min:2']]);
        //   $query = $request->validated("q");
        //   $excludes = $request->validated("excludes") ?? [];
          $excludes = $request->input('exclude', []);
          $query = $request->input('q', '');

          if (empty($query)) {
               return response()->json([], 200); // return nothing if empty
          }

          $products = Product::select('id', 'name' , 'slug')
            ->where(function($q) use ($query) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$query}%"])
                ->orWhereRaw('LOWER(slug) LIKE ?', ["%{$query}%"]);
            })
            ->whereNotIn("id" , $excludes)
            ->with('thumbnail')
            ->limit(10)
            ->get();
        
        return response()->json($products,200);
     }
}
