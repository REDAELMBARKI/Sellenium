<?php


namespace App\Http\Requests;

use App\Services\product\validation\DraftsValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class StoreDraftProductRequest extends FormRequest{

    public function authorize(Request $request)
    {
        return true;
    }
    public function rules(Request $request){
     return DraftsValidation::rules() ;
    }

}

