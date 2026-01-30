<?php

namespace App\Http\Controllers;

use App\Services\Google\GoogleSheetsService;
use Google_Client;
use Google_Service_Drive;
use Illuminate\Http\Request;

class DriveController extends Controller
{
    private $client ;
    public function __construct(Google_Client $client)
    {
        $this->client = $client ;

    }

    public function callBack(){
        
    }

    public function auth(Google_Client $client){
        $client->setScopes([Google_Service_Drive::DRIVE_FILE]);
        $authUrl = $client->createAuthUrl();
        return redirect($authUrl);
    }
}
