<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CategoryService;
use App\Services\Discount\CouponService;
use App\Services\Discount\PromotionService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
   
    public function __construct(
        private CategoryService $categoryService ,
        private PromotionService $promotionService ,
        private CouponService $couponService
    )
    {
    }

    public function index(){
        return Inertia::render('admin/pages/categories/Index' , [
            "categories" => $this->categoryService->getAllCats($this->couponService ,$this->promotionService )
        ]);
    }
    public function subCategories(Request $request){
        $request->validate([
            'parent_id' => ['required' , 'string'] ,
        ]) ;
        $subCategories = Category::where('parent_id' ,$request->parent_id )->get(['id' , 'name']) ;
        return response()->json($subCategories);
    }

    public function create(PromotionService $promotionService , CouponService $couponService){
        
        return Inertia::render("admin/pages/categories/Create" , [
            'niches' => $this->categoryService->get_niche_cats() ,
            'promotions' =>   Arr::except($promotionService->getDbPromotions()->toArray() , ['description' , 'is_active']),
            'coupons' =>  Arr::except($couponService->getDbCoupons()->toArray() , ['description' , 'is_active']),
        ]) ;
    }


    public function store(Request $request){
        $request->validate([
            'flag' => ['required' , Rule::in(['add-subs' , 'add-niches'])],
            'name' => ['required', 'string' , 'min:2'] ,
            'description' => ['nullable' , 'string' , 'min:2'] ,
            'nich_id' => [Rule::requiredIf(function() use ($request){
                return $request->flag === 'add-subs' ;
            })]
        ]);
    }

  
}
