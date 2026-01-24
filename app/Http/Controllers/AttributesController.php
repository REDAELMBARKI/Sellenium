<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Inertia\Inertia;

class AttributesController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/pages/variants/AttributePage');
    }


    public function store() : void
    {
        '' ;
    }
}
