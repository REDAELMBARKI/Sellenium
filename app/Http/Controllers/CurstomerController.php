<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurstomerController extends Controller
{
    public function index () {
        return Inertia::render('admin/pages/customers/CustomersManager') ; 
    }
}
