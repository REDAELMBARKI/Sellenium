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
        Schema::create('cover_inventory', function (Blueprint $table) {
            $table->foreignId('cover_id')->references('id')->on('covers')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('inventory_id')->references('id')->on('inventories')->constrained()->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cover_inventory');
    }
};
