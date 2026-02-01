<?php

namespace App\Http\Controllers;

use App\Services\Google\GoogleSheetsService;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

class DriveController extends Controller
{
    public function auth()
    {
        $socialite = app('Laravel\Socialite\Contracts\Factory');
        
        return $socialite->driver('google-drive')
            ->scopes(['https://www.googleapis.com/auth/drive.file'])
            ->stateless()
            ->with(['prompt' => 'consent'])
            ->redirect();
    }
    
    public function callBack(GoogleSheetsService $sheetService)
    {
       
        $socialite = app('Laravel\Socialite\Contracts\Factory');
        $httpClient = new \GuzzleHttp\Client(['verify' => false]);
        $googleUser = $socialite->driver('google-drive')->setHttpClient($httpClient)->stateless()->user();
         
        if (!$googleUser) {
            return redirect('/login')->with('error', 'Failed to get Google user data');
        }
        $user = Auth::user();
      
        if (!$user) {
            return redirect('/login')->with('error', 'Please login first');
        }
        
        $user->update([
            'google_token' => $googleUser->token,
            'google_refresh_token' => $googleUser->refreshToken,
        ]);
      
        $createdSheet = $sheetService->createOrderSheet('orders' , $googleUser->token) ;
        return redirect()->away($createdSheet->spreadsheetUrl);
    }
    
   
}