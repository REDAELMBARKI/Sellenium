<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CartController extends Controller
{
    
    public function index(){
        $cartService = app(CartService::class);
        $cartItems = $cartService->getCartItems(false);
        return Inertia::render('cart/ShoppingCartMaster' , compact('cartItems'));
    }

    
public function destroy($id)
{
       validator(['id' => $id], [
            'id' => ['required', 'numeric', Rule::exists('products_cart', 'id')]
        ])->validate();
     

       $deleted = Cart::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail()
                    ->delete();

        if ($deleted) {
            return response()->json(['success' => 'Cart item deleted'], 200);
        }

        return response()->json(['error' => 'Failed to delete'], 400);
}

}
