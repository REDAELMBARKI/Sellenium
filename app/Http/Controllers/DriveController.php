<?php

namespace App\Http\Controllers;

use App\Services\Google\GoogleSheetsService;
use Google_Client;
use Google_Service_Drive;
use Google_Service_Sheets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
class DriveController extends Controller
{
    private $client ;
    public function __construct()
    {
         $this->client = app('googleApp');
    }

    // public function callBack(){
        
    // }

    public function auth(){
        try{
             return Socialite::driver('google')
            ->scopes(['https://www.googleapis.com/auth/drive.file'])
            ->with(['prompt' => 'consent'])  // ✅ Force consent screen
            ->redirect();
        }catch(\Exception $e){
          Log::error($e->getMessage());
        }
    }
}
