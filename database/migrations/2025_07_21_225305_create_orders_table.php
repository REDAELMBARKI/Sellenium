<?php

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->integer('order_number')->unsigned();
            $table->foreignIdFor(Product::class);
            $table->foreignIdFor(User::class);
            $table->string('address');
            $table->enum('status',['pending','delivered','canceled'])->default('pending');
            $table->float('shipping_cost')->unsigned()->nullable();
            $table->float('discount_amount')->unsigned()->nullable();
            $table->string('notes')->nullable();
            $table->float('total_amount')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
