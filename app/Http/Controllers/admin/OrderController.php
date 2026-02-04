<?php

namespace App\Http\Controllers\admin;

use App\Http\Resources\OrderResource;
use App\Http\Controllers\Controller;
use App\Models\GoogleSheet;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
  
    
    public function index() {
        $orderService = new OrderService() ;
        $sheet = GoogleSheet::where('key', 'orders')->first();
        return Inertia::render('admin/pages/orders/OrderManager' ,
        [

            'statistics' => $orderService->getStats() ,
            'orders' => $orderService->getOrders() ,
            'sheetUrl' => $sheet?->spreadsheet_url,
        ]
        ) ;

    }

    public function 


}
