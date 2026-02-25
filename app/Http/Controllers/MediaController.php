<?php

namespace App\Http\Controllers;

use App\Http\Requests\MediaRequest;
use App\Models\Media;
use App\Models\Product;
use App\Services\MediaService;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage ;
use Illuminate\Validation\Rule;

class MediaController extends Controller
{


    public function __construct(private MediaService $mediaService)
    {

    }

   
      public function storeForVariant(MediaRequest $request){
        $file = $request->file('file');
        $media = $this->mediaService->store($file);
        return response()->json(
        [
            'media' => $media
                
        ]);
       
    }

    public function storeForProduct(MediaRequest $request){
        $product = $request->model_id ? Product::find($request->model_id) : Product::create(['name' => null ]) ;
        $file = $request->file('file');
        $media = $this->mediaService->store($file ,$product);
        // Debug in console (as JSON response)
        return response()->json(
        [
            'draft_id' => $product->id ,
            'media' => $media
                
        ]);
       
    }

    public function destroy($mediaId){
        $mediaId = validator(['id' => $mediaId] , [
             'id'=> ['required' , Rule::exists('media' , 'id')]  ,
        ]);

        try{

            $this->mediaService->deleteMedia($mediaId);

        }catch(QueryException $e){
            return response()->json(['message'=> 'failed to delete the media retry'])->setStatusCode(404);
        }catch(Exception $e){
            return response()->json(['message'=> ''])->setStatusCode(500);
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
