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
            $table->string('key');
            $table->string('slug')->unique();
            $table->integer('order')->index();
            
            $table->string('direction', 3)->nullable();

            $table->text('name')->nullable();
            $table->text('subname')->nullable();

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
