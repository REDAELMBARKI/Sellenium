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
    try {
        $socialite = app('Laravel\Socialite\Contracts\Factory');
        $httpClient = new \GuzzleHttp\Client(['verify' => false]);
        
        $googleUser = $socialite->driver('google-login')
            ->setHttpClient($httpClient)
            ->user();
        
        $user = User::where('email', $googleUser->email)->first();
        
        if ($user) {
            $user->update(['google_id' => $googleUser->id]);
        } else {
            $user = User::create([
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'password' => Hash::make(Str::random(16)),
                'email_verified_at' => now(),
            ]);
        }
        
        Auth::login($user);
        
        return redirect('/')->with('success', 'Logged in successfully!');
        
    } catch (\Laravel\Socialite\Two\InvalidStateException $e) {
        return redirect('/login')->with('error', 'Session expired. Please try again.');
    }
        
    }
}