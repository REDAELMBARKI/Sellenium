<?php

use App\Models\Address;
use App\Models\Product;


use App\Models\User;
use App\Models\OrderAddress;
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
            $table->integer('order_number')->unsigned()->unique();
            $table->foreignIdFor(User::class);
            $table->enum('status',['pending','out_for_delivery','delivery_failed' , 'delivered','canceled' , 'returned'])->default('pending');
            $table->boolean('confirmed')->default(false)->comment('Confirmed by admin/confirmation team');
            $table->decimal('tax', 10, 2)->default(0);
            $table->string('currency', 3)->default('MAD'); // always store the currency 
            $table->enum('payment_method', ['cod', 'card', 'paypal'])->default('cod');
            $table->boolean('paid')->default(false);
            $table->dateTime('paid_at')->nullable();
            $table->float('shipping_cost')->unsigned()->nullable();
            $table->float('discount_amount')->unsigned()->nullable();
            $table->float('total_amount')->unsigned();
            $table->string('notes')->nullable();
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
