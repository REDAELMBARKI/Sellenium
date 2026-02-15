<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        $socialite = app('Laravel\Socialite\Contracts\Factory');
        $httpClient = new \GuzzleHttp\Client(['verify' => false]);
        
        return $socialite->driver('google-login')
            ->setHttpClient($httpClient)
            ->stateless()
            ->redirect();

    }
    
   public function callback(Request $request)
    {
        try {
            $socialite = app('Laravel\Socialite\Contracts\Factory');
            $httpClient = new \GuzzleHttp\Client(['verify' => false]);
            Log::error('before creating the google user');
            
            $googleUser = $socialite->driver('google-login')
                ->setHttpClient($httpClient)
                ->stateless()
                ->user();
                
            Log::error('created the google user');
            
            $user = User::where('email', $googleUser->email)->first();
            
            if ($user) {
                Log::error('user already exists');
                $user->update(['google_id' => $googleUser->id]);
            } else {
                Log::error('create the user in db');
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'password' => Hash::make(Str::random(16)),
                    'email_verified_at' => now(),
                ]);
            }
            
            Log::error('logging in the user');
            Auth::login($user);
            Log::error('user logged in');

            $intendedUrl = session()->pull('url.intended', '/');
            Log::error('getting the url intended', ['url' => $intendedUrl]);
            
            return redirect()->intended($intendedUrl , '/');
            
        } catch (\Laravel\Socialite\Two\InvalidStateException $e) {
            Log::error('InvalidStateException: ' . $e->getMessage());
            return $this->redirectToLogin();
            
        } catch (\Exception $e) {
            // This will catch ALL other exceptions
            Log::error('Google Login Error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return $this->redirectToLogin();
        }
    }

    private function redirectToLogin()
    {
        return redirect('/login');
    }
}