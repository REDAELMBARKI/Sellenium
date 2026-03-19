<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Services\Discount\PromotionService;
use Illuminate\Http\Request;

class PromotionController extends Controller
{


    public function __construct(private PromotionService $promotionService)
    {
        throw new \Exception('Not implemented');
    }
      public function getAll()
    {
        $promotions = $this->promotionService->getDbPromotions();
      
        return response()->json($promotions);
    }

}
