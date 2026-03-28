<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $data_sections = Product::with('nichCategory')
                         ->get()
                         ->groupBy("nichCategory.name");
        // $section = DB::table('catalog_sections')->get(['name']);
        // return $data_sections;
        return Inertia::render('Home/HomePage', [
            'data_sections' => $data_sections,
        ]);
    }
}
