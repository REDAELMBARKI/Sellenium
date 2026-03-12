<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublishProductRequest;
use App\Http\Requests\StoreDraftProductRequest;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductResources;
use App\Http\Resources\ProductTest;
use App\Services\product\ProductService;
use App\Models\Category;
use App\Models\Media;
use App\Models\Product;
use App\Models\ShippingSetting;
use App\Models\Tag;
use App\Services\CategoryService;
use Exception;
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
        
        $drafts = Product::with(['thumbnail' , 'variants' , 'nichCategory' , 'subCategories'])
        ->where('status' , 'draft')
        ->select(['id' , 'name', 'description' , 'brand' , 'quality_score', 'updated_at' ,'category_niche_id'])
        ->latest('updated_at')
        ->get() ;
        return Inertia::render("admin/pages/products/Drafts" , ['drafts' => $drafts] ) ;
    }


    public function create()
    {
            // gate product management 
            $parents = DB::table('variants_options_settings')->whereNull('parent_id')->get(['key']) ;
            $options =[] ;
            foreach($parents as $parent){
                $options[$parent->key] =  DB::table('variants_options_settings')->where('key' , $parent->key)
                             ->whereNotNull('parent_id')
                             ->get(['value']) ;
            }
            return inertia::render("admin/pages/products/create" ,
                [
                    'nich_cats' =>  $this->categoryService->get_niche_cats(),
                    'shipping_class' => ShippingSetting::value('shipping_class') ,
                    'badges' => DB::table("badges")->get(['id' , 'name' , 'color' , 'icon']),
                    'variants_options' => $options,
                 ]);
    }
    

    /*
        creates the draft initialy 
    */
        public function storeDraft()
        {
            // gates product management 

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
            // gate product management 

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
            // gate product management 
            // $payload = $publishProductRequest->validated();
            $payload = $publishProductRequest->validated();
            $this->productService->saveDraft($payload , $product);
            return redirect()->route('drafts.index')->with('success','product saved ');
        }
        
        
        /*
        saves the draft with no required fields in the page leave 
        
        */
        
        public function updateOnPageLeave(StoreDraftProductRequest $draftRequest , Product $product){
            // gate product management 
            $payload = $draftRequest->validated();
            $this->productService->saveDraft($payload , $product );
        }
        
        
        
    public function edit(Product $product){

            // gates product management 
            
            try {
            $product = $product->load(['thumbnail', 'covers', 'video', 'tags', 'variants', 'subCategories']);
            $parents = DB::table('variants_options_settings')->whereNull('parent_id')->get(['key']) ;
            $options =[] ;
            foreach($parents as $parent){
                $options[$parent->key] =  DB::table('variants_options_settings')->where('key' , $parent->key)
                             ->whereNotNull('parent_id')
                             ->get(['value']) ;
            }
            return inertia::render("admin/pages/products/create" ,
                [
                    'product' => new ProductResources($product),
                    'nich_cats' =>  $this->categoryService->get_niche_cats(),
                    'shipping_class' => ShippingSetting::value('shipping_class') ,
                    'badges' => DB::table("badges")->get(['id' , 'name' , 'color' , 'icon']),
                    'variants_options' => $options,
                 ]);
             } 
             catch (\Exception $e) {
                dd($e->getMessage(), $e->getTraceAsString()); // 👈 catch any silent errors
            }
            
    }


    public function destroy(Product $product){
        //  Gate::authorize('manage_products') ;
         try {
          $product->delete();
          return redirect()->back()->with('success', 'Deleted.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete.');
        }
    }


    public function show(Product $product){
       $product->load('variants','attrs','nichCategory','subCategories','thumbnail',
                      'covers' , 'videos'  , 'badge' , 'reviews');
       return inertia::render("admin/pages/products/Show"  , [
          'product'=> new ProductDetailResource($product),
       ]);
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


    public function duplicate(Product $product){
        //  Gate::authorize('manage_products') ;
       // gate admin later
       try {
        $this->productService->duplicate($product);
        return redirect()->back()->with('success','duplicated');
       }catch (Exception $e) {
         return redirect()->back()->with('error', 'failed to duplicate retry again');
       }
    }
}
