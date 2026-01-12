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
    

    

        return inertia::render("admin/pages/products/Create");
    }


    public function store(StoreProductRequest $request)
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
