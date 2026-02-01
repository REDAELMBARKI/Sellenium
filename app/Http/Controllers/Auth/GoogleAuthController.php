<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        $driver = Socialite::driver('google-login') ;
        return $driver->redirect();

    }
    
    public function callback()
    {
        $googleUser = Socialite::driver('google-login')->user();
        dd($googleUser);
        // Find or create user
        $user = User::where('email', $googleUser->email)->first();
        
        if ($user) {
            // Existing user - just login
            $user->update([
                'google_id' => $googleUser->id,
            ]);
        } else {
            // New user - register
            $user = User::create([
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'password' => Hash::make(Str::random(16)),
                'email_verified_at' => now(),
            ]);
        }
        
        // Log them in
        Auth::login($user);
        
        return redirect('/')->with('success', 'Logged in successfully!');
    }
}