<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('home_catalog_sections', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // "Top Deals", "Picked for You"
            $table->string('icon')->nullable();
            $table->json('criteria')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->unique()->default(0); // display order
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_catalog_sections');
    }
};