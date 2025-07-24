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
        $products = Product::all();
        foreach ($users as $user) {
           
             $randomproducts =  $products->random(3);  
             foreach ($randomproducts as $randomproduct) {
                     $product = Cart::where('user_id', $user->id)
                      ->where('product_id' , $randomproduct->id)->first();
                        if($product){
                            $product->quantity += 1;
                            $product->save();
                        }
                        else{
                          Cart::factory()->create([
                                'user_id'=> $user->id,
                                'product_id'=> $randomproduct->id,
                                'quantity'=> 1
                          ]) ;
                        }
             }
        }      
    }
}
