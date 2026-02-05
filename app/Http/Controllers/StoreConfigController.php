<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class StoreConfigController extends Controller
{
    public function index() {
        return Inertia::render("admin/pages/settings/configStore/ConfigureStoreLayout") ;
    }


}
