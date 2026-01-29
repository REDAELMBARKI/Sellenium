<?php
namespace App\Observers;

use App\Models\Order;
use App\Services\Google\GoogleSheetsService;

class OrderObserver
{
    public function created(Order $order)
    {
        // call service to append this order
        app(GoogleSheetsService::class)->appendOrder($order);
    }
}
