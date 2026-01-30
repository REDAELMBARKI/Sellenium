<?php

namespace App\Providers;

use Google_Client;
use Illuminate\Support\ServiceProvider;

class GoogleServiceClientProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('googleApp' , function($app){
            $client = new Google_Client() ;
            $client->setAuthConfig(config('google.credentials_path'));
            return $client;
        }) ; 
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
