<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Services\CartService;
use Inertia\Inertia;

class CartController extends Controller
{   
    
    public function index(){
        $cartItems =(new CartService())->getCartItems();
        return Inertia::render('shoopingCart/CheckoutPageIndex' , compact(var_name: 'cartItems'));
    }



}
