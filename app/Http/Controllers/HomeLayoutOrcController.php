<?php

namespace App\Http\Controllers;

use App\Models\HomeLayoutOrc;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeLayoutOrcController extends Controller
{
    public function index()
    {
         
         $sections = HomeLayoutOrc::with('sortable')->get()
                     ->map(function($section){
                         switch($section->sortable_type){
                             case 'collection':
                                 $sortable = $section->sortable;
                                 $products = Product::with('thumbnail')->where("");
                                 $sortable->products = $products ;
                                 return $section ;
                             case 'banner' :
                                 return $section ;
                             default:
                                 return null; // or handle unknown types as needed
                         }
                     });
         
         return Inertia::render('admin/pages/store/HomePageOrchestration/HomeEditor', [
            'sectionss' => $sections
        ]);
    }
}
