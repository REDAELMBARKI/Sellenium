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
            $table->json('aggregated_attributes')->nullable(); // this stores cashed varaints attributes for first fitch {colors : [] , sizes: []}
            $table->string('name');
            $table->string('brand');
            // Shared / descriptive fields
            $table->text('description')->nullable();

            $table->boolean('is_featured')->default(false);
            $table->boolean('is_free_shipping')->default(false);

            // Ratings
            $table->float('rating_average', 3, 2)->nullable()->default(null); // average rating
            $table->unsignedInteger('rating_count')->default(0);               // number of ratings
            // Relational / foreign keys
            $table->foreignId('niche_id')->constrained('niches'); // assuming you have a niches table
            $table->json('aggregated_attributes')->nullable(); // fast filters / first fetch
            $table->json('attributes')->nullable();            // niche-specific info
          
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
