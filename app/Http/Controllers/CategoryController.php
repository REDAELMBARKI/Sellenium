<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function subCategories(Request $request){
        $request->validate([
            'parent_id' => ['required' , 'string'] ,
        ]) ;
        $subCategories = Category::where('parent_id' ,$request->parent_id )->get(['id' , 'name']) ;
        return response()->json($subCategories);
    }

  
}
