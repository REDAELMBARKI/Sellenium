<?php


namespace App\Http\Requests;

use App\Http\Services\productValidation\DraftsValidation;
use App\Http\Services\productValidation\SubmitedProductValidation;
use App\Models\Color;
use App\Models\Size;
use App\Models\Fit;
use App\Models\Material;
use App\Models\Tag;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use function PHPUnit\Framework\isArray;

class StoreProductRequest extends FormRequest{

    public function authorize()
    {
        return true;
        
    }
    public function rules(Request $request){
         
     return $request->boolean('is_draft')
        ? DraftsValidation::rules()
        : SubmitedProductValidation::rules();
    }
    
   
}

