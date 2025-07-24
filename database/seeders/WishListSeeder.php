<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use App\Models\WishList;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WishListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all()->random(3);
        $products = Product::all();
        foreach ($users as $user)
            $randomproducts = $products->random(3);
        foreach ($randomproducts as $randomproduct) {

            $exists = WishList::where("user_id", $user->id)
                ->where('product_id', $randomproduct->id)
                ->first();
            if ($exists) {
                $this->command->warn('this product is already exist in wishllist');
            } else {
                WishList::factory()->create([
                    'user_id' => $user->id,
                    'product_id' => $randomproduct->id
                ]);
            }
        }
    }
}
