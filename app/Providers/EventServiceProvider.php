<?php

namespace App\Providers;

use App\Events\OrderConfirmed;
use App\Listeners\DecrementStock;
use App\Listeners\NotifyAdmin;
use App\Listeners\SendInvoice;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{

    protected $listen = [
            OrderConfirmed::class => [
                DecrementStock::class ,
                NotifyAdmin::class ,
                SendInvoice::class
            ]
            ];
    

}
