<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
      public function index()
    {
        $promotions = Promotion::where('is_active', true)
            ->whereNull('valid_until')
            ->orWhere('valid_until', '>', now())
            ->get();
      
        return response()->json($promotions);
    }

}
