<?php

namespace App\Providers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use App\Observers\OrderObserver;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
  
    public function boot(): void
    {
        Order::observe(OrderObserver::class);
        Vite::prefetch(concurrency: 3);
        Route::middleware('web') 
            ->group(base_path('routes/web.php'));
        Route::middleware('web')
            ->group(base_path('routes/api.php'));
        Route::middleware('web')
            ->group(base_path('routes/auth.php'));

        //gates
        Gate::define('manage-products' , function(User $user){
            $role = Role::where('name' , 'manage-products')->first() ;
            if(!$role) return false;
            return collect($role->actors)->some(fn($actor)=>
                 $actor->id === $user->id
            );
        });


        Gate::define('manage-orders' , function(User $user ){
            $role = Role::where('name' , 'manage-orders')->first() ;
            if(!$role) return false;
            return collect($role->actors)->some(fn($actor)=>
                 $actor->id === $user->id
            );
        });
    }
}
