<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function create(){
         $banners = [] ;
         return Inertia::render("admin/pages/store/BannerEditor" , ["banners" => $banners]);
    }

    public function replicate(){
        
    }

    public function update(){

    }
}
