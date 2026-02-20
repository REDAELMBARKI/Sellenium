<?php

namespace App\Http\Controllers;

use App\Models\ShippingZoneCity;
use App\Services\ShippingService;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    public function calculate($id) {
          validator(
                ['id' => $id],
                ['id' => 'required|numeric|exists:shipping_zone_cities,id']
          )->validate();

          $city = ShippingZoneCity::with('shipping_zone')->findOrFail($id);

          $zone = $city->shipping_zone()->first(['estimated_days' ,'price']);
          return response()->json(['zone' => $zone],200) ;
    }



    public function getCities() {
        $cities =  ShippingZoneCity::all(['id' , 'city']);


        return response()->json(['cities'=> $cities],200) ;
    }
}
