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
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('banner_type'); // overlay, lifestyle-inset, double-media
            $table->integer('sort_order')->index(); // For your Move Up/Down logic
            
            // Nullable for banners with only one card/full background
            $table->string('direction', 3)->nullable();

            // Text Content
            $table->text('title')->nullable();
            $table->text('subtitle')->nullable();

            // Foreign Keys to Media Table
            $table->foreignId('main_media_id')
                  ->nullable()
                  ->constrained('media')
                  ->onDelete('set null');

            $table->foreignId('secondary_media_id')
                  ->nullable()
                  ->constrained('media')
                  ->onDelete('set null');

            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
