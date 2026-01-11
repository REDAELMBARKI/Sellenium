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
           'file' => 'required|file|mimes:jpg,jpeg,png,gif,mp4,avi|max:10240', // max 10MB
       ];
    }

}