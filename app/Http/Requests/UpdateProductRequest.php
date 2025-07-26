<?php 

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;



use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest{
    public function authorize()
    {
        return true;
    }


    public function rules() {
        return [
            // update fields
        ];
    }
}