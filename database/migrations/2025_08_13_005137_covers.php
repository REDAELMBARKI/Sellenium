<?php

use App\Models\Inventory;
use App\Models\Product;
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
        Schema::create('covers', function (Blueprint $table) {
            $table->id();

            // Polymorphic owner
            $table->string('owner_type');   // Product or Variant
            $table->unsignedBigInteger('owner_id');

            $table->string('path');

            // what this media is used for
            $table->enum('type', [
                'thumbnail',
                'gallery',
                'variant',
                'video'
            ]);

            $table->unsignedInteger('position')->default(0);
            $table->string('alt_text')->nullable();

            $table->timestamps();

            $table->index(['owner_type', 'owner_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('covers');
    }
};
