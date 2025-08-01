<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagsController extends Controller
{
     public function suggest(Request $request){
          $query = $request->get("query" , '');

        $tags = Tag::select('id', 'name')
            ->where('name', 'like', "%{$query}%")
            ->limit(10)
            ->get();
        
        return response()->json($tags,200);
     }
}
