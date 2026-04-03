<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeLayoutOrcController extends Controller
{
    public function index()
    {
         return Inertia::render('admin/pages/store/HomePageOrchestration/HomeEditor', [
        ]);
    }
}
