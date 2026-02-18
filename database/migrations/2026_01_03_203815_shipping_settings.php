<?php

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
        Schema::create('shipping_settings', function (Blueprint $table) {
            $table->id();
            $table->decimal('free_shipping_threshold', 10, 2)->nullable(); // 500 MAD
            $table->decimal('base_weight_kg', 8, 2)->nullable();           // 2kg
            $table->decimal('extra_kg_price', 8, 2)->nullable();           // 5 MAD/kg
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
