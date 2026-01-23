<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class MediaRequest extends FormRequest {
    public function authorize()
    {

        return true;
    }


    public function rules()
    {
     
       // Define your validation rules for media upload here
       return [
            'file' => [],
            'collection' => 'required|in:cover,thumbnail,video,avatar,variant_cover,banner',
            'model_type' => 'required|in:Product,Variant,User,Admin,Brand,Category,General',
       ];
       
    }

}