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
        Schema::create('shipping_zones' , function(Blueprint $table) {
            $table->id();
            $table->string('name');           // "Major Cities", "Remote Areas"
            $table->decimal('price', 10, 2); // 30.00 MAD
            $table->integer('estimated_days')->nullable(); // 2-3 days
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        }) ;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
