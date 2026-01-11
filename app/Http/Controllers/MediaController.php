<?php

namespace App\Http\Controllers;

use App\Http\Requests\MediaRequest;
use App\Models\Media;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage ;

class MediaController extends Controller
{
    private $folders = [
                'thumbnail' => 'products/thumbnails',
                'cover'     => 'products/covers',
                'video'     => 'products/videos',
                'avatar_user' => 'users/avatars',
                'avatar_admin' => 'admin/avatars',
                'brand_logo' => 'brands',
                'general'   => 'general',
        ] ;
    
    private $models = [
        'Product' => Product::class,
        'User'    => 'App\Models\User',
        'Admin'   => 'App\Models\Admin',
        'Brand'   => 'App\Models\Brand',
    ] ;

    public function store(MediaRequest $request){
        $file = $request->file('file');
        $collection = $request->collection;
        $model_type = $request->model_type ;
        $modelId    = $request->draft_id ?? null ;
        $model = $this->models[$model_type] ?? null ;
        // storage
        $storagePath  = $this->folders[$collection] ?? 'general' ;
        $path = $file->store($storagePath , 'public');
        $url = Storage::url($path) ;
       
        $media = Media::create([
            'url'  => $url,
            'collection' => $collection,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'model_type' => $model,
            'model_id'   => $modelId,
            'is_temporary' => true,
        ]);
        // Debug in console (as JSON response)
        return response()->json($media);
       
    }


    public function destroy(){
         
    }
}
