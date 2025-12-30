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
        Schema::create('products_attributes', function (Blueprint $table) {
        $table->id();
        $table->string('owner_type');   // product | variant
        $table->unsignedBigInteger('owner_id'); // product_id / variant_id
        $table->string('namespace');    // niche
        $table->string('key');
        $table->string('type');         // string | number | list | json
        $table->json('value')->nullable();
        $table->timestamps();

        $table->index(['owner_type','owner_id']);
        $table->index(['namespace','key']);
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products_attributes');
    }
};
