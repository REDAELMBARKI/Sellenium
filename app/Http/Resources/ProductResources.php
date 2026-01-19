<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResources extends JsonResource
{
    /**
     * Create a new class instance.
     */
    public function toArray(Request $request)
    {
      return $request ;
    }
}
