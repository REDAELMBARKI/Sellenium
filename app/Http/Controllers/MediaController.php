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
    
   
    public function store(MediaRequest $request){
        $draft = $request->model_id ? Product::find($request->model_id) : Product::create([
            'name' => null ,
        ]) ;

        $file = $request->file('file');
        $collection = $request->collection;
        // storage
        $storagePath  = $this->folders[$collection] ?? 'general' ;
        $path = $file->store($storagePath , 'public');
        $url = Storage::url($path) ;
        

        $media = $draft->media()->create([
            'url'  => $url,
            'collection' => $collection,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'is_temporary' => true,
        ]) ;

        // Debug in console (as JSON response)
        return response()->json(
        [
            'draft_id' => $draft->id ,
            'media' => $media
                
        ]);
       
    }

    public function destroy($mediaId  , Request $request){
        $draftId = $request->draft_id ;
        
        $media = Media::where('id'  , $mediaId)
                        ->where('mediaable_id' , $draftId)
                        ->where('is_temporary' , true)
                        ->firstOrFail();
         
        if($media){
            // delete file from storage
            Storage::disk('public')->delete($media->url) ;
            // delete record from database
            $media->delete() ;
        }
        return response()->json(['message' => 'Media deleted successfully.']);
    }


    public function destroyBulk(Request $request){
        $draftId = $request->draft_id ;
        Media::where('mediaable_id' , $draftId)
                        ->where('is_temporary' , true)
                        ->each(function($media){
                            // delete file from storage
                            $filePath = str_replace('/storage/' , '' , $media->url) ;
                            Storage::disk('public')->delete($filePath) ;
                            // delete record from database
                            $media->delete() ;
                        });
        return response()->json(['message' => 'the request is here .']);
    }
}
