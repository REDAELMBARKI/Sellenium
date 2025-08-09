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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand');
           
            $table->string('thumbnail')->nullable();
            $table->boolean('is_featured')->default(true);
            $table->integer('rating_count')->unsigned()->default(1)->nullable(true);
            $table->float('rating_average')->unsigned()->default(1.0)->nullable(true);
            $table->boolean('free_shipping')->nullable(true)->default(true);
            $table->float('price')->unsigned();
            $table->text('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
