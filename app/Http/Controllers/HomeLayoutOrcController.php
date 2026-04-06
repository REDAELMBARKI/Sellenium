<?php

namespace App\Http\Controllers;

use App\Models\HomeLayoutOrc;
use App\Models\Product;
use App\Models\RuleBasedCollection;
use Google\Service\Compute\Rule;
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
                                 $sortable->products = [];
                                 return $section ;
                             case 'banner' :
                                 return $section->load(['sortable.slots.mainMedia' , 'sortable.slots.secondaryMedia']); 
                             default:
                                 return null;
                         }
                     });
         
         return Inertia::render('admin/pages/store/HomePageOrchestration/HomeEditor', [
            'sectionss' => $sections
        ]);
    }

    public function getLimitedCollectionProducts(Request $request)
    {

        $validated = $request->validate([
            'collections' => 'required|array',
            'collections.*.collection_id' => 'required|exists:rule_based_collections,id',
            'collections.*.limit' => 'integer|min:1|max:100',
        ]);
        $collections = [] ;
        foreach ($validated['collections'] as $collection) {
            $collectionId = $collection['collection_id'];
            $limit = $collection['limit'];
            $collections[] = [
                'collection_id' => $collectionId,
                'limit' => $limit,
            ];
        }

        $db_collections = RuleBasedCollection::whereIn('id', array_column($collections, 'collection_id'))->get(['id' , 'rules']);
        
        $data = [] ;
        foreach($db_collections as $collection){
            $products =  Product::with(['thumbnail', 'badge', 'defaultVariant'])
            ->take($collection->limit)
            ->get()
            ->map(function ($product) {
                $product->price = $product->defaultVariant ? $product->defaultVariant->price : 12;
                $product->compare_price = $product->defaultVariant ? $product->defaultVariant->compare_price : 20;
                return $product;
            });
            $data[] = [
                'collection_id' => $collection->id,
                'products' => $products
            ];
        }
        return response()->json($data, 200);
    }

}
