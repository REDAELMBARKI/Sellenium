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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            
            $table->string('name');           // Category name
            $table->string('slug')->unique(); // URL-friendly identifier
            
            $table->foreignId('niche_id')
                ->nullable()                // null = generic category
                ->constrained('niches')
                ->nullOnDelete();           // optional: remove niche, keep category
            
            $table->foreignId('parent_id')    // For subcategories
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();
            
            $table->text('description')->nullable() ;
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
