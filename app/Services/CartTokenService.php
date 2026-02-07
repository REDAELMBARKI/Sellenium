<?php

namespace App\Services;

use Illuminate\Support\Str;

class CartTokenService
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
}