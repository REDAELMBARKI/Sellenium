<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
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

    public function getCartItems($wiThCategories = false){

        try{

        
        return Cart::query()
            ->when(Auth::check(), function($q) {
                $q->where('user_id', Auth::id());
            })
            ->when(!Auth::check() && Cookie::has('cart_token'), function($q) {
                $q->where('cart_token', Cookie::get('cart_token'));
            })
            ->with(['productVariant' => function($q) use($wiThCategories) {
                    $q->select('id', 'product_id', 'attributes', 'stock');
                    $q->with(['product' => function($q2) use($wiThCategories){
                        $q2->select('id', 'name', 'description');
                        $q2->with('thumbnail') ;
                        $q2->when($wiThCategories, function($q3){
                               $q3->with('subCategories', 'nichCategory') ;
                        });
                    }]);
            }])
        
            ->get();

        }
        catch(Exception $e){
             Log::error('querying cart items Error :'. $e->getMessage());
             return null ;
        }
    }


    public function calculateCartSubQuantity(array $items){

        return  (int) collect($items)->sum(function ($item) {
                 if (is_array($item)) {
                      return $item['quantity'];
                 }
                return $item->quantity;
      });
    }


    public  function calculateCartItemsSubtotal(array $items){
            return  (int) collect($items)->sum(function ($item) {
                        if (is_array($item)) {
                            return $item['subtotal'];
                        }
                        return $item->subtotal;
                     });
    }

    public function clearCart(User $user): void
    {
        Cart::where('user_id', $user->id)->delete();
    }
}