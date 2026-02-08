<?php

namespace App\Services;

use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

class CartService
{
    public function getOrCreateToken()
    {
        $token = request()->cookie('cart_token');
         
        if (!$token) {
            $token = Str::uuid()->toString();
            cookie()->queue('cart_token', $token, 60 * 24 * 30); // 30 days
        }
        
        return $token;
    }
    
    public function clearToken()
    {
        cookie()->queue(cookie()->forget('cart_token'));
    }



    public function getCartItems(){
        return Cart::query()
            ->when(Auth::check(), function($q) {
                $q->where('user_id', Auth::id());
            })
            ->when(!Auth::check() && Cookie::has('cart_token'), function($q) {
                $q->where('cart_token', Cookie::get('cart_token'));
            })
            ->with(['productVariant' => function($q){
                    $q->select('id'  , 'product_id', 'attributes' , 'stock_quantity'); // this fials everything is showed up why
                    $q->with(['product' => function($q2){
                         $q2->select('id','name' , 'description'); // this works shows only these attributes
                         $q2->with('thumbnail') ;
                    }]) ;
            }] )
            ->get();
    }
}