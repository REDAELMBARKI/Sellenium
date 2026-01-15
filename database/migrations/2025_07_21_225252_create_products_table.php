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
            $table->string('name')->nullable();        // user might not fill yet
            $table->string('brand')->nullable();       // optional in draft
            $table->text('description')->nullable();   // optional in draft
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('old_price', 10, 2)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_free_shipping')->default(false);
            $table->enum('status', ['draft','published'])->default('draft');
            // Ratings
            $table->float('rating_average', 3, 2)->nullable()->default(null); // average rating
            $table->unsignedInteger('rating_count')->default(0);
           
            $table->json('shipping')->nullable();
            $table->json('aggregated_attributes')->nullable(); // this stores cashed varaints attributes for first fitch {colors : [] , sizes: []}
            $table->json('inventory')->nullable();
            $table->json('meta')->nullable();
            $table->json('vendor')->nullable();
            $table->string('made_country')->nullable() ;
            $table->string('release_date')->nullable() ;
            // Relational / foreign keys
            $table->foreignId('category_nich_id')
            ->nullable()
            ->default(null)
            ->constrained('category_niches')
            ->nullOnDelete();
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
