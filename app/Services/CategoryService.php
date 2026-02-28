<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }


  
    public function get_niche_cats(){
        return  Category::where('parent_id' , null)->get(['id' , 'name']) ;
    }
}
