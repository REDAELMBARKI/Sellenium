<?php


namespace App\Http\Requests;

use App\Services\product\validation\SubmitedProductValidation;
use App\Models\Media;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class PublishProductRequest extends FormRequest{

    public function authorize(Request $request)
    {
        return true;
        
    }
    public function rules(){
     return SubmitedProductValidation::rules();
    }


    public function withValidator($validator){
          $validator->after(function($validator){
            $draft =  $this->route('product') ;
            $hasThumbnail = Media::where('mediaable_id' , $draft->id)
                            ->where('collection' , 'thumbnail')->exists() ;
            if(!$hasThumbnail) {
                $validator->errors()->add('thumbnail' , "Thumbnail is required ") ;
            }
          }) ;

    }

}

