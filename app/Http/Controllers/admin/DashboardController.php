<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
 public function salesIndex(){ 
    return Inertia::render("admin/pages/dashboard/Dashboard") ; 
 }

  public function  customerIndex(){
    return Inertia::render("admin/pages/dashboard/Customer") ; 
 }

  public function inventoryIndex(){
    return Inertia::render("admin/pages/dashboard/Inventory") ; 
 }

}
