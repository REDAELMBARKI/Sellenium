<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $users = User::all()->random(3);
        
        foreach ($users as $user) {
          
            $products = Product::all()->random(3);  
             foreach ($products as $product) {
                     $product = Cart::where('user_id', $user->id)
                      ->where('product_id' , $product->id)->first();
                        if($product){
                            $product->quantity += 1;
                            $product->save();
                        }
                        else{
                          Cart::factory()->create() ;
                        }
             }
        }      
    }
}
