<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;

class SocialiteProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Register "google-login" as a Google driver
        Socialite::extend('google-login', function ($app) {
            $config = $app['config']['services.google-login'];
            return Socialite::buildProvider(GoogleProvider::class, $config);
        });

        // Register "google-drive" as another Google driver
        Socialite::extend('google-drive', function ($app) {
            $config = $app['config']['services.google-drive'];
            return Socialite::buildProvider(GoogleProvider::class, $config);
        });
    }
}
