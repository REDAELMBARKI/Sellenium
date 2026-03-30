<?php

namespace App\Http\Controllers;

use App\Http\Requests\CollectionRequest;
use App\Models\AppFactoryConfig;
use App\Models\RuleBasedCollection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RuleBasedCollectionController extends Controller
{  

    public function index()
    {
        $first = RuleBasedCollection::orderBy('order')->first();

        return redirect()->route('collections.edit', $first->slug);
    }
    public function edit(RuleBasedCollection $collection)
    {
        $collections = RuleBasedCollection::orderBy('order')->get();
        $app_factory_config = AppFactoryConfig::where("config_key" , "LIKE", "collections.%")
                                                ->where("config_key" , $collection->key)
                                                ->get(['id' , 'payload'])
                                                ->map(function($config) { return array_merge($config->payload , ["id" => $config->id]) ; })  ;
       
        return Inertia::render('admin/pages/store/RuleBasedCollections/CollectionEditor', [
              "collections" => $collections,
              "app_factory_config" => $app_factory_config,
              "selectedCollection" => $collection
        ]);
    }


    public function update(RuleBasedCollection $collection , CollectionRequest $collection_request)
    {
        $collection->update($collection_request->validated()) ;
        $app_factory_config = AppFactoryConfig::where("config_key" , "LIKE", "collections.%")->get(['id' , 'payload'])
        ->map(function($config) { return array_merge($config->payload , ["id" => $config->id]) ; })  ;
        $collections = RuleBasedCollection::orderBy('order')->get();
        return Inertia::render('admin/pages/store/RuleBasedCollections/CollectionEditor', [
              "collections" => $collections,
              "app_factory_config" => $app_factory_config,
        ]);
       
    }


    public function reorder(Request $request, RuleBasedCollection $collection)
    {
        $action = $request->input('action');

        switch ($action) {
            case 'increment':
                $collection->moveDown();
                break;
            case 'decrement':
                $collection->moveUp();
                break;
            case 'start':
                $collection->moveToStart();
                break;
            case 'end':
                $collection->moveToEnd();
                break;
        }

        return back();
    }


    private function normalizeOrder()
    {
    
    }
}
